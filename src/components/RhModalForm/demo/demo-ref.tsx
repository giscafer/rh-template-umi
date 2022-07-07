import RhModalForm from '..';
import { useRef } from 'react';
import type { ModalPropType } from '..';
import { message } from 'antd';
import { ProFormText } from '@ant-design/pro-form';

function Demo() {
  const rhModalRef = useRef<any>();

  const ModalProps: ModalPropType = {
    text: '新建',
    // asyncInitialValues: currentRow,
    onFinish: async (values) => {
      console.log(values);
      return new Promise((resolve) => {
        setTimeout(() => {
          message.success('创建成功');
          resolve(true);
        }, 1000);
      });
    },
  };
  return (
    <div>
      <RhModalForm ref={rhModalRef} {...ModalProps} title="新建">
        <ProFormText name="name" label="名称" />
        <ProFormText name="age" label="年龄" />
      </RhModalForm>
    </div>
  );
}

export default Demo;
