/* eslint-disable @typescript-eslint/no-unused-vars */
/**
 * @author giscafer
 * @email giscafer@outlook.com
 * @ Modified time: 2022-05-13 16:58:43
 * @desc 通用封装，目的是为了精简写法和改造UI规范，唯一不变原则： ProTable 原 Api 一致性不变
 */

import RhEmpty from '@/components/RhEmpty';
import TableMulSelect from '@/components/RhTableMulSelected';
import { SearchOutlined } from '@ant-design/icons';
import type { ProFormColumnsType, ProFormInstance } from '@ant-design/pro-form';
import {
  BetaSchemaForm,
  LightFilter,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-form';
import type { ParamsType } from '@ant-design/pro-provider';
import ProTable from '@ant-design/pro-table';
import type { ProColumns } from '@ant-design/pro-table/lib/typing';
import { useDebounceFn } from 'ahooks';
import { Popconfirm } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { isNumber, noop } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useVT } from 'virtualizedtableforantd4';
import useColumnCache from './cache';
import ColumnSetting from './ColumnSetting';
import EditableCell from './editable/cell';
import EditableRow from './editable/row';
import './index.less';
import { RhActionType, RhColumns, RhTableProps } from './types';

const RhTable = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>(
  props: RhTableProps<DataType, Params, ValueType>,
) => {
  const {
    columns = [],
    search,
    debounceTime = 500,
    virtual = false,
    resetPageIndex = true,
    resetPageInParams = false,
    extraParams = {},
    scroll = { x: 1400 },
    tableAlertRenderProps = {},
    pagination = {},
    searchSpan,
    locale = { emptyText: RhEmpty },
    headerTitle,
    titleInline = false,
    toolBarRender = false,
    request,
    customToolBarRender,
    ...restProps
  } = props;
  const [renderColumns, setRenderColumns] = useState<any[]>([]);
  const queryFilterFormRef = useRef<ProFormInstance>();
  const lightFilterFormRef = useRef<ProFormInstance>();
  const defaultActionRef = useRef<RhActionType>();
  const [loading, setLoading] = useState(false);
  const [vt] = useVT(() => {
    return {
      scroll: { y: isNumber(scroll?.y) ? scroll!.y : 600 },
    };
  });

  const actionRef = (props.actionRef ||
    defaultActionRef) as React.MutableRefObject<RhActionType>;

  const onConfirmRef = useRef<() => void>();
  // 缓存列配置
  const { columnCache, setColumnCache, clearColumnCache } = useColumnCache(
    props.id,
    columns,
  );

  const tableReload = useCallback(() => {
    actionRef.current.pageInfo.current = 1;
    return actionRef.current?.reload(resetPageIndex);
  }, [actionRef, resetPageIndex]);

  const { run } = useDebounceFn(
    // 搜索时重置到第一页
    tableReload,
    { wait: debounceTime },
  );

  // 设置一些默认值&操作列渲染
  useEffect(() => {
    if (!columnCache?.length) {
      return;
    }

    for (const item of columnCache) {
      for (const item2 of columns) {
        if (item.dataIndex === item2.dataIndex) {
          item.title = item2.title;
          item.render = item2.render;
          item.renderFormItem = item2.renderFormItem;
        }
      }
    }
    const tableColumns = columnCache.map((item: any) => {
      item.key = item.key || item.dataIndex;
      if (item.ellipsis !== false && item.valueType !== 'option') {
        item.ellipsis = true;
      }

      /* if (item.valueType === 'option') {
        // 操作列
        item.title = columnSettingRenderHandle(item);
      } */

      item.onCell = (record: Record<string, any>, rowIndex: number) => ({
        record,
        // rowIndex,
        dataIndex: item.dataIndex,
        quickEdit: item.quickEdit,
        onSave: restProps.editable?.handleSave ?? noop,
      });
      return item;
    });
    setRenderColumns(tableColumns);
  }, [columnCache, columns, restProps.editable?.handleSave]);

  // 查询列定义
  const filterColumns: RhColumns[] = useMemo(() => {
    const defaultFilterType = search ? search.filterType : 'query';

    return columns
      .map((column: any) => {
        const {
          search: columnSearch,
          hideInSearch = true,
          valueType = 'text',
          valueEnum,
          title,
          filterType = defaultFilterType,
          fieldProps = {},
          formItemProps = {},
        } = column;

        if (
          columnSearch === false ||
          hideInSearch === true ||
          valueType === 'option'
        ) {
          return false;
        }

        return {
          ...column,
          filterType,
          valueType: valueEnum ? 'select' : valueType,
          fieldProps: {
            allowClear: true,
            ...fieldProps,
            size: fieldProps.size || 'large',
            suffix: (
              <SearchOutlined
                onClick={() => {
                  onConfirmRef.current?.();
                  run();
                }}
                style={{ cursor: 'pointer', fontSize: 22, color: '#9EA5B2' }}
              />
            ),
            placeholder:
              fieldProps.placeholder ||
              ([
                'date',
                'dateTime',
                'dateWeek',
                'dateMonth',
                'dateQuarter',
                'dateYear',
                'dateRange',
                'dateTimeRange',
                'time',
                'timeRange',
                'select',
                'color',
              ].includes(valueType)
                ? `请选择${title}`
                : `请输入${title}`),
            onKeyPress: (e: React.KeyboardEvent<HTMLInputElement>) => {
              if (e.key === 'Enter') {
                onConfirmRef.current?.();
                run();
              }
            },
          },
          formItemProps: {
            ...formItemProps,
            label: '',
          },
        };
      })
      .filter(Boolean);
  }, [columns, run, search]);

  // query查询列定义
  // 给 20000 order 默认值是为了提供只需要部分排序的功能
  const sorter = useCallback((a: any, b: any) => {
    const aOrder = a.order === undefined ? 20000 : a.order;
    const bOrder = b.order === undefined ? 20000 : b.order;
    return aOrder - bOrder;
  }, []);

  const queryFilterColumns = useMemo(() => {
    return filterColumns
      .filter((column) => column.filterType === 'query')
      .sort(sorter) as ProFormColumnsType[];
  }, [filterColumns, sorter]);

  // light查询列定义
  const lightFilterColumns = useMemo(() => {
    return filterColumns
      .filter((column) => column.filterType === 'light')
      .sort(sorter) as ProFormColumnsType[];
  }, [filterColumns, sorter]);

  const renderProFormItem = useCallback(
    (column: {
      [x: string]: any;
      valueType: any;
      dataIndex: any;
      title: any;
      valueEnum: any;
      renderFormItem: any;
      fieldProps?: { size: string } | undefined;
    }) => {
      const {
        valueType,
        dataIndex,
        title,
        valueEnum,
        renderFormItem,
        fieldProps = { size: 'large' } as any,
        ...resetProps
      } = column;

      if (renderFormItem) {
        return renderFormItem();
      }

      if (valueType === 'digit') {
        return (
          <ProFormDigit
            key={dataIndex}
            name={dataIndex}
            label={title}
            fieldProps={fieldProps}
          />
        );
      }

      if (valueType === 'date') {
        return (
          <ProFormDatePicker
            key={dataIndex}
            name={dataIndex}
            label={title}
            fieldProps={fieldProps}
          />
        );
      }

      if (valueType === 'dateRange') {
        return (
          <ProFormDateRangePicker
            key={dataIndex}
            name={dataIndex}
            label={title}
            fieldProps={fieldProps}
          />
        );
      }

      if (valueType === 'select' || valueEnum) {
        const showEnumSelect: boolean =
          (valueEnum && Object.keys(valueEnum).length > 0) ||
          !!fieldProps?.options?.length;
        return (
          showEnumSelect && (
            <ProFormSelect
              key={dataIndex}
              name={dataIndex}
              label={title}
              valueEnum={valueEnum}
              fieldProps={fieldProps}
              {...resetProps}
            />
          )
        );
      }
      if (valueType === 'text' || !valueType) {
        return (
          <ProFormText
            key={dataIndex}
            name={dataIndex}
            label={title}
            fieldProps={fieldProps}
            footerRender={(onConfirm) => {
              onConfirmRef.current = onConfirm;
              return false;
            }}
          />
        );
      }

      return null;
    },
    [],
  );

  const onRequest = useCallback(
    async (
      pageInfo: { current: any; pageSize: any },
      sort: Record<string, SortOrder>,
    ) => {
      if (!restProps.hideLoading) {
        setLoading(true);
      }
      if (resetPageInParams) {
        queryFilterFormRef.current?.resetFields();
        lightFilterFormRef.current?.resetFields();
      }
      const queryFormData = queryFilterFormRef.current?.getFieldsValue() || {};
      const lightFormData = lightFilterFormRef.current?.getFieldsValue() || {};
      const queryParams = { ...queryFormData, ...lightFormData };

      if (actionRef?.current) {
        actionRef.current.pageInfo.params = queryParams;
      }

      const { current, pageSize } = pageInfo;

      // current 是兼容老写法
      /*    const params = {
        page: current,
        current,
        pageSize,
        ...queryParams,
        ...extraParams,
      }; */
      const params = {
        page: current,
        limit: pageSize,
        ...queryParams,
        ...extraParams,
      };

      const res: any = await request?.(params, sort, queryParams);
      setLoading(false);
      // 兼容老写法
      const total = res.total ?? Number(res.totalSize);
      const tableRes: any = {
        // ...res,
        success: true,
        total,
        current: res.page,
        data: res.list || res.data || [],
      };
      if (res.rows) {
        tableRes.totalPages =
          Math.ceil(Number(res.page) / Number(res.rows)) || 0;
      }
      return tableRes;
    },
    [actionRef, extraParams, request, resetPageInParams, restProps.hideLoading],
  );

  const headerTitleNode = useMemo(() => {
    return headerTitle ? headerTitle : null;
  }, [headerTitle]);

  // 列设置
  const ColumnSettingNode = useMemo(() => {
    return (
      <div className="rh-table-column-setting">
        <ColumnSetting
          columns={columnCache as ProColumns<any>[]}
          onChange={(newColumns: ProColumns<any>[]) => {
            // console.log('newColumns', newColumns);
            setColumnCache(newColumns);
            setRenderColumns(newColumns);
          }}
          onClear={() => {
            clearColumnCache();
          }}
        />
      </div>
    );
  }, [columnCache, setColumnCache, clearColumnCache]);

  const {
    cleanMethod,
    leftExtraBtn = [],
    rightExtraBtn = [],
  } = tableAlertRenderProps;

  if (restProps.editable) {
    restProps.onRow = ((record: any) => {
      return {
        record,
      };
    }) as any;
    restProps.components = {
      body: {
        row: EditableRow,
        cell: EditableCell,
      },
    };
  }

  return (
    <div className="rh-table">
      {!titleInline && headerTitleNode}
      {/* TODO: 支持自定义宽度，而不是colSize控制太宽 */}
      <div className="rh-table-query">
        {titleInline && headerTitleNode}
        {queryFilterColumns.length > 0 && (
          <BetaSchemaForm
            className="rh-table-query-filter-form"
            layoutType="QueryFilter"
            span={searchSpan || 5}
            submitter={false}
            formRef={queryFilterFormRef}
            columns={queryFilterColumns}
            onFieldsChange={(changedFields: any[]) => {
              // 获取当前所选择的项
              const selectedKey = changedFields?.[0]?.name?.[0];
              let selectedColumns: any = {};
              // 获取当前所选择的columns数据
              for (let i = 0; i < queryFilterColumns.length; i += 1) {
                const columnsItem = queryFilterColumns[i];
                if (columnsItem.key === selectedKey) {
                  selectedColumns = columnsItem;
                }
              }
              // 判断是否需要联动子节点
              if (
                selectedColumns.linkChildrenKey &&
                selectedColumns.linkChildrenKey.length > 0
              ) {
                const resetValueObject: any = {};
                selectedColumns.linkChildrenKey?.forEach((item: any) => {
                  resetValueObject[item] = undefined;
                });
                queryFilterFormRef?.current?.setFieldsValue(resetValueObject);
                lightFilterFormRef?.current?.setFieldsValue(resetValueObject);
              }
            }}
            onValuesChange={run}
          />
        )}

        {lightFilterColumns.length > 0 && (
          <LightFilter
            className="rh-table-light-filter-form"
            formRef={lightFilterFormRef}
            onFinish={run as any}
          >
            {lightFilterColumns.map((column: any) => {
              return renderProFormItem(column);
            })}
            <div style={{ padding: '1px 0 0 3px' }}>
              <a
                onClick={() => {
                  lightFilterFormRef.current?.resetFields();
                  tableReload();
                }}
              >
                重置
              </a>
            </div>
          </LightFilter>
        )}
      </div>
      <div className="custom-toolbar">
        {customToolBarRender && (
          <div
            className={`rh-table-toolbar ${restProps.toolBarClassName ?? ''}`}
          >
            {customToolBarRender().map((item: any) => item)}
          </div>
        )}
        {props.id && ColumnSettingNode}
      </div>
      <ProTable
        rowKey={restProps.rowKey || 'id'}
        options={false}
        loading={
          !restProps.hideLoading && request
            ? loading
            : restProps.loading !== undefined
            ? restProps.loading
            : false
        }
        form={{
          ignoreRules: false,
        }}
        dateFormatter="string"
        tableAlertRender={({ selectedRowKeys, onCleanSelected }) => {
          if (tableAlertRenderProps?.tableMulSelectProps?.display) {
            return (
              <TableMulSelect {...tableAlertRenderProps.tableMulSelectProps} />
            );
          }
          const clean = cleanMethod || onCleanSelected;
          return (
            <div>
              <>
                <div style={{ display: 'inline-flex', gap: 8 }}>
                  <div>已选择</div>
                  <div>{selectedRowKeys.length}</div>
                  <div>项</div>
                </div>
                {leftExtraBtn}
                <a onClick={clean}>清空</a>
              </>
            </div>
          );
        }}
        tableAlertOptionRender={({ selectedRowKeys, onCleanSelected }) => {
          return rightExtraBtn.map((item: any) => {
            if (item && item.key === 'delete') {
              return (
                <Popconfirm
                  key="delete"
                  placement="bottom"
                  title="确定要删除吗？"
                  onConfirm={async () => {
                    await item.func?.(selectedRowKeys);
                    onCleanSelected();
                  }}
                >
                  <a key="delete" className="color-danger">
                    批量删除
                  </a>
                </Popconfirm>
              );
            }
            return item;
          });
        }}
        {...restProps}
        locale={locale as any}
        headerTitle={null}
        actionRef={actionRef}
        columns={renderColumns}
        search={false}
        scroll={scroll}
        toolBarRender={toolBarRender}
        components={virtual ? vt : restProps.components}
        request={request && (onRequest as any)}
        pagination={
          pagination !== false
            ? {
                pageSize: 10,
                showTotal: (total) => `总共 ${total} 条`,
                size: 'default',
                pageSizeOptions: [
                  '10',
                  '20',
                  '50',
                  '100',
                  '200',
                  '500',
                  '1000',
                ],
                showQuickJumper: true,
                showSizeChanger: true,
                ...pagination,
              }
            : false
        }
        rowClassName={() => 'editable-row'}
      />
    </div>
  );
};

export default RhTable;
