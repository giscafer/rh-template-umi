/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-10 16:06:02
 * @description 配置化表格开发
 */

import { PageContainer } from '@ant-design/pro-layout';
import { RhDynamicDrawerForm, RhTable, useTable } from '@roothub/components';
import { useRouteData } from '@umijs/max';
import demoSchema from './form.json';
import tableMeta from './table.meta';
import workflow from './workflow';

export default () => {
  const { route }: any = useRouteData();
  const { state$, actionObservable$ } = useTable(workflow);

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
      <RhTable meta={tableMeta} actionObservable$={actionObservable$} />
      <RhDynamicDrawerForm
        // initialValues={state$.selectedRow}
        visible={state$.drawerVisible}
        schema={demoSchema}
        // params={{ id: id }}
        onClose={() => {
          actionObservable$.put({ type: '$merge', payload: { drawerVisible: false } });
        }}
        afterSubmit={() => {
          // refresh table
          actionObservable$.put({ type: '$table/refresh', payload: { drawerVisible: false } });
        }}
      />
    </PageContainer>
  );
};
