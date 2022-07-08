import { Space } from 'antd';
import React, { useState } from 'react';
import RhEditableTagGroup from '..';

export default (): React.ReactNode => {
  const [tags, setTags] = useState<string[]>([]);

  return (
    <div>
      <Space direction="vertical">
        <RhEditableTagGroup
          value={tags}
          onChange={setTags}
          disabled
          showButton={true}
        />
      </Space>
    </div>
  );
};
