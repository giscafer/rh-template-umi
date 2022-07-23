import { PageContainer } from '@ant-design/pro-components';
import { RhDescriptions, RhTable } from '@roothub/components';
import { Button, Divider } from 'antd';
import applyDetailJson from './applyDetailTable.json';
import customerJson from './customer.json';
import operateTableJson from './operateTable.json';
import orderJson from './order.json';

export default function DescriptionsDemo() {
  return (
    <PageContainer
      fixedHeader
      header={{
        title: '高级详情页-Json动态渲染',
        subTitle: '万物都可以用json表示，如果不行或者麻烦，是你封装得不够好用而已',
        breadcrumb: {
          routes: [
            {
              path: '',
              breadcrumbName: '订单管理',
            },
            {
              path: '',
              breadcrumbName: '订单详情',
            },
          ],
        },
        extra: [
          <Button key="1">打印</Button>,
          <Button key="2">导出</Button>,
          <Button key="3" type="primary">
            处理订单
          </Button>,
        ],
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
