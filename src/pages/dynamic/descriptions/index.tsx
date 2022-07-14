import { RhDescriptions, RhTable } from '@roothub/components';
import { Divider } from 'antd';
import applyDetailJson from './applyDetailTable.json';
import customerJson from './customer.json';
import operateTableJson from './operateTable.json';
import orderJson from './order.json';

export default function DescriptionsDemo() {
  return (
    <div className="m2">
      <RhDescriptions schema={orderJson.body as any} />
      <Divider />
      <RhDescriptions schema={customerJson.body as any} />
      <Divider />
      <RhTable schema={applyDetailJson.body} />
      <Divider />
      <RhTable schema={operateTableJson.body} />
    </div>
  );
}
