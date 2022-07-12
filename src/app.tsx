// 运行时配置

import LayoutSideBar from '@/components/LayoutSideBar';
import RightContent from '@/components/RightContent';
import menuData from '@/config/menus';
import { RhConfigProvider } from '@roothub/components';
import { RunTimeLayoutConfig } from '@umijs/max';

RhConfigProvider.config({
  tableRequest: {
    pageInfoConfig: {
      pageSizeField: 'per_page',
      currentField: 'page',
    },
  },
});

// 全局初始化数据配置，用于 Layout 用户信息和权限初始化
// 更多信息见文档：https://next.umijs.org/docs/api/runtime-config#getinitialstate
export async function getInitialState(): Promise<Record<string, any>> {
  return { name: '@umijs/max' };
}

// ProLayout 支持的api https://procomponents.ant.design/components/layout
export const layout: RunTimeLayoutConfig = ({ initialState }: any) => {
  return {
    layout: 'mix',
    className: 'roothub',
    fixedHeader: true,
    backgroundColor: '#fff',
    // disableContentMargin: false,
    rightContentRender: () => <RightContent />,
    /*  waterMarkProps: {
      content: initialState?.currentUser?.name,
    }, */
    menuRender: (menuProps: any) => {
      const { location } = menuProps;
      const { pathname } = location;
      return <LayoutSideBar collapsible={false} menuData={menuData} pathName={pathname} />;
    },
    // 默认布局调整
    // menuHeaderRender: undefined,
    ...initialState?.settings,
    // 自定义 403 页面
    // unAccessible: <div>unAccessible</div>,
  };
};
