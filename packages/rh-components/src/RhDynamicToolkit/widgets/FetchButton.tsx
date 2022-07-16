/**
 * @author houbin.lao
 * @homepage
 * @created 2022-06-01 11:16:29
 * @description 封装自带请求行为动作的按钮
 */

import { httpPost } from '@roothub/helper/http';
import { Button } from 'antd';
import { useCallback, useEffect, useState } from 'react';

let timer = null;
const intervalTime = 5000;
// params 接口请求参数
function FetchButton({
  title,
  dataIndex,
  params = { url: '', data: {} },
  feedback = { success: '', error: '' },
}) {
  const [loading, setLoading] = useState(false);
  const [showFeedback, setShowFeedback] = useState('');

  const showFeedBackHandler = useCallback(
    (isSuccess) => {
      if (feedback.success || feedback.error) {
        setShowFeedback(isSuccess ? 'success' : 'error');
        if (!timer) {
          timer = setTimeout(() => {
            setShowFeedback('');
            timer = null;
          }, intervalTime);
        }
      }
    },
    [feedback.error, feedback.success],
  );

  useEffect(() => {
    return () => {
      if (timer) {
        clearTimeout(timer);
        timer = null;
      }
    };
  }, []);

  const handleClick = useCallback(() => {
    if (!params.url) {
      console.error(`${dataIndex}字段没有配置params.url`);
      return;
    }
    setLoading(true);
    setShowFeedback('');
    httpPost(params.url, params.data)
      .then(() => {
        setLoading(false);
        showFeedBackHandler(true);
      })
      .catch(() => {
        setLoading(false);
        showFeedBackHandler(false);
      });
  }, [params.url, params.data, dataIndex, showFeedBackHandler]);

  return (
    <div className="ant-row ant-form-item m-0">
      <div style={{ paddingTop: '14px' }}>
        <Button loading={loading} onClick={handleClick} className="mr-10">
          {title}
        </Button>
        {feedback?.success && showFeedback === 'success' && (
          <span className="color-primary">{feedback.success}</span>
        )}
        {feedback?.error && showFeedback === 'error' && (
          <span className="red">{feedback.error}</span>
        )}
      </div>
    </div>
  );
}

export default FetchButton;
