import {
  CheckOutlined,
  MenuOutlined,
  SettingOutlined,
  SwapOutlined,
} from '@ant-design/icons';
import { ProColumns, useRefFunction } from '@ant-design/pro-components';
import { genColumnKey } from '@ant-design/pro-table/lib/utils';
import {
  Button,
  Checkbox,
  Popover,
  Space,
  Switch,
  Table,
  TableColumnType,
  Tooltip,
} from 'antd';
import { arrayMoveImmutable } from 'array-move';
import { noop, unionBy } from 'lodash';
import React, {
  useCallback,
  useEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import {
  SortableContainer,
  SortableContainerProps,
  SortableElement,
  SortableHandle,
} from 'react-sortable-hoc';
import './index.less';

type ColumnSettingProps<T = any> = {
  columns: ProColumns<T>[];
  draggable?: boolean;
  checkable?: boolean;
  extra?: React.ReactNode;
  checkedReset?: boolean;
  children?: React.ReactNode;
  onChange?: (v: ProColumns[]) => void;
  onClear?: () => void;
};

const DragHandle = SortableHandle(() => (
  <MenuOutlined
    style={{
      cursor: 'grab',
      color: '#999',
    }}
  />
));

const SortableItem = SortableElement((props: Record<string, any>) => (
  <tr {...props} />
));
const SortableBody = SortableContainer((props: Record<string, any>) => (
  <tbody {...props} />
));

/**
 * 列设置
 * @param props
 * @returns
 */
const ColumnSetting: React.FC<ColumnSettingProps> = (props: any) => {
  const columnRef = useRef({});
  const [dataSource, setDataSource] = useState<ProColumns[]>([]);
  const [visible, setVisible] = useState(false);
  const { onChange = noop, onClear = noop, className = '' } = props;

  const columnChangeHandle = useCallback(
    (settingColumns: any[]) => {
      const c = settingColumns.map(
        (item: {
          [x: string]: any;
          index: any;
          fixedLeft: any;
          fixedRight: any;
          hideInTable: any;
        }) => {
          const { fixedLeft, fixedRight, hideInTable, ...rest } = item;
          return {
            ...rest,
            fixed: fixedLeft ? 'left' : fixedRight ? 'right' : undefined,
            hideInTable,
          };
        },
      );
      const unionColumns = unionBy(c, props.columns, 'dataIndex');
      // TODO: 持久化
      onChange(unionColumns);
    },
    [onChange, props.columns],
  );

  const changeSettingHandle = useCallback(
    (dataIndex: any, property: string, val: any) => {
      dataSource.forEach((item: any) => {
        if (item.dataIndex === dataIndex) {
          if (property === 'fixedLeft') {
            item.fixedRight = val && false;
            item[property] = val;
          }
          if (property === 'fixedRight') {
            item.fixedLeft = val && false;
            item[property] = val;
          }
          if (property === 'hideInTable') {
            item.hideInTable = val;
          }
        }
      });

      const newDataSource = [...dataSource];
      setDataSource([...dataSource]);
      columnChangeHandle(newDataSource);
    },
    [columnChangeHandle, dataSource],
  );

  const settingTableColumns = useMemo(() => {
    return [
      {
        title: <SwapOutlined style={{ transform: 'rotate(90deg)' }} />,
        dataIndex: 'sort',
        width: 30,
        className: 'drag-visible',
        render: () => <DragHandle />,
      },
      {
        title: '表头名称',
        dataIndex: 'title',
        width: 100,
        ellipsis: true,
        className: 'drag-visible',
      },
      {
        title: '左锁定',
        dataIndex: 'fixedLeft',
        width: 60,
        render: (
          text: any,
          record: { fixedLeft: boolean | undefined; dataIndex: any },
        ) => (
          <Switch
            checkedChildren={<CheckOutlined />}
            checked={record.fixedLeft}
            onChange={(v) => {
              changeSettingHandle(record.dataIndex, 'fixedLeft', v);
            }}
          />
        ),
      },
      {
        title: '右锁定',
        dataIndex: 'fixedRight',
        width: 60,
        render: (
          text: any,
          record: { fixedRight: boolean | undefined; dataIndex: any },
        ) => (
          <Switch
            checkedChildren={<CheckOutlined />}
            checked={record.fixedRight}
            onChange={(v) => {
              changeSettingHandle(record.dataIndex, 'fixedRight', v);
            }}
          />
        ),
      },
      {
        title: '是否显示',
        dataIndex: 'hideInTable',
        width: 68,
        render: (text: any, record: { hideInTable: any; dataIndex: any }) => {
          return (
            <Checkbox
              checked={!record.hideInTable}
              onChange={(e) => {
                changeSettingHandle(
                  record.dataIndex,
                  'hideInTable',
                  !e.target.checked,
                );
              }}
            >
              显示
            </Checkbox>
          );
        },
      },
    ];
  }, [changeSettingHandle]);

  useEffect(() => {
    if (props.columns) {
      columnRef.current = props.columns;
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const localColumns: TableColumnType<any> &
      {
        index?: number;
        fixed?: any;
        key?: any;
        hideInTable?: boolean;
      }[] = props.columns.filter((item: any) => item.valueType !== 'option');

    const data = localColumns.map((item, index) => {
      return {
        ...item,
        index,
        key: genColumnKey(item.key, index),
        fixedLeft: item.fixed === 'left' ? true : false,
        fixedRight: item.fixed === 'right' ? true : false,
        hideInTable: !!item.hideInTable,
      };
    });
    setDataSource(data);
  }, [props.columns]);

  // ---------- 拖拽相关 start  ----------------- //
  const onSortEnd = ({ oldIndex, newIndex }: Record<string, any>) => {
    if (oldIndex !== newIndex) {
      const newData = arrayMoveImmutable(
        dataSource.slice(),
        oldIndex,
        newIndex,
      ).filter((el) => !!el);
      setDataSource(newData);
      columnChangeHandle(newData);
    }
  };

  const DraggableContainer = (
    props: JSX.IntrinsicAttributes &
      JSX.IntrinsicClassAttributes<
        React.Component<SortableContainerProps, any, any>
      > &
      Readonly<SortableContainerProps>,
  ) => (
    <SortableBody
      useDragHandle
      disableAutoscroll
      helperClass="rh-table-column-setting-row-dragging"
      onSortEnd={onSortEnd}
      {...props}
    />
  );

  const DraggableBodyRow = (props: Record<string, any>) => {
    // 函数 findIndex 基于 Table rowKey props 并且应该始终是正确的数组索引
    const index = dataSource.findIndex(
      (x) => x.index === props['data-row-key'],
    );
    return <SortableItem index={index} {...props} />;
  };
  // ---------- 拖拽相关 end  ----------------- //

  const hidePopover = () => {
    setVisible(false);
  };

  const handleVisibleChange = (newVisible: boolean) => {
    setVisible(newVisible);
  };

  /** 重置项目 */
  const clearClick = useRefFunction(() => {
    // columnChangeHandle(columnRef.current);
    setVisible(false);
    onClear();
  });

  return (
    <Popover
      arrowPointAtCenter
      title={
        <div className={`${className}-title`}>
          <h3>编辑</h3>
          {props?.extra ? (
            <Space size={12} align="center">
              {props.extra}
            </Space>
          ) : null}
        </div>
      }
      overlayClassName="rh-table-column-setting-overlay"
      placement="bottomRight"
      trigger="click"
      visible={visible}
      onVisibleChange={handleVisibleChange}
      content={
        <div className="rh-table-column-setting-content">
          <Table
            className="rh-table-column-setting-table"
            pagination={false}
            dataSource={dataSource as any}
            columns={settingTableColumns as any}
            rowKey="index"
            size="middle"
            scroll={{ y: 400, x: 380 }}
            components={{
              body: {
                wrapper: DraggableContainer,
                row: DraggableBodyRow,
              },
            }}
          />
          <div
            className="flex-end p2 ph3"
            style={{ borderTop: '1px solid #D6D6D8' }}
          >
            <Button className="mr2" onClick={clearClick}>
              恢复默认
            </Button>
            <Button type="primary" onClick={hidePopover}>
              确定
            </Button>
          </div>
        </div>
      }
    >
      {props.children || (
        <Tooltip title={'列设置'}>
          <SettingOutlined />
        </Tooltip>
      )}
    </Popover>
  );
};

export default ColumnSetting;
