import { PageContainer } from '@ant-design/pro-components';
import { CodeDrawer } from '@roothub/code-editor';
import { RhTable } from '@roothub/components';
import { Button } from 'antd';
import { useRef } from 'react';
import { githubUrl } from '../../../config/constant';
import demoSchema from './table.json';

function DemoRhDynamicTableModal() {
  const codeRef = useRef<any>(null);
  return (
    <PageContainer
      fixedHeader
      header={{
        title: 'Json动态表格渲染Demo',
        subTitle: 'RhTable 和配置化开发类似，只是meta属性完全换成json',
        breadcrumb: {},
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
      <p className="f2">
        只需要简单的一行代码： &lt;RhTable meta={'{'}demoSchema.body{'}'} /&gt;
      </p>
      {demoSchema?.type === 'table' && <RhTable meta={demoSchema.body} />}
      <CodeDrawer
        ref={codeRef}
        fileList={[
          {
            name: 'table.json',
            language: 'json',
            code: JSON.stringify(demoSchema, null, 4),
          },
          {
            name: 'index.tsx',
            language: 'javascript',
            codeLink: githubUrl + '/pages/dynamic/table/index.tsx',
          },
        ]}
      />
    </PageContainer>
  );
}

export default DemoRhDynamicTableModal;
