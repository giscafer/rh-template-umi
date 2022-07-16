/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-10 21:43:59
 * @description 多选hooks
 */

import { TableRowSelection } from '@ant-design/pro-table/lib/typing';
import { Table, TableProps } from 'antd';
import { RowSelectMethod } from 'antd/lib/table/interface';
import { Key, useCallback, useMemo, useState } from 'react';
import { ACTION_TABLE_SELECTION } from '../action';
import { RhObservable } from './useTable';

function useRowSelection(
  options: TableRowSelection & { selectedRows?: any[] } = {},
  actionObservable$: RhObservable<any>,
) {
  const [selectedRows, setSelectedRows] = useState(options.selectedRows || []);
  const [selectedRowKey, setSelectedRowKeys] = useState(
    options.selectedRowKeys || [],
  );
  const rowSelection: TableProps<any>['rowSelection'] = useMemo(() => {
    return {
      columnWidth: '44px',
      ...options,
      selectedRows,
      selections: [
        Table.SELECTION_ALL,
        Table.SELECTION_INVERT,
        Table.SELECTION_NONE,
      ],
      selectedRowKey,
      onChange: (
        selectedRowKeys: Key[],
        selectedRows: any[],
        info: {
          type: RowSelectMethod;
        },
      ) => {
        setSelectedRowKeys(selectedRowKeys);
        setSelectedRows(selectedRows);
        if (options.onChange) {
          options.onChange(selectedRowKeys, selectedRows, info);
        }

        actionObservable$.next({
          type: ACTION_TABLE_SELECTION,
          payload: { selectedRowKeys, selectedRows, info },
        });
      },
    };
  }, [selectedRows, selectedRowKey, options]);

  // 操作完取消选中
  const resetSelection = useCallback(() => {
    setSelectedRows([]);
    setSelectedRowKeys([]);
  }, []);

  return { rowSelection, selectedRows, selectedRowKey, resetSelection };
}

export default useRowSelection;
