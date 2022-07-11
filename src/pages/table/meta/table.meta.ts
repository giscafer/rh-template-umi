import { RhTableMeta } from 'packages/rh-components/src/RhTable/types';

const tableMeta: RhTableMeta = {
  headerTitle: 'LeekHub/leek-fund 仓库',
  api: '/repos/LeekHub/leek-fund/issues',
  searchPlacement: 'toolbar',
  columns: [
    {
      title: '标题',
      dataIndex: 'title',
      ellipsis: true,
      searchType: 'query',
      tip: '韭菜盒子插件issue标题',
    },
    {
      title: '状态',
      dataIndex: 'state',
      searchType: 'query',
      valueType: 'select',
      valueEnum: {
        all: { text: '全部', status: 'Default' },
        open: {
          text: '未解决',
          status: 'Error',
        },
        closed: {
          text: '已解决',
          status: 'Success',
          disabled: true,
        },
        processing: {
          text: '解决中',
          status: 'Processing',
        },
      },
    },
    {
      title: '创建人',
      dataIndex: 'user.login',
    },
    {
      title: '创建时间',
      dataIndex: 'created_at',
      valueType: 'dateTime',
    },
  ],
  toolbar: {
    settings: undefined,
    actions: [
      {
        name: '导入/停止',
        action: 'batch',
        disabled: false,
        type: 'primary',
        ghost: true,
        children: [
          { name: '全部启动', action: 'startAll' },
          { name: '全部停止', action: 'stopAll' },
          { name: '批量启动', action: 'batchStart' },
          { name: '批量停止', action: 'batchStop' },
        ],
      },
      {
        name: '新建',
        action: 'add',
      },
    ],
  },
  // 行操作列按钮
  tableActions: [
    {
      name: '编辑',
      action: 'edit',
    },
    { name: '复制', action: 'copy', isMore: true },
    { name: '删除', action: 'delete', isMore: true, danger: true },
  ],
};

export default tableMeta;
