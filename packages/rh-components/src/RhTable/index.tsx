/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-08 14:25:07
 * @description 封装配置化高效开发，目的是为了精简写法和改造UI规范；
 * 唯一不变原则： ProTable 原 Api 一致性不变
 */

import type { ParamsType } from '@ant-design/pro-provider';
import ProTable from '@ant-design/pro-table';
import { Popconfirm } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { isFunction, isNumber } from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useVT } from 'virtualizedtableforantd4';
import RhEmpty from '../RhEmpty';
import TableMulSelect from '../RhTableMulSelected';
import RhTitle from '../RhTitle';
import './index.less';
import QueryLightFilter from './QueryLightFilter';
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
    virtual = false,
    resetPageIndex = true,
    resetPageInParams = false,
    extraParams = {},
    headerTitle,
    request,
    scroll,
    tableAlertRenderProps = {},
    pagination = {},
    searchSpan,
    locale = { emptyText: RhEmpty },
    ...restProps
  } = props;

  const queryRef = useRef<any>();
  const defaultActionRef = useRef<RhActionType>();
  const [loading, setLoading] = useState(false);
  const [vt] = useVT(() => {
    return {
      scroll: { y: isNumber(scroll?.y) ? scroll!.y : 600 },
    };
  });

  const actionRef = (props.actionRef ||
    defaultActionRef) as React.MutableRefObject<RhActionType>;

  const handleReload = useCallback(() => {
    actionRef.current.pageInfo.current = 1;
    return actionRef.current?.reload(resetPageIndex);
  }, [actionRef, resetPageIndex]);

  const handleRequest = useCallback(
    async (
      pageInfo: { current: any; pageSize: any },
      sort: Record<string, SortOrder>,
    ) => {
      setLoading(true);
      if (resetPageInParams) {
        queryRef.current?.clearQueryParams();
      }

      const queryParams = queryRef.current?.getQueryParams();
      console.log('queryParams====================================');
      console.log(queryParams);
      console.log('====================================');
      if (actionRef?.current) {
        actionRef.current.pageInfo.params = queryParams;
      }

      const { current, pageSize } = pageInfo;

      // current 是兼容老写法
      const params = {
        page: current,
        current,
        pageSize,
        ...queryParams,
        ...extraParams,
      };
      if (isFunction(request)) {
      }

      const res: any = await request?.(params, sort, queryParams);

      setLoading(false);
      // 兼容老写法
      const total = res.total ?? Number(res.totalSize);
      return {
        ...res,
        success: true,
        total,
        totalPages: Number(res.totalPages) || 0,
      };
    },
    [actionRef, extraParams, request, resetPageInParams],
  );

  const headerTitleNode = useMemo(() => {
    if (!headerTitle) {
      return null;
    }
    if (typeof headerTitle !== 'string') {
      return headerTitle;
    }
    return <RhTitle title={headerTitle} />;
  }, [headerTitle]);

  const headerNode = useMemo(() => {
    if (!headerTitleNode) {
      return (
        <QueryLightFilter
          ref={queryRef}
          columns={columns as RhColumns[]}
          span={searchSpan}
          onChange={handleReload}
        />
      );
    }

    return (
      <div className="rh-table-header">
        {headerTitleNode}
        <QueryLightFilter
          ref={queryRef}
          columns={columns as RhColumns[]}
          span={searchSpan}
          onChange={handleReload}
        />
      </div>
    );
  }, [headerTitleNode]);

  const {
    cleanMethod,
    leftExtraBtn = [],
    rightExtraBtn = [],
  } = tableAlertRenderProps;

  return (
    <div className="rh-table">
      {headerNode}
      <ProTable
        rowKey={restProps.rowKey || 'id'}
        options={false}
        loading={isFunction(request) ? loading : restProps.loading}
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
            <>
              <div style={{ display: 'inline-flex', gap: 8 }}>
                <div>已选择</div>
                <div>{selectedRowKeys.length}</div>
                <div>项</div>
              </div>
              {leftExtraBtn}
              <a onClick={clean}>清空</a>
            </>
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
                  <a key="delete" className="table-line-button-delete">
                    批量删除
                  </a>
                </Popconfirm>
              );
            }
            return item;
          });
        }}
        locale={locale as any}
        actionRef={actionRef}
        columns={columns}
        search={false}
        scroll={scroll}
        // toolBarRender={false}
        {...restProps}
        components={virtual ? vt : restProps.components}
        request={handleRequest as any}
        pagination={
          pagination !== false
            ? {
                pageSize: 10,
                showTotal: (total) => `总共 ${total} 条`,
                size: 'default',
                pageSizeOptions: ['10', '20', '50', '100', '200'],
                showQuickJumper: true,
                showSizeChanger: true,
                ...pagination,
              }
            : false
        }
      />
    </div>
  );
};

export default RhTable;
