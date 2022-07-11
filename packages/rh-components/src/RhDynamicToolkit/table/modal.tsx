/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-6-27 18:38:44
 * @description Low-Code 之 jsonschema 动态渲染 tab-table ModalForm 复杂弹窗
 */

import { httpPost, httpPut } from '@roothub/helper/src/http';
import { message, Modal, ModalProps } from 'antd';
import { isFunction, noop, template } from 'lodash';
import { useCallback, useMemo } from 'react';
import { FormSchemaBase } from '../form/type';
import RhDynamicTabTable from './tab';

type DynamicTableModalProps = {
  /**
   * 动态表单的 schema
   */
  schema: FormSchemaBase;
  /**
   * 表单初始值
   */
  initialValues?: AnyObject;
  /**
   * 表格参数
   */
  data?: AnyObject;
  /**
   * width
   */
  width?: number;
  /**
   * 弹窗标题
   */
  title?: string;
  /**
   * 请求参数
   */
  params?: AnyObject;
  /**
   * 提交按钮请求之前处理
   */
  beforeRequest?: (fieldsValue: AnyObject, schema: FormSchemaBase) => void;
  /**
   * 提交保存成功后的回调
   */
  afterSubmit?: (values: AnyObject) => void;
  onClose?: (e?: any) => void;
} & ModalProps;

function RhDynamicTableModal({
  schema,
  initialValues,
  visible = false,
  params = {},
  data = {},
  width,
  beforeRequest,
  afterSubmit = noop,
  onClose = noop,
  ...restProps
}: DynamicTableModalProps) {
  // 主键id的值
  const primaryFieldValue = useMemo(() => {
    let id = initialValues?.id;
    if (initialValues && schema.primaryField) {
      id = initialValues[schema.primaryField];
    }
    return id;
  }, [schema.primaryField, initialValues]);
  /**
   * 内部封装提交表单逻辑
   */
  const handleSubmit = useCallback(
    async (fieldsValue) => {
      const hide = message.loading('数据保存中…');

      let body = fieldsValue;

      if (isFunction(beforeRequest)) {
        body = beforeRequest(fieldsValue, schema);
      }
      const successHandler = (res: any) => {
        if (res.data) {
          message.success(`${primaryFieldValue ? '修改' : '新增'}成功`);
          afterSubmit(body);
          if (isFunction(restProps.afterClose)) {
            restProps.afterClose();
          }
          return true;
        }
        return false;
      };
      const apiUrl = template(schema.api as string)(params);
      if (primaryFieldValue) {
        // 编辑
        // 可以通过primaryField指定接口主键id字段名称
        return httpPut(`${apiUrl}/${encodeURI(primaryFieldValue)}`, body)
          .then(successHandler)
          .finally(() => {
            hide();
          });
      } else {
        // 新增
        return httpPost(`${apiUrl}`, body)
          .then(successHandler)
          .finally(() => {
            hide();
          });
      }
    },
    [afterSubmit, beforeRequest, schema, params, primaryFieldValue, restProps],
  );

  const modalProps = useMemo((): ModalProps => {
    // const initVal = transformInitVal(initialValues, schema.body);
    return {
      title: `${primaryFieldValue ? '编辑' : '新增'}${schema.title || ''}`,
      visible,
      destroyOnClose: true,
      maskClosable: false,
      width: width ?? 880,
      bodyStyle: {
        maxHeight: 900,
        overflow: 'auto',
      },
      onCancel: onClose,
      footer: null,
    };
  }, [onClose, primaryFieldValue, schema.title, visible, width]);

  const renderSchemaTable = useMemo(() => {
    if (!schema) {
      return null;
    }
    if (!schema?.body) {
      return <p className="red">jsonSchema格式解析错误，请检查！</p>;
    }
    if (schema.type !== 'table-modal') {
      console.warn?.(
        'RhDynamicTableModal::',
        `${schema.title}的 type 类型不是table-modal，但使用了table-modal渲染动态表单`,
      );
    }

    return (
      <RhDynamicTabTable
        schema={schema.body}
        data={data}
        onCancel={onClose}
        onConfirm={handleSubmit}
      />
    );
  }, [data, handleSubmit, onClose, schema]);

  return <Modal {...modalProps}>{renderSchemaTable}</Modal>;
}

export default RhDynamicTableModal;
