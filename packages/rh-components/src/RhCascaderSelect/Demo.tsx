import { Space } from 'antd';
import type { Key } from 'react';
import { useState } from 'react';
import RhCascaderSelect from '.';

function Demo() {
  const [value, setValue] = useState<Key[]>([]);
  return (
    <div>
      <Space direction="vertical">
        <RhCascaderSelect value={value} onChange={setValue} url={''} />

        <div>value: {JSON.stringify(value)}</div>
      </Space>
    </div>
  );
}
export default Demo;
