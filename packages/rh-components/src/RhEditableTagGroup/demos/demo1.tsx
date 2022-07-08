import { Space } from 'antd';
import React, { useState } from 'react';
import RhEditableTagGroup from '..';

export default (): React.ReactNode => {
  const [tags, setTags] = useState<string[]>([
    '@roothub/component',
    '@roothub/cli',
  ]);

  return (
    <div>
      <Space direction="vertical">
        <RhEditableTagGroup value={tags} onChange={setTags} />

        <div>tags: {JSON.stringify(tags)}</div>
      </Space>
    </div>
  );
};
