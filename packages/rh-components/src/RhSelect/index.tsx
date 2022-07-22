/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-22 19:55:41
 * @description 根据api参数请求获取数据的下拉选择组件
 */

import { ProFormSelect } from '@ant-design/pro-components';
import { FieldProps } from '@ant-design/pro-form/lib/interface';
import { Select } from 'antd';
import { useMemo } from 'react';
import useDataSource from '../hooks/useDataSource';

function RhSelect({
  isFormItem = false,
  fieldProps = {},
  ...restProps
}: {
  isFormItem?: boolean;
  fieldProps?: FieldProps<any>;
  [key: string]: any;
}) {
  const { api, apiParams, params } = restProps;

  const { loading, data } = useDataSource<any[]>({ api, apiParams, params });

  const options: any[] = useMemo(() => {
    // TODO: 修改组件格式
    return (
      data?.map((item: any) => ({ label: item.label, value: item.value })) || []
    );
  }, [data]);

  if (isFormItem) {
    return (
      <ProFormSelect
        fieldProps={{ loading, ...fieldProps }}
        options={options}
        {...restProps}
      />
    );
  }
  return <Select loading={loading} {...restProps} options={options} />;
}

export default RhSelect;
