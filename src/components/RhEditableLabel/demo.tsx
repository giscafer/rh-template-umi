import { Divider } from 'antd';
import { useState } from 'react';
import RhEditableLabel from '.';

function Demo() {
  const [value, setValue] = useState('LeekHub');
  const [value1, setValue1] = useState('开启权限控制，有权限，权限类型为隐藏');
  const [value2, setValue2] = useState('开启权限控制，无权限，权限类型为隐藏');
  const [value3, setValue3] = useState('开启权限控制，有权限，权限类型为提示');
  const [value4, setValue4] = useState('开启权限控制，无权限，权限类型为提示');
  return (
    <div>
      <RhEditableLabel
        value={value}
        beforeUpdate={async () => {
          return Promise.resolve(true);
        }}
        onChange={(v) => {
          setValue(v);
        }}
      />
      <Divider />
      <RhEditableLabel
        accessType={'hide'}
        accessible={true}
        value={value1}
        beforeUpdate={async () => {
          return Promise.resolve(true);
        }}
        onChange={(v) => {
          setValue1(v);
        }}
      />
      <Divider />
      <RhEditableLabel
        accessible={false}
        value={value2}
        beforeUpdate={async () => {
          return Promise.resolve(true);
        }}
        onChange={(v) => {
          setValue2(v);
        }}
      />
      <Divider />
      <RhEditableLabel
        accessType={'prompt'}
        accessible={true}
        value={value3}
        beforeUpdate={async () => {
          return Promise.resolve(true);
        }}
        onChange={(v) => {
          setValue3(v);
        }}
      />
      <Divider />
      <RhEditableLabel
        accessType={'prompt'}
        accessible={false}
        value={value4}
        beforeUpdate={async () => {
          return Promise.resolve(true);
        }}
        onChange={(v) => {
          setValue4(v);
        }}
      />
    </div>
  );
}

export default Demo;
