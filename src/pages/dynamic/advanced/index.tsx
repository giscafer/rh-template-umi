import { PageContainer, ProCard } from '@ant-design/pro-components';
import { RhDescriptions, RhTable, RhTitle } from '@roothub/components';
import { Button, Tag } from 'antd';
import baseJson from './base.json';
import contentJson from './content.json';
import operateTableJson from './deviceOrder.json';
import gardenJson from './garden.json';

export default function DescriptionsDemo() {
  return (
    <PageContainer
      fixedHeader
      className="ghost"
      header={{
        title: '高级详情页2',
        subTitle: <Tag color="processing">使用中</Tag>,
        breadcrumb: {
          routes: [
            {
              path: '',
              breadcrumbName: '幼儿园管理',
            },
            {
              path: '',
              breadcrumbName: '修改幼儿园',
            },
          ],
        },
        extra: [
          <Button key="fee" type="primary">
            续费
          </Button>,
        ],
      }}
      content={<RhDescriptions schema={contentJson as any} />}
      tabList={[
        {
          tab: '基础管理',
          key: 'base',
          closable: false,
        },
        {
          tab: '小程序管理',
          key: 'program',
        },
      ]}
    >
      <RhDescriptions schema={baseJson as any} className="mt2" />
      <RhDescriptions schema={gardenJson as any} className="mt2" />
      <ProCard title={<RhTitle title="设备订单" />} extra={<Button type="primary">购买设备</Button>} className="mt2">
        <RhTable schema={operateTableJson.body} />
      </ProCard>
      <div style={{ height: '120px' }}></div>
    </PageContainer>
  );
}
