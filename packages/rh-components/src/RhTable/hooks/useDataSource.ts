/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-10 22:30:50
 * @description 数据源 hooks，基于 axios 和 useRequest 缓存请求
 */

import { ProTableProps } from '@ant-design/pro-components';
import httpClient from '@roothub/helper/src/http';
import { useRequest } from 'ahooks';
import { PaginationProps, TablePaginationConfig } from 'antd';
import {
  FilterValue,
  SorterResult,
  TableCurrentDataSource,
} from 'antd/lib/table/interface';
import { isFunction, template } from 'lodash';
import { useCallback, useEffect, useState } from 'react';
import { globalConfig } from '../../config-provider';
import { RhTableProps } from '../types';

export type DataSourceType = {
  queryRef: any;

  actionRef: any;
  /**
   * 同 ProTable request
   */
  request?: ProTableProps<any, any>['request'];
} & Pick<
  RhTableProps<any, any, any>,
  'api' | 'apiParams' | 'apiMethod' | 'resetPageInParams' | 'params'
>;

const loadingDelayTime = 300; // loading 延迟显示
const debounceWaitTime = 200; // 防抖200ms

let pageSizeField = 'limit';
let currentField = 'page';

const { getGlobalTableRequest } = globalConfig();

function useDataSource(
  {
    api,
    apiParams,
    params,
    queryRef,
    actionRef,
    resetPageInParams,
    apiMethod = 'GET',
    request,
  }: DataSourceType,
  deps: any[],
) {
  const [loadingDelay, setLoadingDelay] = useState<number>(0);
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});
  const [pageInfo, setPageInfo] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
  });

  useEffect(() => {
    // 全局配置
    const tableRequestConfig = getGlobalTableRequest();
    const pageInfoConfig = tableRequestConfig.pageInfoConfig;
    pageSizeField = pageInfoConfig.pageSizeField;
    currentField = pageInfoConfig.currentField;
    // fix: loadingDelay 在首次请求也会延迟loading问题
    setTimeout(() => {
      setLoadingDelay(loadingDelayTime);
    }, 200);
  }, []);
  /**
   * 外部自定义请求，兼容 request 和 api 两种模式
   */
  const handleRequest = useCallback(async () => {
    if (resetPageInParams) {
      queryRef.current?.clearQueryParams();
    }
    const queryParams = queryRef.current?.getQueryParams();

    if (actionRef?.current) {
      actionRef.current.pageInfo.params = queryParams;
    }

    const { current, pageSize } = pageInfo;

    const finalParams = Object.assign(
      {},
      {
        [currentField]: current,
        [pageSizeField]: pageSize,
      },
      queryParams,
      params ?? {},
    );
    let resp: any = null;
    if (isFunction(request)) {
      // 外部request自定义请求
      resp = await request?.(finalParams, sort, filters);
    } else {
      // api 配置自动处理请求
      const realApi = template(api)(apiParams ?? {});
      const extraConfig: Record<string, any> = {};
      if (apiMethod?.toUpperCase() === 'GET') {
        extraConfig.query = finalParams;
      } else {
        extraConfig.data = finalParams;
      }
      // console.log('resp=', realApi, apiMethod, extraConfig, httpClient);
      try {
        resp = await httpClient.request({
          path: realApi,
          method: apiMethod,
          ...extraConfig,
        });
      } catch (err) {
        console.error('useDataSource err=', err);
      }
    }

    // TODO: 配置化，不同的后端团队规范不一致
    const total = resp?.total ?? Number(resp?.totalSize);
    return {
      ...resp,
      success: true,
      total,
      totalPages: Number(resp?.totalPages) || 0,
    };
  }, [
    api,
    apiParams,
    apiMethod,
    queryRef,
    actionRef,
    params,
    request,
    resetPageInParams,
    sort,
    filters,
    pageInfo,
  ]);

  const reqOptions: Record<string, any> = {
    debounceWait: debounceWaitTime,
    refreshOnWindowFocus: false,
  };
  if (loadingDelay > 0) {
    // 300ms内请求结束不显示loading
    reqOptions.loadingDelay = loadingDelay;
  }
  const { loading, data } = useRequest(handleRequest, {
    ...reqOptions,
    refreshDeps: [...deps, params, sort, filters],
  });

  const onChange = useCallback(
    (
      pagination: TablePaginationConfig,
      filters: Record<string, FilterValue | null>,
      sorter: SorterResult<any> | SorterResult<any>[],
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      extra: TableCurrentDataSource<any>,
    ) => {
      setSort(sorter);
      setFilters(filters);
      setPageInfo({
        current: pagination.current ?? 1,
        pageSize: pagination.pageSize ?? 10,
      });
    },
    [],
  );

  return { onChange, loading, data };
}

export default useDataSource;
