import { RhSidebar } from '@roothub/components';
import { useMount } from 'ahooks';
import { Layout } from 'antd';
import { useCallback, useState } from 'react';
import styles from './styles.less';

const contentSelector = '#root > div.ant-design-pro > section.ant-layout > div.ant-layout';
// mfsu奇葩bug问题（默认认为是开启）
const mfsuBugFlag = true;
// const mfsuBugFlag = process.env.NODE_ENV === 'development';

function SideBar({ menuData, pathName = '/welcome' }: Record<string, any>) {
  const [isSideCollapsed, setIsSideCollapsed] = useState<boolean>(false);

  useMount(() => {
    const contentEl: any = document.querySelector(contentSelector);
    contentEl.className = `ant-layout ${mfsuBugFlag ? 'sidebar-expand' : ''}`;
  });
  // 动态改content左边margin
  const leftDistanceFn = useCallback((collapse: any) => {
    const contentEl: any = document.querySelector(contentSelector);
    if (collapse) {
      contentEl.className = `ant-layout ${mfsuBugFlag ? 'sidebar-collapse' : ''}`;
    } else {
      contentEl.className = `ant-layout ${mfsuBugFlag ? 'sidebar-expand' : ''}`;
    }
  }, []);

  const toggleSideCollapsed = useCallback(
    (collapsed: boolean | ((prevState: boolean) => boolean)) => {
      setIsSideCollapsed(collapsed);
      leftDistanceFn(collapsed);
    },
    [menuData],
  );

  return (
    <Layout.Sider
      theme="light"
      className={styles.sideBar}
      collapsible
      collapsed={isSideCollapsed}
      onCollapse={toggleSideCollapsed}
      collapsedWidth={56}
      width={224}
      /* trigger={
        <div
          style={{
            padding: '0 12px',
            textAlign: isSideCollapsed ? 'center' : 'right',
          }}
        >
          <IconFont type={isSideCollapsed ? 'rh-icon-arrow-right' : 'rh-icon-arrowleft'} />
        </div>
      } */
    >
      <RhSidebar
        menuOptions={{
          mode: 'inline',
          style: { borderRight: 0 },
        }}
        menuData={menuData}
        collapsible={isSideCollapsed}
        pathName={pathName}
      />
    </Layout.Sider>
  );
}

export default SideBar;
