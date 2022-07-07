import type { MenuProps } from 'antd';
import type { Key } from 'react';

export type RhMenuItem = {
  /**
   * 唯一key
   * @type Key
   */
  key: Key;
  /**
   * 路径url
   * @type string
   */
  url: string;
  /**
   * 路径path，当url空时取 path，兼容Umi路由配置
   * @type string
   */
  path?: string;
  /**
   * 菜单名称
   * @type string
   */
  name: string;
  /**
   * 菜单图标
   * @type string
   */
  icon?: string;
  /**
   * 是否禁用
   * @type boolean
   * @default false
   */
  disabled?: boolean;
  /**
   * 是否是外部link
   * @type boolean
   */
  isExternal?: boolean;
  /**
   * 外部icon
   * @type string
   */
  externalIcon?: string;
  /**
   * 子菜单
   * @type RhMenuItem[]
   */

  children?: RhMenuItem[];
  /**
   * 子菜单，当children空时取 routes，兼容Umi路由配置
   * @type RhMenuItem[]
   */
  routes?: RhMenuItem[];
};

export type RhMenuData = {
  /**
   * 传入ant-design menu item 配置
   * @boolean
   * @default false
   */
  menuItems: RhMenuItem[];
  /**
   * 子菜单收起icon
   * @type string
   */
  subMenuCollapseIcon?: string;
  /**
   * 子菜单展开icon
   * @type string
   */
  subMenuExpandIcon?: string;
  /**
   * 子菜单头部标题
   * @type string
   */
  menuHeaderTitle?: string;
  /**
   * 子菜单头部icon
   * @type string
   */
  menuHeaderTitleIcon?: string;
};

export type RhSidebarProps = {
  /**
   * inline 时菜单是否收起状态
   * @boolean
   * @default false
   */
  collapsible: boolean;
  /**
   * 菜单数据
   * @requires
   * @type MenuData[]
   */
  menuData: RhMenuData;
  /**
   * 传入ant-design menu对应的配置
   * @requires
   * @type MenuProps
   */
  menuOptions?: MenuProps;
  /**
   * 当前的path name
   * @type string
   */
  pathName?: string;
  /**
   * iconfont自定义url
   * @type string
   */
  iconScriptUrl?: string;
  /**
   * 自定义class类
   * @type string
   */
  className?: string;
  /**
   * 被选中时调用
   * @type function({ item, key, keyPath, selectedKeys, domEvent })
   */
  onSelect?: () => void;
  /**
   * 点击子菜单标题
   * @type function(target: RhMenuItem)
   */
  onTitleClick?: (target: RhMenuItem) => void;
};
