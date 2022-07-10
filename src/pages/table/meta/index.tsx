/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-10 16:06:02
 * @description 配置化表格开发
 */

import { PageContainer } from '@ant-design/pro-layout';
import { RhTable } from '@roothub/components';
import { useRouteData } from '@umijs/max';
import React from 'react';
import tableMeta from './table.meta';

export default () => {
  const actionRef = React.useRef<any>();
  const { route }: any = useRouteData();
  return (
    <PageContainer
      fixedHeader
      header={{
        title: route.name,
        subTitle: "searchPlacement:'toolbar' 控制精简搜索条件布局在toolbar区域",
        breadcrumb: {},
        extra: [],
      }}
    >
      <RhTable<any>
        meta={tableMeta}
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
