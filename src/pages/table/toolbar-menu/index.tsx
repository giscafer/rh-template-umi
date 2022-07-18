/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-10 22:04:19
 * @description 多选
 */

import { PageContainer } from '@ant-design/pro-layout';
import { RhTable } from '@roothub/components';
import { useRouteData } from '@umijs/max';
import tableMeta from './table.meta';

export default () => {
  const { route }: any = useRouteData();
  return (
    <PageContainer
      fixedHeader
      header={{
        title: route.name,
        subTitle: 'toolbar.menu 扩展配置工具栏渲染。',
        breadcrumb: {},
        extra: [],
      }}
    >
      <RhTable<any>
        meta={tableMeta}
        // eslint-disable-next-line @typescript-eslint/no-unused-vars
        request={async (params = {}) => {
          // 这里只是举例，建议用httpGet
          const list: any = await fetch('https://proapi.azurewebsites.net/github/issues').then((resp) => resp.json());
          return {
            data: list.data,
            success: true,
          };
        }}
      />
    </PageContainer>
  );
};
