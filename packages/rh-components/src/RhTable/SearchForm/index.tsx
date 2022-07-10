/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-10 13:57:47
 * @description 表格查询框渲染，支持query和light两种方式
 */

import { SearchOutlined } from '@ant-design/icons';
import {
  BetaSchemaForm,
  LightFilter,
  ProFormColumnsType,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormInstance,
  ProFormSelect,
  ProFormText,
} from '@ant-design/pro-components';
import { useDebounceFn } from 'ahooks';
import { isNil, noop } from 'lodash';
import {
  forwardRef,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
} from 'react';
import { RhColumns } from '../types';

type SpanConfig =
  | number
  | {
      xs: number;
      sm: number;
      md: number;
      lg: number;
      xl: number;
      xxl: number;
    };

export type QueryFilterType = {
  columns: RhColumns[];
  span?: SpanConfig;
  onChange?: () => void;
};

const debounceTime = 400;

const compTypeList = [
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
];

function SearchForm(props: QueryFilterType, ref: any) {
  const { columns = [], onChange = noop } = props;
  const onConfirmRef = useRef<() => void>();
  const queryFilterFormRef = useRef<ProFormInstance>();
  const lightFilterFormRef = useRef<ProFormInstance>();

  useImperativeHandle(ref, () => {
    return {
      getQueryParams: () => {
        const queryFormData =
          queryFilterFormRef.current?.getFieldsValue() || {};
        const lightFormData =
          lightFilterFormRef.current?.getFieldsValue() || {};
        const queryParams = { ...queryFormData, ...lightFormData };
        // console.log('queryParams=', queryParams);

        return queryParams;
      },
      clearQueryParams: () => {
        queryFilterFormRef.current?.resetFields();
        lightFilterFormRef.current?.resetFields();
      },
    };
  });

  const { run } = useDebounceFn(onChange, { wait: debounceTime });

  const { run: lightRun } = useDebounceFn(onChange, { wait: 10 });

  // 查询列定义
  const filterColumns: RhColumns[] = useMemo(() => {
    // const defaultFilterType = 'query';

    return columns
      .map((column: any) => {
        const {
          valueType = 'text',
          valueEnum,
          title,
          searchType,
          renderType,
          fieldProps = {},
          formItemProps = {},
        } = column;

        if (isNil(searchType) || renderType === 'option') {
          return false;
        }

        return {
          ...column,
          searchType,
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
              (compTypeList.includes(renderType ?? valueType)
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
  }, [columns, run]);

  // query查询列定义
  // 给 20000 order 默认值是为了提供只需要部分排序的功能
  const sorter = useCallback((a: any, b: any) => {
    const aOrder = a.order === undefined ? 20000 : a.order;
    const bOrder = b.order === undefined ? 20000 : b.order;
    return aOrder - bOrder;
  }, []);

  const queryFilterColumns = useMemo(() => {
    return filterColumns
      .filter((column) => column.searchType === 'query')
      .sort(sorter) as ProFormColumnsType[];
  }, [filterColumns, sorter]);

  // light查询列定义
  const lightFilterColumns = useMemo(() => {
    return filterColumns
      .filter((column) => column.searchType === 'light')
      .sort(sorter) as ProFormColumnsType[];
  }, [filterColumns, sorter]);

  const renderProFormItem = useCallback((column: Record<string, any>) => {
    const {
      valueType,
      dataIndex,
      title,
      valueEnum,
      renderFormItem,
      fieldProps = { size: 'large' },
      ...resetProps
    } = column;

    const renderType = resetProps?.renderType ?? valueType;

    if (renderFormItem) {
      return renderFormItem();
    }

    if (renderType === 'digit') {
      return (
        <ProFormDigit
          key={dataIndex}
          name={dataIndex}
          label={title}
          fieldProps={fieldProps}
          {...resetProps}
        />
      );
    }

    if (renderType === 'date' || renderType === 'dateTime') {
      return (
        <ProFormDatePicker
          key={dataIndex}
          name={dataIndex}
          label={title}
          fieldProps={fieldProps}
          {...resetProps}
        />
      );
    }

    if (renderType === 'dateRange') {
      return (
        <ProFormDateRangePicker
          key={dataIndex}
          name={dataIndex}
          label={title}
          fieldProps={fieldProps}
          {...resetProps}
        />
      );
    }

    if (renderType === 'select' || valueEnum) {
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
    if (renderType === 'text' || !valueType) {
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
          {...resetProps}
        />
      );
    }

    return null;
  }, []);

  return (
    <div className="rh-table-query">
      {/* {titleInline && headerTitleNode} */}
      {queryFilterColumns.length > 0 && (
        <BetaSchemaForm
          className="rh-table-query-filter-form"
          layoutType="QueryFilter"
          // span={span || 5}
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
        <div className="rh-table-query-light-form-container">
          <LightFilter
            className="rh-table-query-light-form"
            formRef={lightFilterFormRef}
            onFinish={lightRun as any}
          >
            {lightFilterColumns.map((column: any) => {
              return renderProFormItem(column);
            })}
          </LightFilter>
          <div className="reset">
            <a
              onClick={() => {
                lightFilterFormRef.current?.resetFields();
                onChange();
              }}
            >
              重置
            </a>
          </div>
        </div>
      )}
    </div>
  );
}

export default forwardRef(SearchForm);
