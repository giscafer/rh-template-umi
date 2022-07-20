/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-20 19:59:59
 * @description Low-Code 之 jsonschema 动态渲染 ProForm
 */

import {
  FooterToolbar,
  ProForm,
  ProFormInstance,
  ProFormProps,
} from '@ant-design/pro-components';
import { httpPost, httpPut } from '@roothub/helper/http';
import { Button, message } from 'antd';
import { isFunction, noop, template } from 'lodash';
import { useCallback, useMemo, useRef } from 'react';
import { transformDataIndexVal, transformInitVal } from '../utils';
import RhDynamicFormGroup from './form-group';
import { FormSchemaBase } from './type';

type AnyObject = Record<string, any>;

type RhDynamicProFormProps = {
  /**
   * 动态表单的 schema
   */
  schema: FormSchemaBase;
  /**
   * 表单初始值
   */
  initialValues?: Record<string, any>;
  /**
   * 请求参数
   */
  params?: AnyObject;
  /**
   * FormGroup 参数
   */
  groupProps?: AnyObject;
  /**
   * 提交按钮请求之前处理
   */
  beforeRequest?: (fieldsValue: AnyObject, schema: FormSchemaBase) => void;
  /**
   * 提交保存成功后的回调
   */
  afterSubmit?: (values: AnyObject) => void;
  /**
   * 取消按钮
   */
  onCancel?: () => void;
  /**
   * 取消按钮文字
   * @default "取消"
   */
  cancelText?: string;
  /**
   * 确定按钮文字
   * @default "确定"
   */
  confirmText?: string;
} & ProFormProps;

const defaultGroupProps = {
  showCollapse: true,
  showCollapseText: false,
  fontSize: 16,
  titleStyle: {
    height: '32px',
    fontWeight: 500,
  },
  block: true,
  width: 600,
};

function RhDynamicProForm({
  schema,
  initialValues,
  params = {},
  groupProps = defaultGroupProps,
  cancelText = '取消',
  confirmText = '确定',
  beforeRequest,
  onCancel = noop,
  afterSubmit = noop,
  ...restProps
}: RhDynamicProFormProps) {
  const formRef = useRef<ProFormInstance>(null);

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
    async (fieldsValue: AnyObject) => {
      const isValid = await formRef.current?.validateFields();
      if (!isValid) {
        return;
      }
      const hide = message.loading('数据保存中…');

      let body = transformDataIndexVal(fieldsValue, schema.body);

      if (isFunction(beforeRequest)) {
        body = beforeRequest(fieldsValue, schema);
      }
      const successHandler = (res: any) => {
        if (res.data) {
          message.success(`${primaryFieldValue ? '修改' : '新增'}成功`);
          afterSubmit(body);

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

  const formProps = useMemo((): ProFormProps => {
    const initVal = transformInitVal(initialValues, schema.body);
    const options: ProFormProps = {
      formRef,
      initialValues: initVal,
      labelCol: { span: 12 },
      submitter: false,
      /*  onFinish: async (values) => {
        return handleSubmit(values);
      }, */
      ...restProps,
    };

    return options;
  }, [
    schema.body,
    schema.title,
    handleSubmit,
    initialValues,
    primaryFieldValue,
    restProps,
  ]);

  const renderSchemaForm = useMemo(() => {
    if (!schema) {
      console.warn('schema is empty');
      return null;
    }
    if (!schema?.body) {
      return <p className="red">jsonSchema格式解析错误，请检查！</p>;
    }
    if (schema.type !== 'form') {
      console.warn?.(
        'RhDynamicProForm::',
        `${schema.title}的 type 类型不是pro-form，但使用了pro-form组件渲染动态表单`,
      );
    }
    return (
      <RhDynamicFormGroup
        schema={schema.body}
        formInitialValues={initialValues}
        groupProps={groupProps}
      />
    );
  }, [schema, initialValues]);

  return (
    <>
      <ProForm {...formProps}>{renderSchemaForm}</ProForm>
      <FooterToolbar
        style={{
          left: 208,
          width: `calc(100% - 208px)`,
        }}
      >
        <Button type="default" size="large" onClick={onCancel}>
          {cancelText}
        </Button>
        <Button type="primary" size="large" onClick={handleSubmit}>
          {confirmText}
        </Button>
      </FooterToolbar>
    </>
  );
}

export default RhDynamicProForm;
