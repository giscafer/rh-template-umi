import { ProFormText } from '@ant-design/pro-form';
import { message } from 'antd';
import { useRef } from 'react';
import type { RhDrawerProps } from '.';
import RhDrawerForm from '.';

function Demo() {
  // const [currentRow, setCurrentRow] = useState();

  const rhDrawerRef = useRef<any>();

  const DrawerProps: RhDrawerProps = {
    text: '新建自定义参数',
    title: '创建自定义参数',
    // initialValues: currentRow,
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
      <RhDrawerForm ref={rhDrawerRef} {...DrawerProps}>
        <ProFormText name="name" label="名称" />
        <ProFormText name="age" label="年龄" />
      </RhDrawerForm>
    </div>
  );
}

export default Demo;
