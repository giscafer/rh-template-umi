import React from 'react';

export type PageInfoConfig = {
  /**
   * 每页记录数字段名，如 restful 常用 limit
   * @default 'limit'
   */
  pageSizeField: string;
  /**
   * 当前页字段名，如 restful 常用 page
   * @default 'page'
   */
  currentField: string;
};

export interface RhConfigConsumerProps {
  children?: React.ReactNode;
  /**
   * 表格配置
   */
  tableRequest: {
    pageInfoConfig: PageInfoConfig;
  };
}

export const RhConfigContext = React.createContext<RhConfigConsumerProps>({
  tableRequest: {
    pageInfoConfig: {
      pageSizeField: 'limit',
      currentField: 'page',
    },
  },
});

export const RhConfigConsumer = RhConfigContext.Consumer;
