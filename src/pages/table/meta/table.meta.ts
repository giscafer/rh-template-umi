const tableMeta: any = {
  headerTitle: '配置化开发表格示例',
  pagination: false,
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
      searchType: 'query',
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
    // 按钮
    actions: [
      {
        name: '导入/停止',
        action: 'batch',
        disabled: true,
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
  rowActions: [
    {
      name: '编辑',
      action: 'edit',
    },
    { name: '复制', action: 'copy', isMore: true },
    { name: '删除', action: 'delete', isMore: true, className: 'red' },
  ],
};

export default tableMeta;
