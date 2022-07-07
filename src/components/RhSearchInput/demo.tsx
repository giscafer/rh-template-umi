import RhSearchInput from '.';
import React from 'react';
import { message } from 'antd';

function Demo() {
  return (
    <div style={{ width: 300 }}>
      <RhSearchInput
        size="small"
        suffix={null}
        onSearch={(v) => {
          console.log(v);
          message.info('查询' + v);
        }}
      />
      <br />
      <br />
      <br />
      <RhSearchInput
        size="large"
        onSearch={(v) => {
          console.log(v);
          message.info('查询' + v);
        }}
      />
      <br />
      <br />
      <br />
      <RhSearchInput
        bordered={false}
        size="large"
        placeholder="无边框展示"
        onSearch={(v) => {
          console.log(v);
          message.info('查询' + v);
        }}
      />
    </div>
  );
}

export default Demo;
