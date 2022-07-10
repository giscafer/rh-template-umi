import { PageContainer } from '@ant-design/pro-layout';
import { RhTable } from '@roothub/components';
import { useRouteData } from '@umijs/max';
import React from 'react';

const columns: any[] = [
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
  {
    title: '操作',
    valueType: 'option',
    render: (
      text: string,
      record: { id: any; url: string | undefined },
      _: any,
      action: { startEditable: (arg0: any) => void },
    ) => [
      <a
        key="editable"
        onClick={() => {
          action?.startEditable?.(record.id);
        }}
      >
        编辑
      </a>,
      <a href={record.url} target="_blank" rel="noopener noreferrer" key="view">
        查看
      </a>,
    ],
  },
];

export default () => {
  const actionRef = React.useRef<any>();
  const { route }: any = useRouteData();
  return (
    <PageContainer
      fixedHeader
      header={{
        title: route.name,
        breadcrumb: {},
        extra: [],
      }}
    >
      <RhTable<any>
        rowKey="id"
        headerTitle="这里是表格标题"
        columns={columns}
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        request={async (params = {}) => {
          // 这里只是举例，建议用httpGet
          const list: any = await fetch(
            'https://proapi.azurewebsites.net/github/issues',
          ).then((resp) => resp.json());
          return {
            data: list.data,
            success: true,
            // totalPages: list.page,
            // total: list.total,
          };
        }}
      />
    </PageContainer>
  );
};
