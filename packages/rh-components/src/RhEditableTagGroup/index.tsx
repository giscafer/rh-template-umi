/*
 * @Author: mingxing.zhong
 * @Date: 2021-08-30 13:52:15
 * @Description: 用数组生成一组标签，可以动态添加和删除。
 */

import { PlusOutlined } from '@ant-design/icons';
import { Input, Row, Tag, Tooltip } from 'antd';
import type { ChangeEvent } from 'react';
import React, { useCallback, useRef, useState } from 'react';

type EditableTagGroupProps = {
  value?: string[]; // 标签数组
  disabled?: boolean; // 是否禁用
  showButton?: boolean; // disabled 为 true时，是否显示按钮
  maxLength?: number; // 最多标签数量
  InputMaxLength?: number; // 输入框最大长度
  displayMaxLength?: number; // 单个标签展示最大长度，超出显示省略号
  onChange?: (value: string[]) => void; // 标签改变回调
};

const EditableTagGroup: React.FC<EditableTagGroupProps> = ({
  value = [],
  disabled = false,
  showButton = false,
  maxLength = Infinity,
  InputMaxLength = Infinity,
  displayMaxLength = 20,
  onChange = () => {},
}) => {
  const inputRef = useRef<Input>(null);
  const [inputVisible, setInputVisible] = useState(false);
  const [inputValue, setInputValue] = useState('');

  /**
   * 标签删除回调
   * @param removedTag 要删除的标签
   */
  const handleClose = useCallback(
    (removedTag: string) => {
      const newValue = value.filter((tag) => tag !== removedTag) || [];
      onChange(newValue);
    },
    [onChange, value],
  );

  /**
   * 显示输入框
   */
  const showInput = useCallback(() => {
    setInputVisible(true);
    setTimeout(() => inputRef.current?.focus());
  }, []);

  /**
   * 输入框值改变回调
   * @param e 输入事件
   */
  const handleInputChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    setInputValue(e.target.value);
  }, []);

  /**
   * 输入框确认回调
   */
  const handleInputConfirm = useCallback(() => {
    if (inputValue && !value.includes(inputValue)) {
      onChange([...(value || []), inputValue]);
    }

    setInputVisible(false);
    setInputValue('');
  }, [inputValue, onChange, value]);

  return (
    <>
      {value.map((tag) => (
        <Tooltip title={tag} key={tag}>
          <Tag key={tag} closable={!disabled} onClose={() => handleClose(tag)}>
            {tag.length > displayMaxLength
              ? `${tag.slice(0, displayMaxLength)}...`
              : tag}
          </Tag>
        </Tooltip>
      ))}
      {inputVisible && (
        <Input
          ref={inputRef}
          size="small"
          style={{ width: 80 }}
          maxLength={InputMaxLength}
          value={inputValue}
          onChange={handleInputChange}
          onBlur={handleInputConfirm}
          onPressEnter={handleInputConfirm}
        />
      )}
      {!disabled && !inputVisible && value.length < maxLength && (
        <Tag
          onClick={showInput}
          style={{
            background: '#ffffff',
            borderStyle: 'dashed',
            cursor: 'pointer',
          }}
        >
          <Row align="middle">
            <PlusOutlined style={{ marginRight: 2 }} />
            <span>添加</span>
          </Row>
        </Tag>
      )}
      {disabled && showButton && value?.length === 0 && (
        <Tag
          style={{
            background: '#f5f5f5',
            borderStyle: 'dashed',
            cursor: 'not-allowed',
          }}
        >
          <Row align="middle">
            <PlusOutlined style={{ marginRight: 2 }} />
            <span>添加</span>
          </Row>
        </Tag>
      )}
    </>
  );
};

export default EditableTagGroup;
