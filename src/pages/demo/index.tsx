import { PageContainer } from '@ant-design/pro-components';

function DemoPage() {
  return (
    <PageContainer
      fixedHeader
      header={{
        title: 'Demo Page',
        breadcrumb: {},
        extra: [],
      }}
    >
      <h3>demo</h3>
    </PageContainer>
  );
}

export default DemoPage;
