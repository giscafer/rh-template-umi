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
  // 通过提供的 useTable 接收 workflow 控制状态和副作用
  const { state$, actionObservable$, hideDrawer, refreshTable } = useTable(workflow);

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
      {/* 配置化开发表格示例 */}
      <RhTable meta={tableMeta} actionObservable$={actionObservable$} />
      {/* 简单弹窗示例代码 */}
      <RhDynamicDrawerForm
        visible={state$.drawerSimpleVisible}
        schema={demoSimpleSchema}
        onClose={() => {
          hideDrawer({ drawerSimpleVisible: false });
        }}
        afterSubmit={() => {
          refreshTable();
        }}
      />
      {/* 复杂弹窗例代码 */}
      <RhDynamicDrawerForm
        visible={state$.drawerComplexVisible}
        schema={demoComplexSchema}
        // initialValues={state$.selectedRow} // 编辑的情况
        // params={{ id: id }} // restful 接口
        onClose={() => {
          hideDrawer({ drawerComplexVisible: false });
        }}
        afterSubmit={() => {
          refreshTable();
        }}
      />
    </PageContainer>
  );
};
