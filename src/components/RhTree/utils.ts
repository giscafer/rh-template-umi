import { cloneDeep } from 'lodash';
import type { ILeafNode } from './type';

export const isNotEmptyArray = (data: any[]) => data && Array.isArray(data) && data.length > 0;

export const translateDataToTree = <T extends ILeafNode>(data: any[]): any[] => {
  const dataParents = data.filter((item: T) => !item.parentId);

  const dataChildren = data.filter((item: T) => !!item.parentId);

  const translator = (parents: any[], children: any[]) => {
    parents.forEach((parent: any) => {
      children.forEach((child, index) => {
        if (child.parentId === parent.id) {
          const temp = JSON.parse(JSON.stringify(children));
          temp.splice(index, 1);

          translator([child], temp);
          // eslint-disable-next-line @typescript-eslint/no-unused-expressions
          isNotEmptyArray(parent.children)
            ? parent.children.push(child)
            : (parent.children = [child]);
        }
      });
    });
  };
  translator(dataParents, dataChildren);
  return dataParents;
};

const getParentNodes = (
  item: any,
  filterMap: Record<string, any>,
  nodeMap: Record<string, any>,
  result: any[],
  showTree: boolean,
) => {
  if (item.parentId && !filterMap[item.parentId]) {
    if (showTree) {
      filterMap[item.parentId] = nodeMap[item.parentId].name; // 标记
      result.push(nodeMap[item.parentId]);
      getParentNodes(nodeMap[item.parentId], filterMap, nodeMap, result, showTree);
    } else {
      item.parentId = null;
    }
  }
};

const getChildNodes = (
  nodes: any,
  filterMap: Record<string, any>,
  nodeMap: Record<string, any>,
  cloneTreeData: any[],
  result: any[],
) => {
  nodes.forEach((item: any) => {
    const filteredNodes = cloneTreeData.filter((node: any) => {
      if (node.parentId === item.id && !filterMap[node.id]) {
        filterMap[node.id] = nodeMap[node.id].name; // 标记
        return true;
      }
      return false;
    });

    if (filteredNodes && filteredNodes.length > 0) {
      result.push(...filteredNodes);
      getChildNodes(filteredNodes, filterMap, nodeMap, cloneTreeData, result);
    }
  });
};

/**
 * 根据关键词过滤树形数据
 * @param data 树数据list数组
 * @param searchKey 关键词搜索
 * @param showTree 是否显示结构
 * @returns
 */
export const searchByNodeName = (data: any[] = [], searchKey = '', showTree = true) => {
  const cloneTreeData = cloneDeep(data);
  const text = searchKey.trim();
  if (text) {
    const nodeMap: Record<string, any> = {}; // 方便拿节点
    const filterMap: Record<string, any> = {}; // 记录id，方便过滤
    const filterList: any[] = [];
    const result: any[] = [];
    cloneTreeData.forEach((d: any) => {
      nodeMap[d.id] = d;
      if (d.name.indexOf(text) !== -1) {
        filterMap[d.id] = d.name;
        filterList.push(d);
      }
    });
    filterList.forEach((item) => {
      result.push(item);
      getParentNodes(item, filterMap, nodeMap, result, showTree);
    });

    getChildNodes(filterList, filterMap, nodeMap, cloneTreeData, result);

    return result;
  }
  return data;
};
