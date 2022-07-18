import { PageContainer } from '@ant-design/pro-components';
import { RhDescriptions, RhTable } from '@roothub/components';
import { Divider } from 'antd';
import applyDetailJson from './applyDetailTable.json';
import customerJson from './customer.json';
import operateTableJson from './operateTable.json';
import orderJson from './order.json';

export default function DescriptionsDemo() {
  return (
    <PageContainer
      fixedHeader
      header={{
        title: 'Json动态表格渲染Demo',
        subTitle: 'RhTable 和配置化开发类似，只是meta属性完全换成json',
        breadcrumb: {},
      }}
    >
      <div className="m1">
        <RhDescriptions schema={orderJson.body as any} />
        <Divider />
        <RhDescriptions schema={customerJson.body as any} />
        <Divider />
        <RhTable schema={applyDetailJson.body} />
        <Divider />
        <RhTable schema={operateTableJson.body} />
      </div>
    </PageContainer>
  );
}
