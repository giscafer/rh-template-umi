import { EllipsisOutlined } from '@ant-design/icons';
import { Button, Dropdown, Menu, Space } from 'antd';
import cls from 'classnames';
import { noop } from 'lodash';
import { ItemType } from 'rc-menu/lib/interface';
import { RhActionMeta } from '../types';
import { getValOrFnResult } from '../utils';

const widthMap: Record<string, number> = {
  '1': 80,
  '2': 100,
  '3': 160,
};

/**
 * 生成 action
 * @param{RhActionMeta[]} actions
 * @param{(...args: any[]) =>void} handleClick
 * @returns
 */
export default function genOptionColumn(
  actions: RhActionMeta[],
  handleClick = noop,
) {
  let visibleLength = '1';
  const optionColumn: Record<string, any> = {
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
      visibleLength = actionInCell.length + 1 + '';

      const items: ItemType[] = actionInMore.map(
        (item: RhActionMeta, idx: number) => {
          const menu: ItemType = {
            key: `${item.action || idx}`,
            label: item.name,
            className: item.className,
            disabled: !!getValOrFnResult(item.disabledOn, record),
            onClick: () => {
              handleClick(item, record);
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
        <Space>
          {actionInCell.map((item) => (
            <Button
              key={item.name}
              className={cls(item.className, {
                red: item.danger,
                tableAction: true,
              })}
              type="text"
              size="small"
              disabled={!!getValOrFnResult(item.disabledOn, record)}
              onClick={() => {
                handleClick(item, record);
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
        </Space>
      );
    },
  };
  optionColumn.width = widthMap[visibleLength] || 180;
  return optionColumn;
}
