import { Empty } from 'antd';
import React from 'react';
import emptyIcon from './empty.svg';

export type EmptyProps = {
  image?: React.ReactNode;
  emptyText?: string;
  description?: React.ReactNode;
};

function RhEmpty(props: EmptyProps) {
  const { image, emptyText = '暂无数据', description } = props || {};
  return (
    <Empty
      image={image || emptyIcon}
      description={
        description ?? (
          <span className="ant-empty-description">{emptyText}</span>
        )
      }
    />
  );
}

export default RhEmpty;
