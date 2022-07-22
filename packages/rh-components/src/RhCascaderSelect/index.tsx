import { httpGet } from '@roothub/helper/http';
import list2tree from '@roothub/helper/utils/list2tree';
import { objectToQueryString } from '@roothub/helper/utils/queryString';
import { useRequest } from 'ahooks';
import type { CascaderProps } from 'antd';
import { Cascader } from 'antd';
import { FieldNamesType } from 'antd/lib/cascader';
import type { Key } from 'react';

export type DataNodeType = {
  label: string;
  value: string;
  parentId: Key;
  id: Key;
  children: DataNodeType[];
};

type RhCascaderProps = {
  url: string; // 接口
  value?: Key[]; // 值
  fieldNames?: FieldNamesType; //
  params?: Record<string, any>; // 参数
  disabled?: boolean; // 是否禁用
  onChange?: (value: Key[], selectedOptions: any[]) => void; // 值改变回调
} & Pick<CascaderProps<DataNodeType>, 'size' | 'placeholder'>;

function RhCascaderSelect({
  value,
  url,
  params,
  fieldNames,
  onChange,
  placeholder = '请选择',
  disabled = false,
  size = 'middle',
}: RhCascaderProps) {
  const qryList = () =>
    httpGet(url, params).then((res: { data: { list: any } }) => {
      const { list } = res.data;
      if (list) {
        // TODO： 接口返回结构
        const options = list?.map((option: Record<string, any>) => ({
          label: option[fieldNames?.label || 'name'],
          value: option[fieldNames?.value || 'id'],
          parentId: option.parentId,
          id: option.id,
        }));
        const treeData: any[] = list2tree(options);
        return treeData;
      } else {
        return [];
      }
    });

  const { data, loading } = useRequest(qryList, {
    cacheKey: `${url}-${objectToQueryString(params)}`,
    refreshDeps: [url, params],
  });

  return (
    <Cascader
      loading={loading}
      size={size as any}
      placeholder={placeholder}
      value={value}
      disabled={disabled}
      options={data as any}
      onChange={onChange}
    />
  );
}

export default RhCascaderSelect;
