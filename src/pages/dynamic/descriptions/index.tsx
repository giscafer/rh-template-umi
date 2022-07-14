import { ProDescriptions } from '@ant-design/pro-components';
import { RhDescriptions } from '@roothub/components';
import metaJson from './meta.json';

export default function DescriptionsDemo() {
  return (
    <div className="m2">
      <RhDescriptions schema={metaJson.body as any}>
        <ProDescriptions.Item dataIndex="percent" label="百分比" valueType="percent">
          100
        </ProDescriptions.Item>
      </RhDescriptions>
      <ProDescriptions.Item label="JSON 代码块" valueType="jsonCode">
        {JSON.stringify(metaJson, null, 4)}
      </ProDescriptions.Item>
    </div>
  );
}
