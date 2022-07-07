/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-06-14 15:12:09
 * @description 自适应页面里的属性组件高度，当不设置height时，会自动计算；
 * 暂不考虑弹窗自适应高度。弹窗时自己先设置height
 */

import { useMount, useUnmount } from 'ahooks';
import { useCallback, useRef } from 'react';

const viewportHeight =
  window.innerHeight ||
  document.documentElement.clientHeight ||
  document.body.clientHeight;

let timeoutTimer = null;

/**
 * 动态适配(使用特别要注意container，不然可能影响其他地方)
 * @param containerElement 父级容器
 * @param selector 改变高度对象的选择器
 * @returns
 */
export default function useTreeHeight(
  containerElement?: string | HTMLElement,
  autoHeight = true,
  selector = '.rh-editable-tree '
): [number | null, (timeout?: number) => NodeJS.Timeout] {
  const treeHeightRef = useRef<number | null>(null);

  // timeout 延迟时间，避免过早计算getBoundingClientRect
  const updateTableHeight = useCallback(
    (timeout = 0) => {
      // 如果已经设置了高度，则不再设置
      if (!autoHeight) {
        return;
      }
      let containerElem: HTMLElement = null;
      if (typeof containerElement === 'string') {
        containerElem = document.querySelector(containerElement) as HTMLElement;
      } else if (containerElement) {
        containerElem = containerElement as HTMLElement;
      } else {
        // 可以不传父级容器
        containerElem = document.body;
      }

      return setTimeout(() => {
        const treeElement = containerElem.querySelector(
          selector
        ) as HTMLElement;
        const treeElementRect = treeElement?.getBoundingClientRect();

        if (!treeElementRect) return;
        const height = viewportHeight - treeElementRect.top;
        treeHeightRef.current = height;
        treeElement.style.height = `${height}px`;
        treeElement.style['max-height'] = `${height}px`;
      }, timeout);
    },
    [autoHeight, containerElement, selector]
  );
  // 首次渲染时执行
  useMount(() => {
    timeoutTimer = updateTableHeight(300);
  });

  useUnmount(() => {
    if (timeoutTimer) {
      clearTimeout(timeoutTimer);
    }
  });

  return [treeHeightRef.current, updateTableHeight];
}
