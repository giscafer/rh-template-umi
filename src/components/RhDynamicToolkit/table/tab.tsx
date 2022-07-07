/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-06-27 18:32:02
 * @description
 * Focas 批量新增属性
 * 功能说明:
 * 1、动态json渲染，tab，radio，table配置动态渲染，table在 focas 协议中是 datasource 配置好的，将来可能要支持走接口请求
 * 2、根据轴数进行动态新增轴参数
 * 3、不同tab下（channel）渲染模版数据，支持分别选择记录新增
 */
import { httpGet } from '@/shared/http';
import { EditableFormInstance, EditableProTable } from '@ant-design/pro-table';
import { Button, Radio, Tabs } from 'antd';
import {
  cloneDeep,
  compact,
  difference,
  differenceBy,
  flatten,
  map,
  noop,
  remove,
  template,
  uniq,
  uniqueId,
  without,
} from 'lodash';
import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { isNotEmpty, rowDataNotNil } from '../utils';

import { evalFormula, resolveVariableAndFilter } from '../utils/formula';
import { evalExpression } from '../utils/tpl';
import './styles.less';

export type RhDynamicTabTableProps = {
  schema: Record<string, any>;
  params?: Record<string, any>;
  data?: {
    /**
     * 轴数量
     */
    axisCount?: number;
    /**
     * 过滤数据的id数组
     */
    excludeIds?: string[];
    /**
     * 动态tab数据
     */
    tabList?: Record<string, any>[];
  };
  onCancel?: (e: any) => void;
  onConfirm?: (v: any[]) => void;
};

function RhDynamicTabTable({
  schema,
  params = {},
  data = { axisCount: 3 },
  onCancel = noop,
  onConfirm = noop,
}: RhDynamicTabTableProps) {
  const actionRef = useRef<any>();
  const editorFormRef = useRef<EditableFormInstance<any>>();
  // 缓存数据
  const cacheRef = useRef<any>({});
  // 存储查询条件和表格数据:rowKey 表格主键id，_tabKey tabs的字段，_radioKey radio字段
  const argRef = useRef<any>({});
  // 表格记录编辑态和actionRef无法动态定义，只能采用同一个 state 来控制表格的数据
  const [dataSource, setDataSource] = useState([]);
  const [dataSourceApi, setDataSourceApi] = useState('');
  const [editableKeys, setEditableRowKeys] = useState<React.Key[]>([]);
  const [selectedRowKeys, setSelectedRowKeys] = useState([]);

  const getColumns = useCallback(
    (fieldList) => {
      if (!fieldList?.length) {
        return [];
      }
      const columnList = fieldList.map((field) => {
        const { width, quickEdit, dependencies, id: dataIndex, label: title, ...other } = field;
        let initialValue = other.defaultValue;
        let valueEnum = other.valueEnum;
        // 表单验证---start----
        const rules: any[] = [
          {
            required: !!quickEdit?.required,
            message: '此项是必填项',
          },
        ];
        if (quickEdit?.validator?.length) {
          for (const item of quickEdit?.validator) {
            if (item.type === 'pattern' && item.value) {
              rules.push({
                pattern: new RegExp(item.value),
                message: item.message || '格式不正确',
              });
            }
          }
        }
        // 去重判断

        if (['propertyId', 'name', 'address'].includes(dataIndex)) {
          const validatorFunc = async (rule, v: string) => {
            if (typeof v === 'undefined') return;
            // 判断方式存在重复的值
            const tabValue = argRef.current[argRef.current._tabKey];
            const dataList = cacheRef.current[tabValue] || [];
            // 因为dataList里边缓存了本身，所以判断>1
            let flag = dataList.filter((d) => d[dataIndex] === v)?.length > 1;
            let messageInfo = '存在重复的值';
            // 外部传入的过滤的值也不能重复
            if (!flag && dataIndex === 'propertyId' && data?.excludeIds?.length > 0) {
              flag = data?.excludeIds.includes(v);
              messageInfo = '存在相同的属性ID已被添加';
            }
            // validateFirst 有bug，先临时解决
            if (valueEnum?.required) {
              flag = flag && isNotEmpty(v);
            }
            if (flag) {
              return Promise.reject(messageInfo);
            }
            return;
          };
          rules.push({
            validator: validatorFunc,
          });
        }
        // 表单验证---end----
        // 联动渲染---start----
        if (dependencies?.length > 0) {
          dependencies.map((dependency) => {
            if (dependency?.type === 'linkage') {
              // 联动渲染下拉
              const { defaultValue, valueEnum: options, expression } = dependency;
              const propertyType = argRef.current[argRef.current._radioKey];
              if (evalFormula(expression, { propertyType })) {
                initialValue = defaultValue;
                valueEnum = options;
              }
            }
          });
        }
        // 联动渲染---end----
        const c = {
          title,
          dataIndex,
          width: width || 80,
          formItemProps: {
            rules,
            initialValue,
          },
          ...other,
        };
        // 格式转换（json格式为了和form统一，所以麻烦转换一下而已）
        if (valueEnum?.length > 0) {
          const options = valueEnum.reduce((acc, obj) => {
            acc[obj.value] = obj.label;
            return acc;
          }, {});

          c.valueEnum = options;
        }

        return c;
      });
      const radioValue = argRef.current[argRef.current._radioKey];
      // 当pmc和宏变量时，显示移除按钮
      if (radioValue === 'pmc' || radioValue === 'macro') {
        columnList.push({
          title: '操作',
          valueType: 'option',
          width: 50,
          render: () => {
            return null;
          },
        });
      }
      return columnList;
    },
    [data?.excludeIds],
  );

  // 获取tabs 数据
  const getList = useCallback(
    async (tableParams = {}) => {
      const keyValue = argRef.current[argRef.current._tabKey];

      // console.log('keyValue=', keyValue);

      if (!dataSourceApi) {
        return Promise.resolve({});
      }
      // 如果存在，则不再请求接口
      if (cacheRef.current[keyValue]?.length > 0) {
        return Promise.resolve(cacheRef.current[keyValue]);
      }
      //  如果 dataSource 是数组，从配置好的数据，初始化数据
      if (Array.isArray(dataSourceApi)) {
        let cloneData: any[] = cloneDeep(dataSourceApi);
        // 这里基本就已经不是定死为属性弹窗了。。。业务性太强
        // 默认3轴，多出的按 ABC来动态新增轴参数，并动态改propertyId/name/address 字段字母信息
        if (data.axisCount > 3) {
          const axisList = cloneData.filter((d) => d.propertyType === 'axis' && d.propertyId.indexOf('X_') === 0);
          let count = data.axisCount - 3;
          const axisMap = ['A', 'B', 'C'];
          let start = -1;
          while (++start < count) {
            // eslint-disable-next-line no-loop-func
            const aList = axisList.map((a) => {
              const obj = {
                id: uniqueId('_dyn_'),
                ...a,
                propertyId: a.propertyId.replace('X_', `${axisMap[start]}_`),
                name: a.name.replace('X', `${axisMap[start]}`),
                address: a.address.replace('/Channel1/X', `/Channel1/${axisMap[start]}`),
              };
              return obj;
            });

            cloneData = cloneData.concat(aList);
          }
        }
        if (data?.excludeIds?.length > 0) {
          // 过滤数据（已新增过的数据不再在列表显示）
          cloneData = cloneData.filter((d) => {
            const propertyId = d[argRef.current.rowKey];
            // const channel = argRef.current[argRef.current._tabKey];
            // if (data.excludeIds?.includes(`${propertyId}.${channel}`)) {
            if (data.excludeIds?.includes(propertyId)) {
              return false;
            }
            return true;
          });
        }
        const arr = cloneData.map((d) => {
          if (!d.id) {
            d.id = uniqueId('_dyn_');
          }
          // 除了 PMC 其他点位信息 channel1 选择了，channel2 也可以选择
          // 如果有多个Channel，则Channel1中属性遵循附件4 的命名标准，Channel2默认在属性名后面加数字2，Channel3-8以此类推；
          if (keyValue !== 'Channel1') {
            const suffix = keyValue.replace('Channel', '');
            d.propertyId = d.propertyId + suffix;
            d.name = d.name + suffix;
          }

          if (d.address) {
            // 动态换掉采集地址
            d.address = d.address.replace('/Channel1', `/${keyValue}`);
          }
          return d;
        });
        cacheRef.current[keyValue] = arr;
        return Promise.resolve(arr);
      }
      // 如果 dataSource是接口地址，从接口获取数据
      const apiUrl = template(dataSourceApi)(params);
      const tabKeyObj = { [argRef.current._tabKey]: keyValue };
      const qryParams = { ...tableParams, ...tabKeyObj };
      return httpGet(apiUrl, qryParams).then((res) => {
        if (res?.data?.list) {
          // 根据查询条件缓存数据
          cacheRef.current[keyValue] = res.data.list;
          // 缓存上一次的数据 todo
          // 设置新数据
          return res?.data?.list || [];
        }
        return cacheRef.current[keyValue] || [];
      });
    },
    // 避免频繁触发渲染
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [JSON.stringify(dataSourceApi), JSON.stringify(params), data?.excludeIds, data.axisCount],
  );

  // 根据查询条件过滤
  const load = useCallback(() => {
    getList().then((data) => {
      const keyValue = argRef.current[argRef.current._tabKey];

      let totalSelectedKeys = cacheRef.current[keyValue + '_selected'] || [];
      if (argRef.current._radioKey) {
        const radioKey = argRef.current._radioKey;
        const radioValue = argRef.current[argRef.current._radioKey];
        const filterData = data.filter((d) => d[radioKey] === radioValue);
        setDataSource(filterData);
      } else {
        setDataSource(data);
      }

      setSelectedRowKeys(totalSelectedKeys);
      // TODO：可编辑才做校验
      setTimeout(() => {
        editorFormRef.current?.validateFields();
      }, 16);
    });
  }, [getList]);

  useEffect(() => {
    load();
  }, [load]);

  const handleSelected = useCallback(
    (selectedKeys) => {
      const keyValue = argRef.current[argRef.current._tabKey];
      let totalSelectedKeys = cacheRef.current[keyValue + '_selected'] || [];
      // 将新选中的记录合并到历史选中数组
      totalSelectedKeys = totalSelectedKeys.concat(selectedKeys);
      // 部分选中的时候，当不选中时，需要去掉totalSelectedKeys里边已经存储的key
      if (selectedKeys.length >= 0) {
        // 这里是部分选中或者不选
        const keys = map(dataSource, 'id');
        const uncheckedKeys = difference(keys, selectedKeys);

        totalSelectedKeys = without(totalSelectedKeys, ...uncheckedKeys);
      }
      const finalKeys = uniq(totalSelectedKeys);
      // 缓存数据
      cacheRef.current[keyValue + '_selected'] = finalKeys;
      // 设置当前表格选中记录
      setSelectedRowKeys(selectedKeys);
    },
    [dataSource],
  );

  const genRadioGroup = useCallback(
    (valueEnum, defaultValue?: string | number) => {
      const dVal = defaultValue ?? valueEnum?.[0]?.value;
      return (
        <Radio.Group
          key={argRef.current._radioKey}
          defaultValue={dVal}
          buttonStyle="solid"
          className="custom"
          onChange={(e) => {
            const v = e.target.value;
            // console.log('argRef.current=', argRef.current);

            argRef.current[argRef.current._radioKey] = v;
            load();
          }}
        >
          {valueEnum?.map((option) => {
            return (
              <Radio.Button key={option.value} value={option.value}>
                {option.label}
              </Radio.Button>
            );
          })}
        </Radio.Group>
      );
    },
    [load],
  );

  const handleAdd = useCallback(() => {
    // 隐藏默认的新增按钮，通过次方式hack
    const btn: HTMLElement = document.querySelector('.dynamicComplexTable .ant-table-thead button.ant-btn-dashed');
    btn.click?.();
  }, []);

  /**
   * 可编辑记录的新增和删除
   * @param type 非change时表示行记录表单内容变更，非新增和删除
   */
  const handleEditorChange = useCallback(
    (recordList, type = 'change') => {
      const tabKey = argRef.current._tabKey;
      const tabValue = argRef.current[tabKey];

      // 当前tab下缓存的数据
      const cacheData = cacheRef.current[tabValue] || [];

      const valueKeys = map(recordList, 'id');
      const dataSourceKeys = map(dataSource, 'id');
      const diffRecords = differenceBy(dataSource, recordList, 'id');
      const diffKeys = map(diffRecords, 'id');
      // 表格实时编辑新增和移除，动态更新缓存
      if (diffKeys.length > 0) {
        // 原来的数据被移除了
        remove(cacheData, (n) => diffKeys.includes(n['id']));
      } else if (diffKeys.length === 0 && recordList.length === dataSourceKeys.length) {
        // 数据没有变化
      } else if (diffKeys.length === 0) {
        // 数据变化新增了
      }

      if (type === 'change') {
        // 当前tab下缓存已选的记录
        const cacheSelectedKey = cacheRef.current[tabValue + '_selected'] || [];
        // 将pmc 和 宏变量的属性 都默认选中
        const keys = map(recordList, 'id');
        if (keys.length > 0) {
          cacheRef.current[tabValue + '_selected'] = [...cacheSelectedKey, ...keys];
        }
        setSelectedRowKeys(keys);
      }
      // 刷新当前列表
      setDataSource(recordList);

      // 去掉缓存中的列表一样key的数据，使用新的数据更新缓存
      const filterCacheData = cacheData.filter((item) => !valueKeys.includes(item['id']));
      cacheRef.current[tabValue] = [...filterCacheData, ...recordList];

      // 校验必填项（首行不会影响）
      setTimeout(async () => {
        const valid = await editorFormRef.current?.validateFields();
        console.log('validateFields', valid);
      }, 16);
    },
    [dataSource],
  );

  const genTableBlock = useCallback(
    (tableSchema: AnyObject, id?: string) => {
      const { fields, toolbar, editable, recordCreatorProps } = tableSchema;
      if (!argRef.current.fields) {
        argRef.current.fields = fields;
      }
      // const tableProps: any = {};
      const columns = getColumns(fields);
      let customToolBar = null;
      const toolBarClassName = toolbar?.className ?? '';
      if (toolbar?.body?.length > 0) {
        customToolBar = toolbar?.body.map((item) => {
          if (item.renderType === 'radio') {
            let valueEnum = item.valueEnum || [];
            // radio 支持动态数据渲染
            if (item?.source && (data || tableSchema?.data)) {
              valueEnum = resolveVariableAndFilter(item.source, data || tableSchema?.data);
            }
            if (!argRef.current._radioKey) {
              const val = valueEnum[0] ? valueEnum[0]['value'] : '';
              argRef.current._radioKey = item.id || 'radioKey';
              argRef.current[argRef.current._radioKey] = val;
            }

            return genRadioGroup(valueEnum);
          }
          return null;
        });
      }
      if (editable) {
        // 渲染新增记录按钮
        if (recordCreatorProps !== false && recordCreatorProps !== null) {
          const { buttonProps, creatorButtonText, visibleOn } = recordCreatorProps || {};
          let visible = true;
          if (visibleOn) {
            const val = argRef.current[argRef.current._radioKey];
            visible = evalExpression(visibleOn, { [argRef.current._radioKey]: val });
          }
          const recordCreatorBtn = (
            <Button key="add" {...buttonProps} onClick={handleAdd}>
              {creatorButtonText ?? '新增'}
            </Button>
          );
          if (visible) {
            if (customToolBar) {
              customToolBar.push(recordCreatorBtn);
            } else {
              customToolBar = [recordCreatorBtn];
            }
          }
        }
      }
      argRef.current.rowKey = tableSchema.rowKey;
      const radioKey = argRef.current._radioKey;
      // const tabKey = argRef.current._tabKey;
      return (
        <div style={{ width: '800px' }}>
          <EditableProTable<any>
            className="mt0"
            actionRef={actionRef}
            editableFormRef={editorFormRef}
            rowKey="id"
            loading={false}
            columns={columns}
            value={dataSource}
            scroll={{ x: 700, y: 360 }}
            recordCreatorProps={{
              position: 'top',
              newRecordType: 'dataSource',
              record: () => {
                const radioKey = argRef.current._radioKey;
                const tabKey = argRef.current._tabKey;
                const propertyId = uniqueId('ID_');
                const propertyType = argRef.current[radioKey];
                let address = `/${argRef.current[tabKey]}/${propertyId}`;
                if (propertyType === 'pmc') {
                  address = `/${argRef.current[tabKey]}/PMC(${uniqueId('X')})`;
                } else if (propertyType === 'macro') {
                  address = `/${argRef.current[tabKey]}/Macro(${uniqueId()})`;
                }
                const row = {
                  id: uniqueId('_dyn_'),
                  // [argRef.current.rowKey]: propertyId,
                  [radioKey]: propertyType,
                  address,
                };
                return row;
              },
            }}
            editable={
              {
                type: 'multiple',
                key: 'id',
                editableKeys,
                deleteText: '移除',
                onSave: async (rowKey, data, row) => {
                  // handleSave(rowKey, data, row);
                },
                actionRender: (row, config, defaultDoms) => {
                  return [<span className="red">{defaultDoms.delete}</span>];
                },
                onValuesChange: (record, recordList) => {
                  // 修改记录内容事件
                  handleEditorChange(recordList, 'value');
                },
                onChange: setEditableRowKeys,
              } as any
            }
            onChange={(recordList) => handleEditorChange(recordList)}
            rowSelection={{
              selectedRowKeys,
              onChange: (selectedKeys: React.Key[], selectedRows: any[]) => {
                handleSelected(selectedKeys);
              },
              getCheckboxProps: (record) => ({
                disabled: argRef.current[radioKey] === 'pmc' || argRef.current[radioKey] === 'macro', // Column configuration not to be checked
                id: record.id,
              }),
            }}
            pagination={false}
            tableClassName={toolBarClassName}
            toolbar={{
              title: customToolBar[0],
              actions: [customToolBar.slice(1)],
            }}
            tableAlertRender={false}
          />
        </div>
      );
    },
    [
      getColumns,
      dataSource,
      editableKeys,
      selectedRowKeys,
      data,
      genRadioGroup,
      handleAdd,
      handleEditorChange,
      handleSelected,
    ],
  );

  const genTabsTable = useCallback(
    (tabValueEnum, block, index) => {
      return (
        <div key={index}>
          <Tabs
            defaultActiveKey="1"
            key="tabs"
            onChange={(v) => {
              argRef.current[block.tabs?.id || 'tabKey'] = v;
              load();
            }}
          >
            {tabValueEnum?.map((tab) => {
              return (
                <Tabs.TabPane key={tab.value} tab={tab.label}>
                  {/* {genTableBlock(block, tab.value)} */}
                </Tabs.TabPane>
              );
            })}
          </Tabs>
          <div key="table-wrapper">{genTableBlock(block, block.tabs?.id)}</div>
        </div>
      );
    },
    [genTableBlock, load],
  );

  const bodyNode = useMemo(() => {
    const schemaBodyList = Array.isArray(schema) ? schema : [schema];
    return schemaBodyList?.map((block, index) => {
      if (block?.type === 'tab-table') {
        // 判断是否为空避免频繁触发渲染
        if (!dataSourceApi) {
          setDataSourceApi(block.dataSource);
        }

        // tabs 多表格情况
        if (block?.tabs && (block?.tabs.valueEnum || block?.tabs.source)) {
          if (!argRef.current._tabKey) {
            const q = data?.tabList?.length > 0 ? data?.tabList[0]['value'] : '';
            argRef.current._tabKey = block?.tabs?.id || 'tabKey';
            argRef.current[argRef.current._tabKey] = q;
          }

          // tabs支持动态数据渲染
          if (block?.tabs.source && (data || block?.data)) {
            const valueEnum = resolveVariableAndFilter(block?.tabs.source, data || block?.data);
            if (valueEnum?.length > 0) {
              cacheRef.current.tabKeyList = valueEnum.map((a) => a.value);
              // tabs>tab 内都是独立的表格
              return genTabsTable(valueEnum, block, index);
            } else {
              return genTableBlock(block);
            }
          }
        } else {
          // simple table block
          return genTableBlock(block);
        }
      }
      return null;
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [JSON.stringify(data), genTableBlock, genTabsTable, JSON.stringify(schema)]);

  const handleConfirm = useCallback(() => {
    const tabKeyList = cacheRef.current.tabKeyList;
    // const rowKey = argRef.current.rowKey;
    // 依次从每个tab（channel）取出属性数据
    const result = tabKeyList.map((tabKey) => {
      const dataList = cacheRef.current[tabKey] || [];
      const selectedKeys = cacheRef.current[tabKey + '_selected'] || [];
      const selectedRows = dataList.filter((row) => selectedKeys.includes(row['id']));
      // 组织后端结构返回（todo: 后期如果复用组件改造，这里可以在业务层面处理）
      const formatObjList = selectedRows.map((row) => {
        const { propertyId, name, address, valueType, authority } = row;
        if (!rowDataNotNil({ propertyId, name, address, valueType, authority })) {
          return null;
        }
        const obj = {
          propertyId,
          name,
          description: name,
          scanCycle: 1000,
          collection: {
            address,
            valueType,
            authority,
          },
        };
        return obj;
      });
      return compact(formatObjList);
    });
    const flatResult = flatten(result);
    console.log(flatResult);
    onConfirm(flatResult);
  }, [onConfirm]);

  return (
    <div className="dynamicComplexTable">
      {bodyNode}
      <div className="ant-modal-footer mt2">
        <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
          <Button type="default" onClick={onCancel}>
            取消
          </Button>
          <Button type="primary" onClick={handleConfirm}>
            确定
          </Button>
        </div>
      </div>
    </div>
  );
}

export default RhDynamicTabTable;
