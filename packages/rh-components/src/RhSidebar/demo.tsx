import { Layout } from 'antd';
import { useState } from 'react';
import RhSidebar from '.';
import type { RhMenuData } from './types';

const { Content, Header, Sider } = Layout;

const MENUS = {
  // menuHeader: {
  //   key: 'goback',
  //   icon: 'iconHome',
  //   name: '首页',
  //   url: '/dashboard',
  //   isExternal: true
  // },
  menuHeaderTitle: '运营赋能服务',
  menuHeaderTitleIcon: 'iconMenuoperate',
  subMenuCollapseIcon: 'iconRightarrow-filled',
  subMenuExpandIcon: 'iconarrow_down_line',
  menuItems: [
    {
      key: 'tenant-admin',
      name: '客户管理',
      icon: 'iconDevice_select',
      url: '/admin/company',
    },
    {
      key: 'admin-apply',
      name: '正式版申请',
      icon: 'iconCommoditymanagement',
      url: '/admin/office-apply',
      children: [
        {
          key: 'pending',
          name: '未处理申请',
          url: '/admin/office-apply/pending',
          isExternal: true,
        },
        {
          key: 'solved',
          name: '已处理申请',
          url: '/admin/office-apply/solved',
        },
      ],
    },
    {
      key: 'statistics',
      icon: 'iconUsagestatistics',
      name: '用量统计',
      url: '/service/operating/statistics',
    },
    {
      key: 'module-id',
      icon: 'iconModuleIDmanagement',
      name: '模组 ID 管理',
      url: '/service/operating/moduleIdManagement',
    },
    {
      key: 'warehouse-managegement',
      icon: 'iconwarehouse',
      name: '库存管理',
      url: '/service/operating/wareHourseManagement',
    },
    {
      key: 'contract-managegement',
      icon: 'iconContractmanagement',
      name: '合同管理',
      url: '/service/operating/contractManagement',
    },
    {
      key: 'bill-managegement',
      icon: 'iconBillmanagement',
      name: '设备模拟器 (公测)',
      url: '/service/operating/billManagement',
      isExternal: true,
      externalIcon: 'iconShare',
    },
    {
      key: 'icona-Datasubscription',
      icon: 'icona-Datasubscription',
      name: '测试ICON',
    },
  ],
};
function RhSidebarDemo() {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [collapsed, setCollapsed] = useState(false);
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [pathName, setPathName] = useState('/service/operating/billManagement');

  return (
    <Layout
      className="main"
      style={{ minHeight: '60vh', border: '1px solid rgba(0,0,0,0.1)' }}
    >
      <Header style={{ height: 56 }} />
      <Layout hasSider style={{ position: 'relative' }}>
        <Sider
          width={224}
          /*
          collapsible
          onCollapse={(v) => setCollapsed(v)}
          collapsed={collapsed} */
          style={{
            overflow: 'auto',
            height: '100%',
            position: 'absolute', // 项目中，这里写 fixed，demo的原因这里写了绝对定位
            left: 0,
            boxShadow: '2px 0px 2px rgba(0,0,0,0.1)',
            background: '#fff',
          }}
        >
          {/*
        collapsible: 当前菜单收缩状态
        menuData: 菜单数据
        pathName: 当前的path name
        menuOption: 传入ant-design menu对应的配置:
          mode: 侧边栏菜单类型
          defaultOpenKeys: 初始展开的 SubMenu 菜单项 key 数组
          selectedKeys: 当前选中的菜单项 key 数组
          defaultSelectedKeys: 初始选中的菜单项 key 数组
          openKeys: 当前展开的 SubMenu 菜单项 key 数组
          onTitleClick: 点击子菜单标题
      */}
          <RhSidebar
            menuOptions={{
              mode: 'inline',
              defaultOpenKeys: [],
              style: { borderRight: 0 },
            }}
            menuData={MENUS as RhMenuData}
            collapsible={collapsed}
            pathName={pathName}
            iconScriptUrl="//at.alicdn.com/t/font_1464531_kbfzydihsfs.js"
          />
        </Sider>
        <Content />
      </Layout>
    </Layout>
  );
}

export default RhSidebarDemo;
