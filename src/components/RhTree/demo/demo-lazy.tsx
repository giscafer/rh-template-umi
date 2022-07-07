/**
 * 异步加载数据
 */

import RhTree from '@/components/RhTree';
import { uniqBy } from 'lodash';
import { useState } from 'react';

const initDataList = [
  {
    id: 1,
    name: '挖掘机',
    parentId: null,
    type: 'model',
    icon: null,
  },
  {
    id: 8,
    name: '泵机',
    parentId: null,
    type: 'model',
  },
];

const DemoTreeLazy = () => {
  const [dataList, setDataList] = useState(initDataList);

  const onLoadData = ({ key, children }: any) => {
    console.log('onLoadData', key, children);

    return new Promise<void>((resolve) => {
      if (children?.length) {
        resolve();
        return;
      }
      setTimeout(() => {
        setDataList((origin) => {
          console.log('origin', origin);

          // list拼接就够了
          const newList = origin.concat([
            {
              id: 2,
              name: '油缸',
              parentId: 1,
              type: 'model',
              icon: null,
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
          ]);
          // 这里简单演示去重，避免重复添加
          return uniqBy(newList, 'id');
        });

        resolve();
      }, 1000);
    });
  };

  return (
    <div style={{ width: '300px' }}>
      <RhTree showIcon showLine={false} height={300} loadData={onLoadData} list={dataList as any} />
    </div>
  );
};
export default DemoTreeLazy;
