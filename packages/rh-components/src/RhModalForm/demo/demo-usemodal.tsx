import { ProFormText } from '@ant-design/pro-form';
import { Button, message } from 'antd';
import { useModalForm } from '..';

function Demo() {
  const { RhModalForm, modal } = useModalForm();

  return (
    <div>
      <Button
        type="primary"
        onClick={() => {
          modal.show();
        }}
      >
        测试
      </Button>
      <RhModalForm
        title="useModal"
        trigger={undefined}
        onFinish={async (values: any) => {
          console.log(values);
          return new Promise((resolve) => {
            setTimeout(() => {
              message.success('创建成功');
              resolve(true);
            }, 1000);
          });
        }}
      >
        <ProFormText name="name" label="名称" />
        <ProFormText name="age" label="年龄" />
      </RhModalForm>
    </div>
  );
}

export default Demo;
