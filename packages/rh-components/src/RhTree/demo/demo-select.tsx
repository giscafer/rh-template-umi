import RhSearchInput from '@/components/RhSearchInput';
import RhTree from '@/components/RhTree';
import { useMemo, useState } from 'react';
import { searchByNodeName } from '../utils';

const dataList = [
  {
    id: 1,
    name: '挖掘机',
    parentId: null,
    type: 'model',
    icon: null,
  },
  {
    id: 2,
    name: '油缸',
    parentId: 1,
    type: 'model',
    icon: null,
  },
  {
    id: 8,
    name: '泵机',
    parentId: null,
    type: 'model',
  },
  {
    id: 9,
    name: 'Node',
    parentId: 8,
    type: 'node',
  },
  {
    id: 10,
    name: 'aaa属性',
    parentId: 8,
    type: 'attribute',
  },
  {
    id: 11,
    name: 'xxx属性',
    parentId: 8,
    type: 'attribute',
  },
];

const DemoTreeSelect = () => {
  const [treeSearchKey, setTreeSearchKey] = useState<string>('');

  // 含前端搜索过滤
  const treeData = useMemo(() => {
    return searchByNodeName(dataList, treeSearchKey);
  }, [treeSearchKey]);

  return (
    <div style={{ width: '300px' }}>
      <div style={{ margin: '10px 8px' }}>
        <RhSearchInput
          bordered={false}
          placeholder="请输入关键字"
          size="large"
          onSearch={(v) => {
            setTreeSearchKey(v);
          }}
        />
      </div>
      <RhTree
        showIcon
        defaultExpandAll={false}
        highlightText={treeSearchKey}
        showLine={false}
        height={300}
        list={treeData as any}
        className="rh-tree-select-panel"
      />
    </div>
  );
};
export default DemoTreeSelect;
