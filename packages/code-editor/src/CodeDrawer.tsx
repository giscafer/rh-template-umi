import { Button, Drawer, message, Space, Tabs } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import CodeEditor from './CodeEditor';

export type CodeFile = {
  code?: string;
  codeLink?: string;
  name?: string;
  language?: string;
};

function CodeDrawer({ fileList = [] }: { fileList: CodeFile[] }, ref: any) {
  const [codeList, setCodeList] = useState<CodeFile[]>([]);
  const [visible, setVisible] = useState(false);
  const showDrawer = () => {
    setVisible(true);
  };

  const hideDrawer = () => {
    setVisible(false);
  };

  useImperativeHandle(ref, () => ({
    showDrawer,
    hideDrawer,
  }));

  useEffect(() => {
    const pList = [];
    const idxArr: number[] = [];
    const pureCodeList: CodeFile[] = [];
    for (let i = 0; i < fileList.length; i++) {
      const { codeLink = '' } = fileList[i];

      if (/^http/.test(codeLink)) {
        const p = fetch(codeLink).then((resp) => resp.text());
        idxArr.push(i);
        pList.push(p);
      } else {
        pureCodeList.push(fileList[i]);
      }
    }
    if (pList.length > 0) {
      Promise.all(pList)
        .then((result) => {
          const list: CodeFile[] = result.map((code, index) => {
            return {
              ...fileList[idxArr[index]],
              code,
            };
          });
          setCodeList(list.concat(pureCodeList));
        })
        .catch((err) => {
          console.log(err);
          message.error(`无法访问资源：${err}`);
        });
    }
  }, [fileList]);

  return (
    <div>
      <Drawer
        title="代码"
        placement={'right'}
        width={800}
        onClose={hideDrawer}
        visible={visible}
        extra={
          <Space>
            <Button onClick={hideDrawer}>关闭</Button>
          </Space>
        }
      >
        <Tabs type="card">
          {codeList?.map((item: CodeFile) => {
            const { name = '代码', code, language } = item;

            return (
              <Tabs.TabPane tab={name} key={name}>
                <CodeEditor code={code || ''} language={language} />
              </Tabs.TabPane>
            );
          })}
        </Tabs>
      </Drawer>
    </div>
  );
}

export default forwardRef(CodeDrawer);
