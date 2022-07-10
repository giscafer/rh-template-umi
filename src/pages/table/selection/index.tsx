/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-10 22:04:19
 * @description 多选
 */

import { PageContainer } from '@ant-design/pro-layout';
import { RhTable } from '@roothub/components';
import { useRouteData } from '@umijs/max';
import { Switch } from 'antd';
import React, { useState } from 'react';
import tableMeta from './table.meta';

export default () => {
  const actionRef = React.useRef<any>();
  const { route }: any = useRouteData();
  const [selectionType, setSelectionType] = useState<string>(tableMeta.rowSelectionType ?? 'multiple');
  return (
    <PageContainer
      fixedHeader
      header={{
        title: route.name,
        subTitle: "rowSelectionType:'multiple' 控制表格多选",
        breadcrumb: {},
        extra: [],
      }}
    >
      切换单选/多选：
      <Switch
        onChange={(v) => {
          console.log(v);
          setSelectionType(!v ? 'multiple' : 'single');
        }}
      />
      <RhTable<any>
        meta={{ ...tableMeta, rowSelectionType: selectionType }}
        actionRef={actionRef}
        pagination={{
          pageSize: 10,
        }}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        request={async (params = {}) => {
          // 这里只是举例，建议用httpGet
          const list: any = await fetch('https://proapi.azurewebsites.net/github/issues').then((resp) => resp.json());
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
