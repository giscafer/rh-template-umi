import RhTree from '@/components/RhTree';
import { CaretDownOutlined } from '@ant-design/icons';
import React from 'react';

const Demo = () => {
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

  return (
    <div className="flex">
      <RhTree showIcon showLine={{ showLeafIcon: false }} height={300} list={dataList as any} />
    </div>
  );
};
export default Demo;
