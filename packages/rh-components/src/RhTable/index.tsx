/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-08 14:25:07
 * @description 封装配置化高效开发，目的是为了精简写法和改造UI规范；
 * 唯一不变原则： ProTable 原 Api 一致性不变
 */

import { DownOutlined } from '@ant-design/icons';
import { ListToolBarProps } from '@ant-design/pro-components';
import type { ParamsType } from '@ant-design/pro-provider';
import ProTable from '@ant-design/pro-table';
import { Button, Dropdown, Menu, Popconfirm } from 'antd';
import { SortOrder } from 'antd/lib/table/interface';
import { cloneDeep, isFunction, isNumber } from 'lodash';
import React, { useCallback, useMemo, useRef, useState } from 'react';
import { useVT } from 'virtualizedtableforantd4';
import RhEmpty from '../RhEmpty';
import TableMulSelect from '../RhTableMulSelected';
import RhTitle from '../RhTitle';
import './index.less';
import QueryLightFilter from './QueryLightFilter';
import {
  RhActionMeta,
  RhActionType,
  RhColumns,
  RhTableProps,
  RhToolbarMeta,
} from './types';

const RhTable = <
  DataType extends Record<string, any>,
  Params extends ParamsType = ParamsType,
  ValueType = 'text',
>({
  meta,
  ...props
}: RhTableProps<DataType, Params, ValueType>) => {
  const mergeProps = Object.assign({}, props, meta || {});

  const {
    headerTitle,
    scroll,
    toolbar,
    columns = [],
    searchPlacement = 'header',
    virtual = false,
    resetPageIndex = true,
    resetPageInParams = false,
    extraParams = {},
    tableAlertRenderProps = {},
    pagination = {},
    locale = { emptyText: RhEmpty },
    request,
    ...restProps
  } = mergeProps;

  const queryRef = useRef<any>();
  const defaultActionRef = useRef<RhActionType>();
  const [loading, setLoading] = useState(false);
  const [vt] = useVT(() => {
    return {
      scroll: { y: isNumber(scroll?.y) ? scroll!.y : 600 },
    };
  });

  const actionRef = (mergeProps.actionRef ||
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

  const queryFilterNode = useMemo(() => {
    return (
      <QueryLightFilter
        ref={queryRef}
        columns={columns as RhColumns[]}
        onChange={handleReload}
      />
    );
  }, [columns, handleReload]);

  const headerNode = useMemo(() => {
    return <div className="rh-table-header">{queryFilterNode}</div>;
  }, [queryFilterNode]);

  const toolbarNode = useMemo(() => {
    if (!meta?.toolbar) {
      return toolbar;
    }
    const metaToolBar: RhToolbarMeta = cloneDeep(meta?.toolbar);
    if (meta.toolbar.actions?.length) {
      const actions = metaToolBar?.actions;
      const actionsNode = actions?.map((item: RhActionMeta) => {
        const {
          action,
          name,
          children,
          size = 'large',
          type = 'primary',
          ...rest
        } = item;
        if (children?.length) {
          const menuItems = children.map((c) => ({
            label: c.name,
            key: c.action ?? c.name,
          }));
          console.log(menuItems);

          // 下拉按钮
          return (
            <Dropdown
              overlay={
                <Menu
                  onClick={async ({ key }) => {
                    console.log('key', key);
                  }}
                  items={menuItems}
                />
              }
            >
              <Button type={type} size={size} {...rest}>
                {name} <DownOutlined />
              </Button>
            </Dropdown>
          );
        }
        return (
          <Button key={action} type={type} size={size} {...rest}>
            {name}
          </Button>
        );
      });
      metaToolBar.actions = actionsNode as any;
      if (searchPlacement === 'toolbar') {
        metaToolBar.filter = queryFilterNode;
      }
      return metaToolBar;
    }
  }, [meta?.toolbar, toolbar, searchPlacement]);

  const {
    cleanMethod,
    leftExtraBtn = [],
    rightExtraBtn = [],
  } = tableAlertRenderProps;

  return (
    <div className="rh-table">
      {searchPlacement === 'header' && headerNode}
      <ProTable
        rowKey={restProps.rowKey || 'id'}
        locale={locale as any}
        actionRef={actionRef}
        columns={columns}
        search={false}
        scroll={scroll}
        headerTitle={headerTitleNode}
        toolbar={toolbarNode as ListToolBarProps}
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
