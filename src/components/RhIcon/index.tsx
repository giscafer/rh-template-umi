import type { ReactElement, ReactNode } from 'react';
import { useMemo } from 'react';
import IconFont from '../IconFont';
import './styles.less';

export type RhIconType = {
  /**
   * 图标
   * @type string | ReactElement;
   */
  src: string | ReactElement;
  /**
   * 字体大小（如果有字体）
   * @type number
   * @default 14
   */
  fontSize?: number;
  /**
   * img 图片大小（src为图片的时候生效）
   * @type number
   * @default 20
   */
  imageSize?: number;
  /**
   * children
   * @type ReactNode;
   */
  children?: ReactNode;
  /**
   * 自定义样式
   * @type string
   */
  className?: string;
  [key: string]: any;
};

const isImage = (src: string) => {
  return /(\.(gif|png|jpg|jpeg|webp|svg|psd|bmp|tif))$/i.test(src);
};

function RhIcon({ src, fontSize = 14, imageSize = 16, className, children, ...restProps }: RhIconType) {
  const iconNode = useMemo(() => {
    if (typeof src === 'string') {
      if (isImage(src)) {
        return <img src={src} width={imageSize} />;
      }
      return <IconFont type={src} className={className} />;
    }

    return src;
  }, [src]);

  return (
    <div className={`rh-icon ${className ? className : ''}`} {...restProps}>
      {iconNode}
      {children && (
        <span className="icon-label" style={{ fontSize }}>
          {children}
        </span>
      )}
    </div>
  );
}

export default RhIcon;
