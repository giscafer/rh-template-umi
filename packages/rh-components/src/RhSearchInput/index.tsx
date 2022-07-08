import { SearchOutlined } from '@ant-design/icons';
import { useDebounceFn } from '@ant-design/pro-utils';
import { Input } from 'antd';
import React, { forwardRef, useImperativeHandle, useState } from 'react';
import './index.less';

export type RhSearchInputProps = {
  /**
   * 是否显示border
   */
  bordered?: boolean;
  /**
   * 输入提示
   */
  defaultValue?: string;
  /**
   * 输入提示
   */
  placeholder?: string;
  /**
   * 防抖延迟时间（ms)
   * @default 200
   */
  delayTime?: number;
  /**
   * 样式
   */
  className?: string;
  /**
   * 搜索回调，已设置防抖200ms（仅回车和图标点击触发）
   */
  onSearch?: (v: string) => void;
  /**
   * change回调，已设置防抖200ms，文字变化即触发
   */
  onChange?: (v: string) => void;
  [key: string]: any;
  isExtend?: boolean;
};

function RhSearchInput(
  {
    placeholder = '请输入',
    bordered = true,
    delayTime = 200,
    className = '',
    defaultValue,
    onSearch = () => {
      // This is intentional
    },
    onChange,
    isExtend = false,
    ...restProps
  }: RhSearchInputProps,
  ref: React.Ref<any>,
) {
  const [value, setValue] = useState<string>(defaultValue);

  const { run: onSearchRun } = useDebounceFn(async () => {
    onSearch(value);
  }, delayTime);

  const { run: onChangeRun } = useDebounceFn(async () => {
    if (typeof onChange === 'function') {
      onChange(value);
    }
    // 如果是清除输入框，并且没有绑定change时，主动触发search回调
    if (value === '' && !onChange) {
      onSearch(value);
    }
    // 兼容交互调整
    if (value === '' && isExtend) {
      onSearch(value);
    }
  }, delayTime);

  /**
   * 暴露value
   */
  useImperativeHandle(ref, () => {
    return {
      value,
      setValue,
    };
  });

  return (
    <Input
      allowClear
      value={value}
      placeholder={placeholder}
      bordered={bordered}
      className={`rh-search-input ${className}`}
      onChange={(e) => {
        const v = e.target?.value;
        setValue(v);
        onChangeRun();
      }}
      onKeyPress={(e: React.KeyboardEvent<HTMLInputElement>) => {
        // Dropdown 下拉面板的回车键触发失效，bug，原因未知
        if (e.key === 'Enter') {
          onSearchRun();
        }
      }}
      {...restProps}
      suffix={
        restProps?.suffix || restProps?.suffix === null ? (
          restProps?.suffix
        ) : (
          <SearchOutlined
            onClick={() => {
              onSearchRun();
            }}
            style={{ cursor: 'pointer', fontSize: 22, color: '#9EA5B2' }}
          />
        )
      }
    />
  );
}

export default forwardRef(RhSearchInput);
