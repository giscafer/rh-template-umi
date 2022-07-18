import { githubUrl } from '@/config/constant';
import { PageContainer } from '@ant-design/pro-layout';
import { CodeDrawer } from '@roothub/code-editor';
import { RhDynamicFormGroup } from '@roothub/components';
import { Button } from 'antd';
import { FC, useRef } from 'react';
import formSchema from '../form.json';

const BasicForm: FC<Record<string, any>> = () => {
  const codeRef = useRef<any>(null);

  return (
    <PageContainer
      fixedHeader
      header={{
        title: '单页表单',
        breadcrumb: {},
        onBack: () => window.history.back(),
        extra: [
          <Button
            key="code"
            ghost
            type="primary"
            onClick={() => {
              codeRef.current?.showDrawer();
            }}
          >
            查看配置代码
          </Button>,
        ],
      }}
    >
      <RhDynamicFormGroup schema={formSchema.body} groupProps={{ width: 600 }} />
      <CodeDrawer
        ref={codeRef}
        fileList={[
          {
            name: 'form.json',
            language: 'json',
            code: JSON.stringify(formSchema, null, 4),
          },
          {
            name: 'index.tsx',
            language: 'javascript',
            codeLink: githubUrl + '/pages/dynamic/page-form/index.tsx',
          },
        ]}
      />
    </PageContainer>
  );
};

export default BasicForm;
