/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-6-24 14:33:13
 * @description Low-Code 之 jsonschema 动态渲染 ModalForm 弹窗
 */

import { httpPost, httpPut } from '@/shared/http';
import RhModalForm, { RhModalProps } from '@/components/RhModalForm';
import { message } from 'antd';
import { isFunction, isNil, noop, template } from 'lodash';
import { useCallback, useMemo } from 'react';
import { transformDataIndexVal, transformInitVal } from '../utils';
import RhDynamicFormGroup from './form-group';
import { FormSchemaBase } from './type';

type RhDynamicModalFormProps = {
  /**
   * 动态表单的 schema
   */
  schema: FormSchemaBase;
  /**
   * 表单初始值
   */
  initialValues?: AnyObject;
  /**
   * 当为undefined或null时，切text有值，则弹窗自动控制显示隐藏。
   * 否则自行通过 true/false 控制显隐
   */
  visible?: boolean;
  /**
   * 按钮文本，当自动渲染按钮时设置按钮文本
   */
  text?: string;
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
} & RhModalProps;

const groupProps = {
  showCollapse: true,
  showCollapseText: false,
  fontSize: 16,
  titleStyle: {
    height: '32px',
    fontWeight: 500,
  },
  block: true,
};

function RhDynamicModalForm({
  schema,
  initialValues,
  visible,
  params = {},
  text = '',
  beforeRequest,
  afterSubmit = noop,
  ...restProps
}: RhDynamicModalFormProps) {
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

      let body = transformDataIndexVal(fieldsValue, schema.body);

      if (isFunction(beforeRequest)) {
        body = beforeRequest(fieldsValue, schema);
      }
      const successHandler = (res: any) => {
        if (res.data) {
          message.success(`${primaryFieldValue ? '修改' : '新增'}成功`);
          afterSubmit(body);
          if (isFunction(restProps.onClose)) {
            restProps.onClose();
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

  const formProps = useMemo((): RhModalProps => {
    const initVal = transformInitVal(initialValues, schema.body);
    const options: RhModalProps = {
      text,
      title: `${primaryFieldValue ? '编辑' : '新增'}${schema.title || ''}`,
      initialValues: initVal,
      confirmText: '确定',
      labelCol: { span: 12 },
      onFinish: async (values) => {
        return handleSubmit(values);
      },
      ...restProps,
    };
    // 修复不传visible时，能自动显示隐藏弹窗。否则传 undefined 也会造成取消按钮不能隐藏。
    if (!isNil(visible)) {
      options.visible = visible;
    }
    return options;
  }, [schema.body, schema.title, handleSubmit, initialValues, primaryFieldValue, restProps, text, visible]);

  const renderSchemaForm = useMemo(() => {
    if (!schema) {
      console.warn('schema is empty');
      return null;
    }
    if (!schema?.body) {
      return (
        <p className="red">协议采集配置解析错误：可能是脏数据或者配置错误，建议使用最新协议安装包进行升级或重装!</p>
      );
    }
    if (schema.type !== 'form') {
      console.warn?.('RhDynamicModalForm::', `${schema.title}的 type 类型不是form，但使用了form渲染动态表单`);
    }
    return <RhDynamicFormGroup schema={schema.body} formInitialValues={initialValues} groupProps={groupProps} />;
  }, [schema, initialValues]);

  return <RhModalForm {...formProps}>{renderSchemaForm}</RhModalForm>;
}

export default RhDynamicModalForm;
