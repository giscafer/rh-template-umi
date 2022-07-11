import { Popconfirm } from 'antd';
import { TableAlertRenderProps } from '../types';
import TableMulSelect from './MultiSelect';

export const genTableAlertRender = (props: TableAlertRenderProps) => {
  const { cleanMethod, leftExtraBtn = [] } = props;
  return ({ selectedRowKeys, onCleanSelected }: any) => {
    if (props?.tableMulSelectProps?.display) {
      return <TableMulSelect {...props.tableMulSelectProps} />;
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
  };
};

export const genTableAlertOptionRender = (props: TableAlertRenderProps) => {
  const { rightExtraBtn = [] } = props;
  const fn = ({ selectedRowKeys, onCleanSelected }: any) => {
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
  };
  return fn;
};
