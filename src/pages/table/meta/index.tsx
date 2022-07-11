/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-10 16:06:02
 * @description 配置化表格开发
 */

import { PageContainer } from '@ant-design/pro-layout';
import { RhTable, useTable } from '@roothub/components';
import { useRouteData } from '@umijs/max';
import tableMeta from './table.meta';
import workflow from './workflow';

export default () => {
  const { route }: any = useRouteData();

  const tableWorkFlow = useTable(workflow);

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
      <RhTable meta={tableMeta} {...tableWorkFlow} />
    </PageContainer>
  );
};
