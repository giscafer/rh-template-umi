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
import { Button, Dropdown, Menu } from 'antd';
import { TablePaginationConfig } from 'antd/es/table/interface';
import { cloneDeep, isNumber } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import { useVT } from 'virtualizedtableforantd4';
import RhEmpty from '../RhEmpty';
import RhTitle from '../RhTitle';
import { ACTION_TABLE_FETCH } from './action';
import { genTableAlertOptionRender, genTableAlertRender } from './alert';
import useDataSource from './hooks/useDataSource';
import useRowSelection from './hooks/useRowSelection';
import { DefaultObservable } from './hooks/useTable';
import useTableColumn from './hooks/useTableColumn';
import './index.less';
import SearchForm from './search';
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
  actionObservable$ = DefaultObservable,
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
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    resetPageIndex = true,
    resetPageInParams = false,
    tableAlertRenderProps = {},
    pagination = {},
    locale = { emptyText: RhEmpty },
    request,
    ...restProps
  } = mergeProps;

  const queryRef = useRef<any>();
  const defaultActionRef = useRef<RhActionType>();

  const actionRef = (mergeProps.actionRef ||
    defaultActionRef) as React.MutableRefObject<RhActionType>;
  const [ts, setTs] = useState<number>(0); // 借助刷新请求

  const [vt] = useVT(() => {
    return {
      scroll: { y: isNumber(scroll?.y) ? scroll!.y : 600 },
    };
  });

  const rowSelectionOption = restProps.rowSelection || {};
  const { rowSelection } = useRowSelection(
    rowSelectionOption,
    actionObservable$,
  );

  useEffect(() => {
    actionObservable$.take(ACTION_TABLE_FETCH, () => {
      setTs(Date.now());
    });
  }, []);

  const handleReload = useCallback(() => {
    actionRef.current.pageInfo.current = 1;
    setTs(Date.now());
    // return actionRef.current?.reload(resetPageIndex);
  }, [actionRef]);

  const dsParams = {
    api: restProps.api,
    apiParams: restProps.apiParams,
    apiMethod: restProps.apiMethod,
    params: restProps.params,
    resetPageInParams,
    actionRef,
    queryRef,
    request,
  };
  const { onChange, loading, data } = useDataSource(dsParams, [ts]);

  const headerTitleNode = useMemo(() => {
    if (!headerTitle) {
      return null;
    }
    if (typeof headerTitle !== 'string') {
      return headerTitle;
    }
    return <RhTitle title={headerTitle} />;
  }, [headerTitle]);

  const searchFormNode = useMemo(() => {
    return (
      <SearchForm
        ref={queryRef}
        columns={columns as RhColumns[]}
        onChange={handleReload}
      />
    );
  }, [columns, handleReload]);

  const headerNode = useMemo(() => {
    return <div className="rh-table-header">{searchFormNode}</div>;
  }, [searchFormNode]);

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

          // 下拉按钮
          return (
            <Dropdown
              overlay={
                <Menu
                  onClick={async ({ key }) => {
                    actionObservable$.next({ type: key });
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
          <Button
            key={action}
            type={type}
            size={size}
            {...rest}
            onClick={() => {
              actionObservable$.next({ type: action });
            }}
          >
            {name}
          </Button>
        );
      });
      metaToolBar.actions = actionsNode as any;
      if (searchPlacement === 'toolbar') {
        metaToolBar.filter = searchFormNode;
      }
      return metaToolBar;
    }
  }, [meta?.toolbar, toolbar, searchPlacement]);

  const memoPagination: false | TablePaginationConfig = useMemo(() => {
    if (pagination !== false) {
      return {
        pageSize: 10,
        showTotal: (total: number) => `总共 ${total} 条`,
        size: 'default',
        showQuickJumper: true,
        showSizeChanger: true,
        pageSizeOptions: ['10', '20', '50', '100'],
        ...(pagination ?? {}),
        total: data?.total,
      };
    }
    return pagination;
  }, [pagination, data?.total]);

  const { tableColumns } = useTableColumn(columns, meta, actionObservable$);

  return (
    <div className="rh-table">
      {searchPlacement === 'header' && headerNode}
      <ProTable<any, any, any>
        rowKey={restProps.rowKey || 'id'}
        actionRef={actionRef}
        columns={tableColumns}
        loading={loading}
        search={false}
        scroll={scroll}
        headerTitle={headerTitleNode}
        locale={locale as any}
        toolbar={toolbarNode as ListToolBarProps}
        form={{
          ignoreRules: false,
        }}
        dateFormatter="string"
        rowSelection={
          meta?.rowSelectionType &&
          ({
            type: meta.rowSelectionType === 'single' ? 'radio' : 'checkbox',
            ...rowSelection,
          } as any)
        }
        tableAlertRender={genTableAlertRender(tableAlertRenderProps)}
        tableAlertOptionRender={genTableAlertOptionRender(
          tableAlertRenderProps,
        )}
        {...restProps}
        dataSource={restProps.dataSource ?? (data?.data || [])}
        onChange={onChange}
        components={virtual ? vt : restProps.components}
        pagination={memoPagination}
      />
    </div>
  );
};

export default RhTable;
