import { DownOutlined, UpOutlined } from '@ant-design/icons';
import type { Key, ReactElement } from 'react';
import { useState } from 'react';
import styles from './index.module.less';

export type RhTitleProps = {
  key?: Key;
  /**
   * 文本信息
   * @type string
   */
  title: string;
  /**
   * 布局方式，和 showCollapse 互斥
   * @type 'column' | 'default'
   * @default 'default'
   */
  layout?: string;
  /**
   * 文本字体大小
   * @default 18
   */
  fontSize?: number;
  /**
   * flex布局 justify-content
   * @default start
   */
  justifyContent?: string;
  /**
   * 是否显示折叠
   * @default false
   */
  showCollapse?: boolean;
  /**
   * 是否显示折叠文本（收起/展开）
   * @default false
   */
  showCollapseText?: boolean;
  /**
   * 折叠状态
   * @default false
   */
  collapse?: boolean;
  /**
   * 折叠回调
   * @default (v: boolean) => void
   */
  onCollapseChange?: (v: boolean) => void;
  /**
   * 自定义样式
   */
  style?: any;
  /**
   * 自定义title样式
   */
  titleStyle?: any;
  children?: ReactElement;
};

function RhTitle(props: RhTitleProps) {
  const {
    title,
    fontSize = 18,
    justifyContent = 'start',
    layout = 'default',
    showCollapse = false,
    showCollapseText = false, // 属性越加越乱了。。。
    collapse = false,
    onCollapseChange = () => {
      // This is intentional
    },
    style = {},
    titleStyle = { height: '32px' },
    children,
  } = props;
  const [collapseStatus, setCollapseStatus] = useState(collapse);

  if (!title) {
    return <> {children}</>;
  }

  return (
    <div
      className={`${styles.rhTitle} ${
        layout === 'column' ? `${styles.rhTitleFlex}` : ''
      }`}
      style={style}
    >
      <div
        className={`${
          layout === 'column'
            ? `${styles.layoutColumn}`
            : `${showCollapse ? `${styles.rhTitleCollapse}` : ''}`
        }`}
        style={titleStyle}
      >
        <div
          className={styles.flexDiv}
          style={{ justifyContent, height: `${titleStyle.height}` }}
        >
          <div
            className={styles.borderDiv}
            style={{ height: `${fontSize}px` }}
          />
          <div className={styles.content} style={{ fontSize: `${fontSize}px` }}>
            {title}
          </div>
        </div>
        {showCollapse && layout !== 'column' && (
          <div
            className={styles.collapse}
            onClick={() => {
              const v = !collapseStatus;
              setCollapseStatus(v);
              onCollapseChange(v);
            }}
          >
            {!collapseStatus ? (
              <span>
                {showCollapseText && (
                  <span className={styles.collapseText}>收起</span>
                )}
                <UpOutlined />
              </span>
            ) : (
              <span>
                {showCollapseText && (
                  <span className={styles.collapseText}>展开</span>
                )}
                <DownOutlined />
              </span>
            )}
          </div>
        )}
      </div>
      {children && (
        <div
          style={{
            display: collapseStatus ? 'none' : 'block',
            padding: '16px 0',
          }}
        >
          {children}
        </div>
      )}
    </div>
  );
}

export default RhTitle;
