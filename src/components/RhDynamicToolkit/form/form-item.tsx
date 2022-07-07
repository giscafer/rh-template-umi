/**
 * @author houbin.lao
 * @homepage
 * @created 2022-05-27 16:05:06
 * @description 根据表单配置生成表单
 */

import {
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Button, Form } from 'antd';
import { cloneDeep, get, omit } from 'lodash';
import { useMemo } from 'react';
import FetchButton from '../widgets/FetchButton';
import InputNumberRange from '../widgets/InputNumberRange';
import { formatValueEnum, includesValue, unifiedProperty } from '../utils/index';
import { evalExpression } from '../utils/tpl';

function RhDynamicFormItem({ widgetProps, namePrefix, block, formInitialValues }: AnyObject) {
  const renderWidgetItem = useMemo(() => {
    const props = unifiedProperty(widgetProps, namePrefix);
    let {
      dataIndex,
      title,
      width,
      valueType,
      valueEnum,
      renderFormItem,
      fieldProps,
      dependencies,
      depFieldNameList,
      dataType,
      rules,
      disabledOn,
      ...restProps
    } = props;

    omit(restProps, ['validator', 'defaultValue']);

    // 自定义jsx渲染，优先级高于valueType/renderType，在jsx中使用本组件时会更灵活
    if (renderFormItem) {
      return renderFormItem();
    }

    return (
      <Form.Item noStyle shouldUpdate key={dataIndex} className={restProps?.className}>
        {(form) => {
          if (disabledOn) {
            restProps.disabled = evalExpression(disabledOn, formInitialValues);
          }
          // 包含联动依赖字段处理渲染逻辑
          if (depFieldNameList?.length) {
            const formValues = form.getFieldsValue();
            // 联动条件
            for (const depItem of dependencies) {
              const { type: depType, fieldName, rules, valueList } = depItem;

              const depFieldVal = get(formValues, namePrefix ? `${namePrefix}.${fieldName}` : fieldName);

              if (depType === 'visible') {
                if (!includesValue(valueList, depFieldVal)) {
                  return null;
                }
              }

              if (depFieldVal) {
                // 有值时才显示隐藏联动逻辑
                if (depType === 'linkage') {
                  // 联动条件触发重新渲染valueEnum
                  let newValueEnum = [];
                  const valueEnumCache = cloneDeep(valueEnum);
                  rules?.forEach((rule) => {
                    if (includesValue(rule.valueList, depFieldVal)) {
                      // 有联动时，如果原本有值，联动后选项已经去掉，则清空(TODO)
                      const fieldVal = get(formValues, namePrefix ? `${namePrefix}.${dataIndex}` : dataIndex);

                      if (fieldVal && !valueEnumCache[fieldVal]) {
                        // issue: https://github.com/facebook/react/issues/15656
                        // form.setFieldsValue({
                        //   [namePrefix
                        //     ? `${namePrefix}.${dataIndex}`
                        //     : dataIndex]: undefined,
                        // });
                      }
                      newValueEnum = formatValueEnum(rule.valueEnum, valueType);
                    }
                  });
                  valueEnum = newValueEnum;
                }
              }
            }
          }

          if ((valueType === 'select' && valueEnum) || (!valueType && valueEnum)) {
            const showEnumSelect: boolean =
              (valueEnum && Object.keys(valueEnum).length > 0) || !!fieldProps?.options?.length;
            return (
              showEnumSelect && (
                <ProFormSelect
                  width={width}
                  key={dataIndex}
                  name={dataIndex}
                  label={title}
                  valueEnum={valueEnum}
                  rules={rules}
                  fieldProps={fieldProps}
                  placeholder={restProps.placeholder || `选择`}
                  type={dataType}
                  {...restProps}
                />
              )
            );
          }
          if (valueType === 'radio') {
            if (!valueEnum) {
              valueEnum = [{ label: title, value: restProps.initialValue }];
            }
            return (
              <ProFormRadio.Group
                width={width}
                key={dataIndex}
                name={dataIndex}
                label={title}
                rules={rules}
                fieldProps={{ ...fieldProps, width: 'md' }}
                options={valueEnum}
                type={dataType}
                {...restProps}
              />
            );
          }

          // number类型
          if (valueType === 'digit' || (dataType === 'number' && (valueType === 'input' || valueType === 'text'))) {
            return (
              <ProFormDigit
                key={dataIndex}
                name={dataIndex}
                label={title}
                width={width}
                rules={rules}
                fieldProps={fieldProps}
                type={dataType}
                {...restProps}
                style={block ? { display: 'block' } : {}}
              />
            );
          }

          if (valueType === 'date') {
            return (
              <ProFormDatePicker
                key={dataIndex}
                name={dataIndex}
                label={title}
                width={width}
                rules={rules}
                fieldProps={fieldProps}
                type={dataType}
                {...restProps}
              />
            );
          }

          if (valueType === 'dateRange') {
            return (
              <ProFormDateRangePicker
                key={dataIndex}
                name={dataIndex}
                label={title}
                width={width}
                rules={rules}
                fieldProps={fieldProps}
                type={dataType}
                {...restProps}
              />
            );
          }

          if (valueType === 'numberRange') {
            return (
              <InputNumberRange
                form={form}
                key={dataIndex}
                name={dataIndex}
                width={width}
                rules={rules}
                fieldProps={fieldProps}
                type={dataType}
                {...restProps}
              />
            );
          }
          if (valueType === 'textArea') {
            return (
              <ProFormTextArea
                key={dataIndex}
                name={dataIndex}
                width={width}
                rules={rules}
                fieldProps={fieldProps}
                type={dataType}
                {...restProps}
              />
            );
          }

          if (valueType === 'button') {
            if (restProps.params?.url) {
              if (restProps.params?.data) {
                const paramObj = {};
                Object.keys(restProps.params?.data).map((key) => {
                  const val = form.getFieldValue(key);
                  paramObj[key] = val;
                });
                restProps.params.data = paramObj;
              }
              return <FetchButton key={dataIndex} dataIndex={dataIndex} title={title} type={dataType} {...restProps} />;
            }
            // TODO: 其他类型按钮
            return <Button key={dataIndex}>{title}</Button>;
          }

          // 保持在最末尾，都匹配不到的时候渲染input
          if (valueType === 'text' || valueType === 'input' || !valueType) {
            return (
              <ProFormText
                width={width}
                key={dataIndex}
                name={dataIndex}
                label={title}
                fieldProps={fieldProps}
                rules={rules}
                type={dataType}
                placeholder={restProps.placeholder || `请输入`}
                {...restProps}
                footerRender={() => {
                  return false;
                }}
              />
            );
          }
        }}
      </Form.Item>
    );
  }, [block, formInitialValues, namePrefix, widgetProps]);

  return <>{renderWidgetItem}</>;
}

export default RhDynamicFormItem;
