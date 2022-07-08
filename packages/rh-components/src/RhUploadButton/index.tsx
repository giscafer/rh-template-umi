/**
 * @author giscafer
 * @homepage
 * @created 2022-06-09 16:09:38
 * @description 上传按钮组件，统一样式和接口上传逻辑包装
 */

import { InfoCircleOutlined } from '@ant-design/icons';
import { Button, ButtonProps, Upload } from 'antd';
import { UploadChangeParam } from 'antd/lib/upload';
import { noop } from 'lodash';
import React, { useMemo } from 'react';

export interface UploadProps {
  /** 按钮名称 */
  title?: string;
  /** 发到后台的文件参数名 */
  name?: string;
  /** 上传所需额外参数或返回上传额外参数的方法 */
  data?: any;
  /** 接受上传的文件类型 */
  accept?: any;
  /** 是否显示额外提示信息 */
  showExtraTip?: boolean;
  /** 上传的地址 */
  action: string;
  /**  按钮属性 */
  buttonProps?: ButtonProps;
  /** 文件最大个数 */
  maxCount?: number;
  /** 文件单个最大多少kb，默认10M */
  singleMaxSize?: number;
  /** 文件上传是否多选 */
  multiple?: boolean;
  /** 请求头 */
  headers?: any;
  /** 外部样式 */
  style?: React.CSSProperties;
  /** 其他属性 */
  onRemove?: (file: any) => void;
  onHandleUpload?: (file: any) => void;
  onBeforeUpload?: (file: any) => Promise<boolean>;
}

export const RhUploadButton: React.FC<UploadProps> = React.forwardRef(
  (props, ref: any) => {
    const [fileList, setFileList] = React.useState([]);
    const [errorMessage, setErrorMessage] = React.useState('');

    const {
      onHandleUpload,
      onBeforeUpload,
      onRemove = noop,
      title = '选择本地文件',
      action = '/api/v1/upload',
      name = 'file',
      showExtraTip = true,
      singleMaxSize = 10,
      data,
      multiple,
      accept = 'png/jpeg',
      headers,
      buttonProps,
      maxCount = 1,
      style = {},
    } = props;

    const beforeUpload = async (file: any) => {
      setErrorMessage('');
      // eg: accept="image/png,image/jpeg"

      const isAccept = accept?.split(',').some((item) => {
        const str = item.replace(/./, '');
        console.log('str', item, str);
        if (!str) return false;
        return file.type.indexOf(str) > -1;
      });

      if (!isAccept) {
        setErrorMessage(`只能上传 ${accept} 格式的文件。`);
      }
      const isLt10M = file.size / 1024 / 1024 < 10;
      if (!isLt10M) {
        setErrorMessage(`此文件大于 ${singleMaxSize}M，不能上传。`);
      }
      if (!onBeforeUpload) {
        return isAccept && isLt10M;
      }

      const beforeFlag = await onBeforeUpload(file);
      if (!beforeFlag) {
        // TODO: 将信息动态控制
        setErrorMessage('处理失败！');
      }
      return isAccept && isLt10M && beforeFlag;
    };

    const handleUpload = (info: UploadChangeParam) => {
      if (!onHandleUpload) {
        return;
      }
      let fileListResult: any = [];
      if (info.fileList.length) {
        fileListResult = [info.file];
      }
      // 是否多选
      if (multiple && info.fileList.length) {
        fileListResult = [...info.fileList];
      }
      fileListResult = (fileListResult || []).map((file: any) => {
        if (file.response) {
          file.url = file.response.url;
        }
        return file;
      });
      setFileList(fileListResult);

      onHandleUpload(multiple ? info.fileList : info.fileList[0]);
    };

    const uploadBtnNode = useMemo(() => {
      return (
        <>
          <Button {...buttonProps}>{title}</Button>
          {accept && showExtraTip && (
            <div className="ant-form-item-extra">
              {singleMaxSize && <span>文件最大为{singleMaxSize}M，</span>}支持
              {accept}格式
            </div>
          )}
        </>
      );
    }, [accept, buttonProps, showExtraTip, singleMaxSize, title]);

    return (
      <div style={{ width: buttonProps?.style?.width || '100%', ...style }}>
        <Upload
          ref={ref}
          action={action}
          withCredentials
          name={name}
          data={data || {}}
          maxCount={maxCount}
          fileList={fileList}
          multiple={multiple || false}
          accept={accept}
          headers={headers}
          onChange={handleUpload}
          beforeUpload={beforeUpload}
          onRemove={(file) => {
            setErrorMessage('');
            onRemove(file);
          }}
        >
          {fileList.length >= maxCount && !errorMessage ? null : uploadBtnNode}

          {errorMessage && (
            <p className="ant-form-item-explain-error">
              <InfoCircleOutlined className="red" />
              &nbsp;
              {errorMessage}
            </p>
          )}
        </Upload>
      </div>
    );
  },
);
