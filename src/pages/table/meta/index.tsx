/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-10 16:06:02
 * @description 配置化表格开发
 */

import { PageContainer } from '@ant-design/pro-layout';
import { RhDynamicDrawerForm, RhTable, useTable } from '@roothub/components';
import { useRouteData } from '@umijs/max';
import demoComplexSchema from './complex.json';
import demoSimpleSchema from './simple.json';
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
        subTitle: '动态表格&动态表单渲染',
        breadcrumb: {},
        extra: [],
      }}
    >
      <RhTable meta={tableMeta} actionObservable$={actionObservable$} />
      <RhDynamicDrawerForm
        visible={state$.drawerSimpleVisible}
        schema={demoSimpleSchema}
        onClose={() => {
          actionObservable$.put({ type: '$merge', payload: { drawerSimpleVisible: false } });
        }}
        afterSubmit={() => {
          // refresh table
          actionObservable$.put({ type: '$table/refresh', payload: { drawerSimpleVisible: false } });
        }}
      />
      <RhDynamicDrawerForm
        visible={state$.drawerComplexVisible}
        schema={demoComplexSchema}
        // initialValues={state$.selectedRow} // 编辑的情况
        // params={{ id: id }} // restful 接口
        onClose={() => {
          actionObservable$.put({ type: '$merge', payload: { drawerComplexVisible: false } });
        }}
        afterSubmit={() => {
          // refresh table
          actionObservable$.put({ type: '$table/refresh', payload: { drawerComplexVisible: false } });
        }}
      />
    </PageContainer>
  );
};
