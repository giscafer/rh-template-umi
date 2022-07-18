/**
 * @description: 表格全选操作
 * @param {*} display: 是否显示全选功能
 * @param {*} count: 已选中的数量
 * @param {*} total: 总数
 * @param {*} onSelectAll: 全选操作事件
 * @param {*} displaySelectAll: 是否展示全选按钮
 * @param {*} onCancel: 清空事件
 * @param {*} rightLinkBtn: 可配置右侧按钮模块
 */

import React from 'react';
import './index.less';
export interface TableMulSelectProps {
  display: boolean;
  displaySelectAll?: boolean;
  count?: any;
  total?: number;
  displaySelect?: boolean;
  showTotal?: boolean;
  onSelected?: () => void;
  onSelectAll?: () => void;
  onCancel?: () => void;
  rightLinkBtn?: React.ReactNode;
}

const TableMulSelect: React.FC<TableMulSelectProps> = (props) => {
  const {
    display,
    count,
    total,
    onSelectAll,
    displaySelectAll,
    displaySelect,
    onSelected,
    onCancel,
    rightLinkBtn,
    showTotal = true,
  } = props;
  return (
    <>
      {display && (
        <div className="multi-select-statistic">
          <div className="multi-select-statistic_total">
            {/* 自定义文本 */}
            {displaySelect ? (
              <span>
                已选
                <a onClick={onSelected}>{count}</a>
                {showTotal ? `/${total}` : null}项
              </span>
            ) : showTotal ? (
              `已选${count}/${total}项`
            ) : (
              `已选${count}项`
            )}
            {/* 全选 */}
            {displaySelectAll && (
              <a className="select-all primary-text" onClick={onSelectAll}>
                全选
              </a>
            )}

            {/* 清空 */}
            <a className="cancel primary-text" onClick={onCancel}>
              清空
            </a>
          </div>
          <div className="multi-select-statistic__actions">{rightLinkBtn}</div>
        </div>
      )}
    </>
  );
};

export default TableMulSelect;
