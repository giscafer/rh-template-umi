import { EllipsisOutlined } from '@ant-design/icons';
import { ProColumns } from '@ant-design/pro-components';
import { Button, Dropdown, Menu } from 'antd';
import cls from 'classnames';
import { ItemType } from 'rc-menu/lib/interface';
import { useMemo } from 'react';
import { RhActionMeta, RhColumns, RhTableMeta } from '../types';
import { convertDataIndex } from '../utils';
import getValOrFnResult from '../utils/getValOrFnResult';
import { RhObservable } from './useTable';

function useTableColumn(
  columns: RhColumns[],
  meta: RhTableMeta | undefined,
  actionObservable$: RhObservable<any>,
) {
  const tableColumns: ProColumns[] = useMemo(() => {
    const cList = columns.map((c: any) => ({
      ...c,
      dataIndex: convertDataIndex(c.dataIndex),
    }));
    if (!meta?.tableActions?.length) {
      return cList;
    }
    const actions = meta?.tableActions;
    const optionColumn = {
      title: '操作',
      dataIndex: 'option',
      valueType: 'option',
      fixed: 'right',
      render: (_: any, record: Record<string, any>) => {
        const visibleActionBtn: RhActionMeta[] = actions.filter(
          (item: RhActionMeta) => {
            if (item) {
              return getValOrFnResult(item.visibleOn ?? true, record);
            } else {
              return false;
            }
          },
        );
        const actionInCell = visibleActionBtn.filter((a) => !a.isMore);
        const actionInMore = visibleActionBtn.filter((a) => a.isMore);

        const items: ItemType[] = actionInMore.map(
          (item: RhActionMeta, idx: number) => {
            const menu: ItemType = {
              key: `${item.action || idx}`,
              label: item.name,
              className: item.className,
              disabled: !!getValOrFnResult(item.disabledOn, record),
              onClick: () => {
                actionObservable$.next({
                  action: item.action,
                  payload: record,
                });
              },
            };
            // 删除操作红色样式
            menu.className = cls(menu.className, {
              red: item.danger || ['delete'].includes(item.action),
            });
            return menu;
          },
        );

        const more =
          actionInMore.length > 0 ? <Menu items={items as any} /> : null;

        return (
          <>
            {actionInCell.map((item) => (
              <Button
                key={item.name}
                className={cls(item.className, {
                  red: item.danger,
                })}
                type="text"
                disabled={!!getValOrFnResult(item.disabledOn, record)}
                onClick={() => {
                  actionObservable$.next({
                    action: item.action,
                    payload: record,
                  });
                }}
                danger={item.danger}
              >
                {item.name}
              </Button>
            ))}
            {more && (
              <Dropdown overlay={more} trigger={['click']} className="ml1">
                <EllipsisOutlined rotate={90} style={{ cursor: 'pointer' }} />
              </Dropdown>
            )}
          </>
        );
      },
    };
    console.log('cList====================================');
    console.log(cList);
    console.log('====================================');
    return cList.concat(optionColumn as RhColumns);
  }, [columns]);

  return { tableColumns };
}

export default useTableColumn;
