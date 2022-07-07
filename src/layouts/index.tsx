import RightContent from '@/components/RightContent';
import { Outlet } from '@umijs/max';
import { Layout } from 'antd';
import { Content, Header } from 'antd/lib/layout/layout';

// eslint-disable-next-line @typescript-eslint/no-unused-vars
function Layouts(props: any) {
  return (
    <Layout style={{ padding: 0 }}>
      <Header style={{ background: '#fff' }}>
        <RightContent />
      </Header>
      <Content style={{ margin: '24px 16px 0' }}>
        <Outlet />
      </Content>
    </Layout>
  );
}

export default Layouts;
