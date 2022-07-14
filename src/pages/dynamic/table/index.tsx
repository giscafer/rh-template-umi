import { PageContainer } from '@ant-design/pro-components';
import { RhTable } from '@roothub/components';
import demoSchema from './table.json';

function DemoRhDynamicTableModal() {
  return (
    <PageContainer
      fixedHeader
      header={{
        title: 'Json动态表格渲染Demo',
        subTitle: 'RhTable 和配置化开发类似，只是meta属性完全换成json',
        breadcrumb: {},
        extra: [],
      }}
    >
      <p className="f2">
        只需要简单的一行代码： &lt;RhTable meta={'{'}demoSchema.body{'}'} /&gt;
      </p>
      {demoSchema?.type === 'table' && <RhTable meta={demoSchema.body} />}
    </PageContainer>
  );
}

export default DemoRhDynamicTableModal;
