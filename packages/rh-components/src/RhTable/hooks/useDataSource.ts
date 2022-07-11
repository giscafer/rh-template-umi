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
import { useCallback, useState } from 'react';
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

function useDataSource(
  {
    api,
    apiMethod = 'GET',
    apiParams,
    params,
    queryRef,
    actionRef,
    resetPageInParams,
    request,
  }: DataSourceType,
  deps: any[],
) {
  const [filters, setFilters] = useState({});
  const [sort, setSort] = useState({});
  const [pageInfo, setPageInfo] = useState<PaginationProps>({
    current: 1,
    pageSize: 10,
  });
  /**
   * 外部自定义请求，为了
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
        page: current,
        pageSize,
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

      resp = httpClient.request({
        path: realApi,
        apiMethod,
        ...extraConfig,
      });
    }
    // console.log('resp=', resp);

    // TODO: 配置化，不同的后端团队规范不一致
    const total = resp.total ?? Number(resp.totalSize);
    return {
      ...resp,
      success: true,
      total,
      totalPages: Number(resp.totalPages) || 0,
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

  const { loading, data } = useRequest(handleRequest, {
    loadingDelay: 300, // 300ms内请求结束不显示loading
    debounceWait: 200, // 防抖200ms
    refreshOnWindowFocus: false,
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
