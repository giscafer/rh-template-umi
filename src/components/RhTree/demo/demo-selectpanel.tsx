/**
 * @author houbin.lao
 * @homepage
 * @created 2022-06-02 14:59:16
 * @description 下拉面板树选择，基于RhTree
 */

import { DownOutlined } from '@ant-design/icons';
import { ProFieldRequestData } from '@ant-design/pro-utils';
import RhSearchInput from '@/components/RhSearchInput';
import RhTree from '@/components/RhTree';
import { ILeafNode } from '@/components/RhTree/type';
import { searchByNodeName } from '@/components/RhTree/utils';
import { useRequest, useUpdateEffect } from 'ahooks';
import { Button, Dropdown, Input, Row, Space, Spin } from 'antd';
import { useCallback, useMemo, useState } from 'react';

const RhTreePanelSelect: React.FC<{
  id: string; // 用于标识唯一性
  value?: string;
  placeholder?: string;
  width?: string;
  disabled?: boolean;
  treeData?: ILeafNode[];
  request?: ProFieldRequestData;
  trigger?: JSX.Element;
  onChange?: (value: any) => void;
  onSelect?: (value: any) => unknown;
}> = ({
  id,
  value = '',
  trigger,
  treeData,
  request,
  placeholder = '请选择',
  disabled = false,
  onChange = (v: string) => {},
  onSelect = () => {},
  ...resProps
}) => {
  const [visible, setVisible] = useState(false);
  const [treeSearchKey, setTreeSearchKey] = useState<string>('');
  const [selectedValue, setSelectedValue] = useState('');
  const [selectedNode, setSelectedNode] = useState<ILeafNode>(null);
  const [label, setLabel] = useState('');

  const getList = useCallback(async () => {
    if (request) {
      const list = await request();
      return list;
    } else {
      return treeData;
    }
  }, [request, treeData]);

  const { data, loading } = useRequest(getList, {
    cacheKey: id || 'tree-panel-select',
    refreshDeps: [id, request, treeData],
  });

  useUpdateEffect(() => {
    if (value && data) {
      const node = data.find((item) => item.id === value);
      setSelectedValue(value);
      setSelectedNode(node);
      setLabel(node?.name || '');
    }
  }, [value, data]);

  const onConfirm = useCallback(() => {
    setVisible(false);
    if (selectedNode) {
      setLabel(selectedNode.name);
    }
    onChange(selectedValue);
  }, [onChange, selectedNode, selectedValue]);

  // 前端搜索过滤
  const searchData = useMemo(() => {
    return searchByNodeName(data, treeSearchKey);
  }, [treeSearchKey, data]);

  const menu = (
    <div
      className="ant-modal-content"
      style={{ padding: 24, width: 400 }}
      onKeyDown={(e) => {
        if (e.key === 'Enter') {
          e.preventDefault();
        }
      }}
    >
      <div style={{ margin: '10px 0' }}>
        <RhSearchInput
          bordered
          placeholder="输入名称搜索"
          onChange={(v) => {
            setTreeSearchKey(v);
          }}
        />
      </div>
      <Spin spinning={loading}>
        <RhTree
          showIcon
          showLine={false}
          height={300}
          defaultExpandAll={true}
          highlightText={treeSearchKey}
          list={searchData as any}
          switcherIcon={<DownOutlined />}
          className="rh-tree-select-panel"
          onClick={(node) => {
            if (!node.selected) {
              const len = node?.children?.length;
              setSelectedNode(len > 0 ? null : node);
              setSelectedValue(len > 0 ? '' : node.id);
            } else {
              setSelectedNode(null);
              setSelectedValue('');
            }
          }}
        />
      </Spin>
      <Row justify="end" style={{ marginTop: 24 }}>
        <Space>
          <Button onClick={() => setVisible(false)}>取消</Button>{' '}
          <Button type="primary" disabled={!selectedValue} onClick={onConfirm}>
            确定
          </Button>
        </Space>
      </Row>
    </div>
  );
  return (
    <Dropdown trigger={['click']} visible={visible} overlay={menu} onVisibleChange={setVisible} disabled={disabled}>
      {trigger || (
        <Input readOnly value={label} style={{ width: resProps.width || '100%' }} placeholder={placeholder} />
      )}
    </Dropdown>
  );
};
export default RhTreePanelSelect;
