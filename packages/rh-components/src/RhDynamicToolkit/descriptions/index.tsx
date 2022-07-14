import {
  ProDescriptions,
  ProDescriptionsProps,
} from '@ant-design/pro-components';
import httpClient from '@roothub/helper/src/http';
import { useRequest } from 'ahooks';
import { isFunction, noop, template } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import genOptionColumn from '../../common/option-column';
import { CommonApiType, RhActionMeta } from '../../types';
import { convertDataIndex } from '../../utils';

export type RhDescriptionsProps = {
  /**
   * 数据源
   */
  dataSource?: Record<string, any>;
  /**
   * 操作按钮配置
   */
  optionActions?: RhActionMeta[];
  /**
   * 按钮回调
   */
  handleClick?: (...args: any[]) => void;
} & CommonApiType &
  ProDescriptionsProps;

export type RhDescriptionsMeta = {
  schema: RhDescriptionsProps;
  children?: React.ReactNode | Element;
};

const RhDescriptions = (props: RhDescriptionsMeta) => {
  const {
    api,
    apiMethod,
    apiParams,
    dataSource,
    params,
    columns,
    optionActions,
    handleClick = noop,
    ...restProps
  } = props?.schema || {};

  const finalColumns = useMemo(() => {
    if (!columns) {
      return [];
    }
    const cList = columns.map((c: any) => ({
      ...c,
      dataIndex: convertDataIndex(c.dataIndex),
    }));
    if (!optionActions?.length) {
      return cList;
    }
    const optionColumn = genOptionColumn(optionActions, handleClick);
    return cList.concat(optionColumn);
  }, [columns, optionActions]);

  /**
   * 外部自定义请求，兼容 request 和 api 两种模式
   */
  const handleRequest = useCallback(async () => {
    let resp: any = null;
    const queryParams = params ?? {};
    if (isFunction(restProps.request)) {
      // 外部request自定义请求
      resp = await restProps.request(queryParams);
    } else {
      if (dataSource) {
        return dataSource;
      }
      // api 配置自动处理请求
      const realApi = template(api)(apiParams ?? {});
      const extraConfig: Record<string, any> = {};
      if (apiMethod?.toUpperCase() === 'GET') {
        extraConfig.query = queryParams;
      } else {
        extraConfig.data = queryParams;
      }

      resp = await httpClient.request({
        path: realApi,
        method: apiMethod,
        ...extraConfig,
      });
    }

    return resp?.data;
  }, [api, apiParams, apiMethod, params, restProps.request]);

  const { loading, data } = useRequest(handleRequest, {
    debounceWait: 300,
    refreshOnWindowFocus: false,
    refreshDeps: [params],
  });

  return (
    <ProDescriptions
      bordered={restProps.bordered ?? false}
      title={restProps.title}
      loading={loading}
      dataSource={data}
      formProps={{
        onValuesChange: (e, f) => console.log(f),
      }}
      editable={restProps.editable || undefined}
      columns={finalColumns}
    >
      {restProps.children}
    </ProDescriptions>
  );
};

export default RhDescriptions;
