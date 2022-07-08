import { Menu } from 'antd';
import type { ReactNode } from 'react';
import { useCallback, useEffect, useMemo, useState } from 'react';
import { history } from 'umi';
import IconFont from '../IconFont';
import RhMenuIcon from './menuIcon';
import styles from './style.module.less';
import type { RhMenuItem, RhSidebarProps } from './type';

const { SubMenu, Item } = Menu;

const isMenuSelected = (pathname: string, currentUrl: string) => {
  return pathname && pathname.indexOf(currentUrl) > -1;
};

let Icon = IconFont;

const RhSidebar = (props: RhSidebarProps) => {
  const {
    collapsible,
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
    subMenuCollapseIcon = '',
    subMenuExpandIcon = '',
    menuHeaderTitleIcon = '',
    menuHeaderTitle = '',
  } = menuData;

  const menuClickHandle = useCallback(
    (obj: RhMenuItem) => {
      if (obj.isExternal) {
        window.open(obj?.url);
      } else {
        history.push(obj?.url);
      }
      onTitleClick(obj);
    },
    [history, onTitleClick],
  );

  const iconRender = (icon: string | ReactNode) => {
    if (!icon) {
      return null;
    }
    if (typeof icon !== 'string') {
      return (
        <div className={styles.menuIcon} style={{ marginRight: 10 }}>
          {icon}
        </div>
      );
    }
    return <Icon type={icon} className={styles.menuIcon} />;
  };

  // 所有菜单元素上均有 name=menu 这是为了神策的自动埋点统计
  const renderMenuTree = useCallback(
    (items: RhMenuItem[], isSubmenu = 1) => {
      const menuPathName =
        pathName.indexOf('?') > -1 ? pathName.split('?')[0] : pathName;

      const result = items.map((obj: RhMenuItem) => {
        if (!obj.name) {
          return null;
        }
        if (!obj.url) {
          obj.url = obj.path || '';
        }
        const children = (obj.children || obj.routes) ?? [];
        const routeHaveName = children.some((c) => c.name);

        if (children.length && routeHaveName) {
          return (
            <SubMenu
              key={obj.key || obj.name}
              popupClassName={styles.collaspsedPopup}
              title={
                <div className={styles.submenuContentWrapper}>
                  {iconRender(obj.icon)}
                  <span
                    className={`${styles.menuText} ${styles.subMenuText}`}
                    title={obj.name}
                  >
                    {obj.name}
                  </span>
                  <span className={collapsible ? '' : styles.collapsibleIcon}>
                    {collapsible ? (
                      <RhMenuIcon
                        style={{
                          fontSize: '12px',
                          color: '#9EA5B2',
                          position: 'relative',
                          top: '-2px',
                          left: '-6px',
                        }}
                        type={subMenuCollapseIcon || 'iconRightarrow-filled'}
                      />
                    ) : (
                      <RhMenuIcon
                        className="ant-menu-submenu-custom-arrow"
                        type={subMenuExpandIcon || 'iconarrow_down_line'}
                      />
                    )}
                  </span>
                </div>
              }
            >
              {collapsible && (
                <Item
                  key={obj.key || obj.path}
                  disabled={!!obj.disabled}
                  className={styles.collaspsedMenuTitle}
                >
                  <span title={obj.name}>{obj.name}</span>
                </Item>
              )}
              {renderMenuTree(children, 0)}
            </SubMenu>
          );
        }
        if (isSubmenu && collapsible) {
          return (
            <SubMenu
              title={
                <span>
                  {iconRender(obj.icon)}
                  <span title={obj.name}>{obj.name}</span>
                </span>
              }
              key={obj.key || obj.name}
              popupClassName={styles.collaspsedPopup}
              onTitleClick={() => {
                menuClickHandle(obj);
              }}
              className={
                isMenuSelected(menuPathName, obj.url)
                  ? `rh_sidebar_selected ${styles.selected}`
                  : ''
              }
            >
              {collapsible && (
                <Item
                  key={obj.key || obj.name}
                  disabled={!!obj.disabled}
                  className={styles.collaspsedMenuTitle}
                >
                  <div className={styles.submenuContentWrapper}>
                    <span
                      className={`${styles.menuText} ${styles.subMenuText}`}
                      title={obj.name}
                    >
                      {obj.name}
                    </span>
                    {obj.isExternal ? (
                      <span className={styles.externalIconWrapper}>
                        <Icon
                          type={obj.externalIcon || 'icon-iconShare'}
                          className={`rh_sidebar_externalIcon ${styles.externalIcon}`}
                        />
                      </span>
                    ) : null}
                  </div>
                </Item>
              )}
            </SubMenu>
          );
        }
        return (
          <Item
            key={obj.key || obj.name}
            disabled={!!obj.disabled}
            className={`rh_sidebar_collaspsedMenu ${styles.collaspsedMenu} ${
              isMenuSelected(menuPathName, obj.url)
                ? `rh_sidebar_selected ${styles.selected}`
                : ''
            }`}
            onClick={() => {
              menuClickHandle(obj);
            }}
          >
            <div className={styles.submenuContentWrapper}>
              {iconRender(obj.icon)}
              <span
                className={`${styles.menuText} ${styles.subMenuText}`}
                title={obj.name}
              >
                {obj.name}
              </span>
              {obj.isExternal ? (
                <span className={styles.externalIconWrapper}>
                  <Icon
                    type={obj.externalIcon || 'icon-iconShare'}
                    className={`rh_sidebar_externalIcon ${styles.externalIcon}`}
                  />
                </span>
              ) : null}
            </div>
          </Item>
        );
      });
      return result;
    },
    [
      pathName,
      collapsible,
      subMenuCollapseIcon,
      subMenuExpandIcon,
      menuClickHandle,
    ],
  );

  const renderTreeTitle = useMemo(() => {
    if (!menuHeaderTitle) {
      return null;
    }

    return (
      <Item key="menu-title" className={styles.sideMenuHeaderTitle}>
        {menuHeaderTitleIcon && (
          <Icon type={menuHeaderTitleIcon} style={{ fontSize: '20px' }} />
        )}
        <span
          className={styles.sideMenuHeaderTitleText}
          title={menuHeaderTitle}
        >
          {menuHeaderTitle}
        </span>
      </Item>
    );
  }, [menuHeaderTitleIcon, menuHeaderTitle]);

  const [openKeys, setOpenKeys] = useState<string[]>([]);
  const [menuSelectKeys, setMenuSelectKeys] = useState<string[]>([]);

  // 初始化菜单选中状态
  useEffect(() => {
    const defaultOpenKeys: string[] = [];
    const defaultSelectedOpenKeys: string[] = [];
    for (const item of menuData.menuItems) {
      if (pathName.indexOf(item.url) === 0) {
        defaultOpenKeys.push(item.name);
        if (item.routes && item.routes.length) {
          for (const subItem of (item as any).routes) {
            if (pathName.indexOf(subItem.url) === 0) {
              defaultSelectedOpenKeys.push(subItem.name);
              break;
            }
          }
        }
        break;
      }
    }
    setOpenKeys(defaultOpenKeys);
    setMenuSelectKeys(defaultSelectedOpenKeys);
  }, [menuData.menuItems, pathName]);

  /*  const menuItemList = useMemo(()=>{
    let list:any[]=[renderTreeTitle];
    if(menuItems){
     const treeList:any= renderMenuTree(menuItems);
     list = menuItems.concat(treeList)
    }
    return list
    
  },[menuItems,renderTreeTitle]) */

  return (
    <>
      <Menu
        className={`rh_sidebar_rhSidebarMenu ${styles.rhSidebarMenu} ${className}`}
        // inlineCollapsed={collapsible}
        onOpenChange={(keys) => {
          setOpenKeys(keys);
        }}
        openKeys={openKeys}
        onSelect={({ selectedKeys }) => {
          setMenuSelectKeys(selectedKeys);
        }}
        selectedKeys={menuSelectKeys}
        {...menuOptions}
      >
        {renderTreeTitle}
        {menuItems && renderMenuTree(menuItems)}
      </Menu>
    </>
  );
};

export default RhSidebar;
