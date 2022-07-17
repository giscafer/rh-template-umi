import { Menu, MenuProps } from 'antd';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import IconFont from '../IconFont';
import './styles.less';
import type { RhMenuItem, RhSidebarProps } from './types';

type MenuItem = Required<MenuProps>['items'][number];

function getItem(
  label: React.ReactNode,
  key: React.Key,
  icon?: React.ReactNode,
  children?: MenuItem[],
  type?: 'group',
): MenuItem {
  return {
    key,
    icon,
    children,
    label,
    type,
  } as MenuItem;
}

/* const isMenuSelected = (pathname: string, currentUrl: string) => {
  return pathname && pathname.indexOf(currentUrl) > -1;
}; */

let Icon = IconFont;

const RhSidebar = (props: RhSidebarProps) => {
  const {
    menuData = { menuItems: [] },
    pathName = '',
    className = '',
    menuOptions = {},
    onTitleClick = () => {
      // This is intentional
    },
  }: RhSidebarProps = props;
  const {
    menuItems = [],
    menuHeaderTitleIcon = '',
    menuHeaderTitle = '',
  } = menuData;

  const navigate = useNavigate();

  const menuClickHandle = useCallback(
    ({ key }: { key: string }) => {
      if (/^http/.test(key)) {
        window.open(key);
      } else {
        navigate(key);
      }
      onTitleClick(key);
    },
    [history, onTitleClick],
  );

  const genIcon = useCallback((icon: string | ReactNode) => {
    if (!icon) {
      return null;
    }
    if (typeof icon !== 'string') {
      return (
        <div className="menuIcon" style={{ marginRight: 10 }}>
          {icon}
        </div>
      );
    }
    return <Icon type={icon} className="menuIcon" />;
  }, []);

  const renderMenuTitle = useMemo(() => {
    if (!menuHeaderTitle) {
      return null;
    }

    return (
      <div key="menu-title" className="sideMenuHeaderTitle">
        {menuHeaderTitleIcon && (
          <Icon type={menuHeaderTitleIcon} style={{ fontSize: '20px' }} />
        )}
        <span className="sideMenuHeaderTitleText" title={menuHeaderTitle}>
          {menuHeaderTitle}
        </span>
      </div>
    );
  }, [menuHeaderTitleIcon, menuHeaderTitle]);

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [menuSelectKeys, setMenuSelectKeys] = useState<string[]>([]);

  const menuItemList = useMemo(() => {
    let list: any[] = [];
    if (!menuItems?.length) {
      return list;
    }

    const genMenuItem = (menuItem: RhMenuItem) => {
      const { name, icon, path, key, routes } = menuItem;
      const children: any = routes?.length
        ? routes.map((route: RhMenuItem) => genMenuItem(route))
        : undefined;
      return getItem(name, path ?? key, genIcon(icon), children);
    };
    for (const item of menuItems) {
      if (item.name) {
        const menu = genMenuItem(item);
        list.push(menu);
      }
    }
    return list;
  }, [menuItems]);

  // 初始化菜单选中状态
  useEffect(() => {
    const defaultOpenKeys: string[] = [];
    const defaultSelectedOpenKeys: string[] = [];
    for (const item of menuItemList) {
      if (pathName.indexOf(item.key) === 0) {
        defaultOpenKeys.push(item.key);
        if (item.children?.length > 0) {
          for (const subItem of (item as any).children) {
            if (pathName.indexOf(subItem.key) === 0) {
              defaultSelectedOpenKeys.push(subItem.key);
              break;
            }
          }
        }
        break;
      }
    }
    setOpenKeys(defaultOpenKeys);
    setMenuSelectKeys(defaultSelectedOpenKeys);
  }, [menuItemList, pathName]);

  console.log('menuSelectKeys=', menuSelectKeys);

  return (
    <>
      {renderMenuTitle}
      <Menu
        className={`rh-sidebar ${className}`}
        onOpenChange={(keys) => {
          setOpenKeys(keys);
        }}
        openKeys={openKeys}
        onSelect={({ selectedKeys }) => {
          setMenuSelectKeys(selectedKeys);
        }}
        selectedKeys={menuSelectKeys}
        {...menuOptions}
        onClick={menuClickHandle}
        items={menuItemList}
      />
    </>
  );
};

export default RhSidebar;
