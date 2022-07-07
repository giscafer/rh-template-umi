import { RhTable } from '@/components';
import { httpGet } from '@/shared/http';
import { PageContainer } from '@ant-design/pro-layout';
import { useRouteData } from '@umijs/max';
import React from 'react';

const columns: any[] = [
  {
    title: 'name',
    dataIndex: 'name',
    hideInSearch: true,
  },
  {
    title: 'status',
    dataIndex: 'status',
    hideInSearch: true,
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
        columns={columns}
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
        request={async () => {
          const list: any = await httpGet('/pet/findByStatus');
          return {
            data: list.data,
            success: true,
          };
        }}
      />
    </PageContainer>
  );
};
