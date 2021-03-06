import { PageContainer, ProCard } from '@ant-design/pro-components';
import { RhDescriptions, RhTable, RhTitle } from '@roothub/components';
import { Button, Tag } from 'antd';
import { map } from 'rxjs';
import { useEventCallback } from 'rxjs-hooks';
import baseJson from './base.json';
import contentJson from './content.json';
import operateTableJson from './deviceOrder.json';
import gardenJson from './garden.json';
import programJson from './program.json';

export default function DescriptionsDemo() {
  const [onTabChange, [tabActiveKey]] = useEventCallback<any, any>(
    (event$) => event$.pipe(map((event) => [event])),
    ['base'],
  );

  return (
    <PageContainer
      fixedHeader
      className="ghost"
      header={{
        title: '高级详情页',
        subTitle: <Tag color="processing">使用中</Tag>,
        breadcrumb: {
          routes: [
            {
              path: '',
              breadcrumbName: '幼儿园管理',
            },
            {
              path: '',
              breadcrumbName: '幼儿园详情',
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
      tabActiveKey={tabActiveKey}
      onTabChange={onTabChange}
    >
      {tabActiveKey === 'base' && (
        <div className="base-content">
          <RhDescriptions schema={baseJson as any} className="mt2" />
          <RhDescriptions schema={gardenJson as any} className="mt2" />
          <ProCard
            title={<RhTitle title="设备订单" />}
            extra={<Button type="primary">购买设备</Button>}
            className="mt2"
          >
            <RhTable schema={operateTableJson.body} />
          </ProCard>
        </div>
      )}
      {tabActiveKey === 'program' && (
        <div className="program-content">
          <RhDescriptions
            schema={{ title: '园丁小程序', ...programJson } as any}
            className="mt2"
            cardProps={{
              extra: (
                <div>
                  <Button ghost type="primary" className="mr2">
                    解除绑定
                  </Button>
                  <Button type="primary">绑定</Button>
                </div>
              ),
            }}
          />
          <RhDescriptions schema={{ title: '家长小程序', ...programJson } as any} className="mt2" />
        </div>
      )}

      <div style={{ height: '120px' }}></div>
    </PageContainer>
  );
}
