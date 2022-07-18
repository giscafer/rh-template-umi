import { RhTableMeta } from 'packages/rh-components/src/RhTable/types';

const tableMeta: RhTableMeta = {
  rowSelectionType: 'multiple',
  searchPlacement: 'toolbar',
  columns: [
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      searchType: 'query',
      tip: '标题过长会自动收缩',
    },
    {
      title: '状态',
      dataIndex: 'state',
      valueType: 'select',
      valueEnum: {
        all: '全部',
        open: '未解决',
        closed: '已解决',
        processing: '解决中',
      },
    },
    {
      title: '创建时间',
      key: 'showTime',
      dataIndex: 'created_at',
      valueType: 'dateTime',
      hideInSearch: true,
    },
  ],
  toolbar: {
    menu: {
      type: 'inline',
      // activeKey: '',
      items: [
        { label: '全部', key: '' },
        { label: '未解决', key: 'open' },
        { label: '已解决', key: 'closed' },
      ],
      onChange: (activeKey) => {
        console.log('activeKey', activeKey);
      },
    },
    // 按钮
    actions: [
      {
        name: '新建',
        action: 'add',
      },
    ],
  },
  // 行操作列按钮
  optionActions: [
    {
      name: '编辑',
      action: 'edit',
    },
    { name: '复制', action: 'copy', isMore: true },
    { name: '删除', action: 'delete', isMore: true, className: 'red' },
  ],
};

export default tableMeta;
