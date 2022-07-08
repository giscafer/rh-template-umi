import { Button } from 'antd';
import { useState } from 'react';
import { RhDynamicTabTable } from '../table';
import RhDynamicTableModal from '../table/modal';
import demoSchema from './table-modal.json';

const channelList = [
  {
    label: 'Channel1',
    value: 'Channel1',
  },
  {
    label: 'Channel2',
    value: 'Channel2',
  },
  {
    label: 'Channel3',
    value: 'Channel3',
  },
  {
    label: 'Channel4',
    value: 'Channel4',
  },
];

function DemoRhDynamicTableModal() {
  const [visible, setVisible] = useState(false);
  return (
    <div>
      <Button
        type="primary"
        ghost
        onClick={() => {
          setVisible(!visible);
        }}
      >
        动态复杂table modal
      </Button>
      <RhDynamicTableModal
        visible={visible}
        schema={demoSchema}
        onClose={() => {
          setVisible(false);
        }}
        params={{ datasourceId: 'focas_4' }}
        data={{ tabList: channelList }}
      />
      <h3 className="mt2">动态表单table ↓</h3>
      {demoSchema?.type === 'table-modal' && (
        <RhDynamicTabTable
          schema={demoSchema.body}
          data={{ tabList: channelList }}
        />
      )}
    </div>
  );
}

export default DemoRhDynamicTableModal;
