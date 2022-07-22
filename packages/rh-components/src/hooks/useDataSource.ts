/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-22 19:49:45
 * @description 通用请求
 */

import httpClient from '@roothub/helper/http';
import { useRequest } from 'ahooks';
import { template, uniqueId } from 'lodash';
import { useCallback } from 'react';

export type DataSourceRequestType = {
  api?: string;
  params?: any;
  deps?: any[]; // 之前 useSWR 遗留的传参，改造之后没用上，待观察
  apiMethod?: string;
  apiParams?: Record<string, any>;
};

export default function useDataSource<T>({
  api,
  params,
  apiParams,
  apiMethod = 'GET',
}: DataSourceRequestType) {
  const handleRequest = useCallback(async () => {
    let resp: any = null;
    const queryParams = params ?? {};

    const path = template(api)(apiParams ?? {}); // 新写法 ${}

    const extraConfig: Record<string, any> = {
      headers: {
        'x-request-id': uniqueId('use_datasource_'),
      },
    };

    if (apiMethod?.toUpperCase() === 'GET') {
      extraConfig.query = queryParams;
    } else {
      extraConfig.data = queryParams;
    }

    if (!api) {
      return { error: 'api不能为空' };
    }

    resp = await httpClient.request({
      path,
      method: apiMethod,
      ...extraConfig,
    });

    return resp?.data;
  }, [params, api, apiParams, apiMethod]);

  const resp = useRequest<T, any[]>(handleRequest, {
    debounceWait: 300,
    refreshOnWindowFocus: false,
    retryCount: 3,
    refreshDeps: [JSON.stringify(params)],
  });

  return { ...resp, isValidating: resp.loading };
}
