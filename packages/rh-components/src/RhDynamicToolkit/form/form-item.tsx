/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-21 20:16:18
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
import { assign, cloneDeep, get, omit, uniqueId } from 'lodash';
import { useMemo } from 'react';
import {
  formatValueEnum,
  includesValue,
  unifiedProperty,
} from '../utils/index';
import { evalExpression } from '../utils/tpl';
import FetchButton from '../widgets/FetchButton';
import InputNumberRange from '../widgets/InputNumberRange';
import { LinkageRuleType, ValueEnumType } from './types';

type AnyObject = Record<string, any>;

function RhDynamicFormItem({
  widgetProps,
  namePrefix,
  block,
  formInitialValues,
}: AnyObject) {
  const renderWidgetItem = useMemo(() => {
    const props = unifiedProperty(widgetProps, namePrefix);
    let {
      dataIndex,
      title,
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
    assign(restProps, {
      name: dataIndex,
      key: dataIndex,
      label: title,
    });

    // 自定义jsx渲染，优先级高于valueType/renderType，在jsx中使用本组件时会更灵活
    if (renderFormItem) {
      return renderFormItem();
    }

    const key = (dataIndex as any) || uniqueId('form_item_key_');

    return (
      <Form.Item
        noStyle
        shouldUpdate
        key={key}
        className={restProps?.className}
      >
        {(form) => {
          if (disabledOn) {
            restProps.disabled = evalExpression(disabledOn, formInitialValues);
          }
          // 包含联动依赖字段处理渲染逻辑
          if (depFieldNameList?.length && dependencies) {
            const formValues = form.getFieldsValue();
            // 联动条件
            for (const depItem of dependencies) {
              const { type: depType, fieldName, rules, valueList } = depItem;

              const depFieldVal = get(
                formValues,
                namePrefix ? `${namePrefix}.${fieldName}` : fieldName,
              );

              if (depType === 'visible') {
                if (!includesValue(valueList, depFieldVal)) {
                  return null;
                }
              }

              if (depFieldVal) {
                // 有值时才显示隐藏联动逻辑
                if (depType === 'linkage') {
                  // 联动条件触发重新渲染 valueEnum
                  let newValueEnum: ValueEnumType[] = [];
                  const valueEnumCache = cloneDeep(
                    valueEnum,
                  ) as ValueEnumType[];
                  rules?.forEach((rule: LinkageRuleType) => {
                    if (includesValue(rule.valueList, depFieldVal)) {
                      // 有联动时，如果原本有值，联动后选项已经去掉，则清空(TODO)
                      const fieldVal = get(
                        formValues,
                        namePrefix ? `${namePrefix}.${dataIndex}` : dataIndex,
                      );

                      if (fieldVal && !valueEnumCache?.[fieldVal]) {
                        // issue: https://github.com/facebook/react/issues/15656
                        // form.setFieldsValue({
                        //   [namePrefix
                        //     ? `${namePrefix}.${dataIndex}`
                        //     : dataIndex]: undefined,
                        // });
                      }
                      newValueEnum = formatValueEnum(
                        rule.valueEnum,
                        valueType,
                      ) as ValueEnumType[];
                    }
                  });
                  valueEnum = newValueEnum;
                }
              }
            }
          }

          if (
            (valueType === 'select' && valueEnum) ||
            (!valueType && valueEnum)
          ) {
            const showEnumSelect: boolean =
              (valueEnum && Object.keys(valueEnum).length > 0) ||
              !!fieldProps?.options?.length;
            return (
              showEnumSelect && (
                <ProFormSelect
                  valueEnum={valueEnum}
                  rules={rules}
                  fieldProps={fieldProps}
                  placeholder={restProps.placeholder || `选择`}
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
                rules={rules}
                fieldProps={{ ...fieldProps, width: 'md' }}
                options={valueEnum}
                {...restProps}
              />
            );
          }

          // number类型
          if (
            valueType === 'digit' ||
            (dataType === 'number' &&
              (valueType === 'input' || valueType === 'text'))
          ) {
            return (
              <ProFormDigit
                rules={rules}
                fieldProps={fieldProps}
                {...restProps}
                style={block ? { display: 'block' } : {}}
              />
            );
          }

          if (valueType === 'date') {
            return (
              <ProFormDatePicker
                rules={rules}
                fieldProps={fieldProps}
                {...restProps}
              />
            );
          }

          if (valueType === 'dateRange') {
            return (
              <ProFormDateRangePicker
                rules={rules}
                fieldProps={fieldProps}
                {...restProps}
              />
            );
          }

          if (valueType === 'numberRange') {
            return (
              <InputNumberRange
                separator={undefined}
                form={form}
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
                rules={rules}
                fieldProps={fieldProps}
                {...restProps}
              />
            );
          }

          if (valueType === 'button') {
            if (restProps.params?.url) {
              if (restProps.params?.data) {
                const paramObj: Record<string, any> = {};
                Object.keys(restProps.params?.data).forEach((key) => {
                  const val = form.getFieldValue(key);
                  paramObj[key] = val;
                });
                restProps.params.data = paramObj;
              }
              return (
                <FetchButton
                  key={dataIndex}
                  dataIndex={dataIndex}
                  title={title}
                  {...restProps}
                />
              );
            }
            // TODO: 其他类型按钮
            return <Button key={dataIndex}>{title}</Button>;
          }

          // 保持在最末尾，都匹配不到的时候渲染input
          if (valueType === 'text' || valueType === 'input' || !valueType) {
            return (
              <ProFormText
                fieldProps={fieldProps}
                rules={rules}
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
