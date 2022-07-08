/*
 * @Description: 文件导入弹窗
 */

import { ModalForm, ProFormUploadButton } from '@ant-design/pro-form';
import { Form } from 'antd';
import React from 'react';

const RhFileImportModal: React.FC<{
  visible?: boolean;
  title?: string;
  width?: number;
  downloadUrl?: string;
  onCancel?: () => void;
  onOk?: () => void;
  onFinish?: (formData: any) => Promise<boolean | void>;
}> = ({
  visible = false,
  title = '',
  width = 600,
  downloadUrl = '',
  onCancel = () => {
    // This is intentional
  },
  onOk = () => {
    // This is intentional
  },
  onFinish = () => Promise.resolve(),
}) => {
  return (
    <ModalForm
      title={title}
      visible={visible}
      width={width}
      modalProps={{
        maskClosable: false,
        onCancel,
        onOk,
      }}
      onFinish={onFinish}
    >
      <Form.Item>
        <a href={downloadUrl} target="_blank" rel="noopener noreferrer">
          点击下载模板
        </a>
      </Form.Item>
      <ProFormUploadButton
        accept=".xlsx,.xls"
        label=""
        name="file"
        title="上传文件"
        max={1}
        rules={[{ required: true, message: '请选择文件' }]}
        fieldProps={{
          beforeUpload: () => false,
        }}
      />
      <p className="ant-form-item-extra">
        请按照模板格式进行录入，支持xlsx格式
      </p>
    </ModalForm>
  );
};

export default RhFileImportModal;
