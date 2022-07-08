import { useState } from 'react';
import RhTitle from '.';

function Demo() {
  const [collapse, setCollapse] = useState(false);
  return (
    <div>
      <RhTitle
        title="基础信息"
        fontSize={14}
        showCollapse
        collapse={false}
        onCollapseChange={(v) => {
          setCollapse(v);
        }}
      />
      <span>collapse：{collapse ? 'true' : 'false'}</span>
    </div>
  );
}

export default Demo;
