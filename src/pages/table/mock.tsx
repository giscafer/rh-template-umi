/**
 * @author sunlight yi
 * @email yshnzs@163.com
 * @created 2022-02-21 16:19:13
 * @modified 2022-07-07 16:53:16
 * @description
 */

import { RhTable } from '@/components';
import { httpGet } from '@/shared/http';
import { PageContainer } from '@ant-design/pro-layout';
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

export default (props: any) => {
  const actionRef = React.useRef<any>();
  return (
    <PageContainer
      fixedHeader
      header={{
        title: props.route.name,
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
          const list: any = await httpGet('/pet/findByStatus')
          return {
            data: list.data,
            success: true,
          };
        }}
      />
    </PageContainer>
  );
};
