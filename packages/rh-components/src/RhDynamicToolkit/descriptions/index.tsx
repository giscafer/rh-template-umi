import {
  ProCard,
  ProCardProps,
  ProDescriptions,
  ProDescriptionsProps,
} from '@ant-design/pro-components';
import httpClient from '@roothub/helper/http/index';
import { useRequest } from 'ahooks';
import { isArray, isFunction, isString, noop, omit, template } from 'lodash';
import React, { useCallback, useMemo } from 'react';
import genOptionColumn from '../../common/option-column';
import RhTitle from '../../RhTitle';
import { CommonApiType, RhActionMeta } from '../../types';
import { convertDataIndex } from '../../utils';

export type RhDescriptionsProps = {
  /**
   * 标题是否显示border，用RhTitle
   */
  title?: string | React.ReactNode;
  /**
   * 标题是否显示border，用RhTitle
   */
  borderTitle?: boolean;
  /**
   * 数据源
   */
  dataSource?: Record<string, any>;
  /**
   * 操作按钮配置
   */
  optionActions?: RhActionMeta[];
  /**
   * 展示类型 default、card
   * @default 'default'
   */
  type?: string;
  cardProps?: ProCardProps;
  /**
   * 按钮回调
   */
  handleClick?: (...args: any[]) => void;
} & CommonApiType &
  Omit<ProDescriptionsProps, 'title'>;

export type RhDescriptionsMeta = {
  schema: RhDescriptionsProps;
  className?: string;
  cardProps?: ProCardProps;
  children?: React.ReactNode | Element;
};

const RhDescriptions = (props: RhDescriptionsMeta) => {
  const mergeProps = Object.assign(
    {},
    omit(props, 'schema'),
    props.schema ?? {},
  );
  const {
    api,
    apiMethod,
    apiParams,
    dataSource,
    params,
    columns,
    optionActions,
    borderTitle = true,
    type = 'default',
    cardProps = {},
    handleClick = noop,
    ...restProps
  } = mergeProps;

  const titleNode =
    borderTitle && isString(restProps.title) ? (
      <RhTitle title={restProps.title} />
    ) : (
      restProps.title
    );

  const finalColumns = useMemo(() => {
    if (!columns) {
      return [];
    }
    const cList = columns.map((c: any) => ({
      ...c,
      key: isArray(c.dataIndex) ? c.dataIndex.join(',') : c.dataIndex,
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
  }, [api, apiParams, apiMethod, params, dataSource, restProps.request]);

  const { loading, data } = useRequest(handleRequest, {
    debounceWait: 300,
    refreshOnWindowFocus: false,
    refreshDeps: [params],
  });

  const descriptionNode = (
    <ProDescriptions
      title={type === 'default' ? titleNode : null}
      bordered={restProps.bordered ?? false}
      loading={loading}
      dataSource={data}
      formProps={{
        onValuesChange: (e, f) => console.log(f),
      }}
      editable={restProps.editable || undefined}
      columns={finalColumns}
      className={type !== 'card' ? restProps.className : ''}
    >
      {restProps.children}
    </ProDescriptions>
  );
  if (type === 'card') {
    return (
      <ProCard title={titleNode} className={restProps.className} {...cardProps}>
        {descriptionNode}
      </ProCard>
    );
  }
  return descriptionNode;
};

export default RhDescriptions;
