import { Button, Drawer, message, Space, Spin, Tabs } from 'antd';
import { forwardRef, useEffect, useImperativeHandle, useState } from 'react';
import CodeEditor from './CodeEditor';

export type CodeFile = {
  /**
   * 代码字符串
   */
  code?: string;
  /**
   * 支持显示代码 raw 地址，可以快速展示，不需要构建工具生成方案和省去代码字符串文件的麻烦
   */
  codeLink?: string;
  /**
   * 文件名，带后缀
   */
  name?: string;
  /**
   * 高亮代码语言
   */
  language?: string;
};

function CodeDrawer({ fileList = [] }: { fileList: CodeFile[] }, ref: any) {
  const [codeList, setCodeList] = useState<CodeFile[]>([]);
  const [loading, setLoading] = useState(false);
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
    setCodeList(pureCodeList);
    if (pList.length > 0) {
      setLoading(true);
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
        })
        .finally(() => {
          setLoading(false);
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
        <Spin spinning={loading} tip="加载代码…">
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
        </Spin>
      </Drawer>
    </div>
  );
}

export default forwardRef(CodeDrawer);
