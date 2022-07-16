import type { Key } from 'react';

type TreeNode = {
  id: Key;
  parentId: Key;
  children?: TreeNode[];
  [key: string]: any;
};

const defaultOptions = { parentId: '' };

const list2tree = (dataSource: TreeNode[] = [], options = defaultOptions): TreeNode[] => {
  if (!Array.isArray(dataSource)) {
    console.error('源数据有误');
    return [];
  }

  const { parentId } = { ...defaultOptions, ...(options || {}) };
  const map = new Map();
  const nodes: TreeNode[] = [];

  // 生成Map
  dataSource.forEach((node) => {
    map.set(node.id, { ...node });
  });

  map.forEach((node) => {
    // 若当前节点属于根节点，直接添加到第一层
    if (node.parentId === parentId) {
      nodes.push(node);

      return;
    }

    // 若当前节点不属于根节点，寻找其父节点
    const parentNode = map.get(node.parentId);

    if (!parentNode) {
      console.error(`找不到id是${node.parentId}的数据`);
      return;
    }

    // 添加到父节点的children数组
    if (Array.isArray(parentNode.children)) {
      parentNode.children.push(node);
    } else {
      parentNode.children = [node];
    }
  });

  return nodes;
};

export default list2tree;
