/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-21 20:16:18
 * @description 根据表单配置生成表单
 */

import { ProFormUploadButton } from '@ant-design/pro-components';
import {
  ProFormCascader,
  ProFormDatePicker,
  ProFormDateRangePicker,
  ProFormDigit,
  ProFormDigitRange,
  ProFormRadio,
  ProFormSelect,
  ProFormText,
  ProFormTextArea,
} from '@ant-design/pro-form';
import { Button, Form } from 'antd';
import { assign, cloneDeep, get, omit } from 'lodash';
import { useMemo } from 'react';
import RhSelect from '../../RhSelect';
import {
  formatValueEnum,
  includesValue,
  unifiedProperty,
} from '../utils/index';
import { evalExpression } from '../utils/tpl';
import FetchButton from '../widgets/FetchButton';
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
      dependencies,
      depFieldNameList,
      dataType,
      disabledOn,
      ...restProps
    } = props;

    restProps = omit(restProps, ['validator', 'defaultValue']);
    assign(restProps, {
      key: dataIndex,
      name: dataIndex,
      label: title,
    });

    // 自定义jsx渲染，优先级高于valueType/renderType，在jsx中使用本组件时会更灵活
    if (renderFormItem) {
      return renderFormItem();
    }

    const key = `form_item_key_${dataIndex}`;

    return (
      <Form.Item
        noStyle
        shouldUpdate
        key={key}
        className={restProps?.className}
      >
        {(form) => {
          const formValues = form.getFieldsValue();
          if (disabledOn) {
            restProps.disabled = evalExpression(
              disabledOn,
              Object.assign(formValues, formInitialValues ?? {}),
            );
          }
          // 包含联动依赖字段处理渲染逻辑
          if (depFieldNameList?.length && dependencies) {
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

          if (valueType === 'select') {
            const showEnumSelect: boolean =
              (valueEnum && Object.keys(valueEnum).length > 0) ||
              !!restProps.fieldProps?.options?.length;
            if (showEnumSelect) {
              return (
                <ProFormSelect
                  valueEnum={valueEnum}
                  placeholder={restProps.placeholder || `选择`}
                  {...restProps}
                />
              );
            }
            const { api } = restProps;
            if (api) {
              return <RhSelect isFormItem={true} {...restProps} />;
            }
          }
          if (valueType === 'radio') {
            if (!valueEnum) {
              valueEnum = [{ label: title, value: restProps.initialValue }];
            }
            return (
              <ProFormRadio.Group
                fieldProps={{ ...restProps.fieldProps, width: 'md' }}
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
                {...restProps}
                style={block ? { display: 'block' } : {}}
              />
            );
          }

          if (valueType === 'date') {
            return <ProFormDatePicker {...restProps} />;
          }

          if (valueType === 'dateRange') {
            return <ProFormDateRangePicker {...restProps} />;
          }

          if (valueType === 'numberRange') {
            return (
              <ProFormDigitRange
                separatorWidth={restProps?.separatorWidth || 60}
                {...restProps}
              />
            );
          }
          if (valueType === 'textArea') {
            return <ProFormTextArea {...restProps} />;
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
            return <Button {...restProps}>{title}</Button>;
          }
          // 上传按钮
          if (valueType === 'uploadButton') {
            return (
              <ProFormUploadButton
                action={restProps.fieldProps?.action}
                {...restProps}
              />
            );
          }
          // 级联
          if (valueType === 'cascader') {
            return <ProFormCascader {...restProps} />;
          }

          // 保持在最末尾，都匹配不到的时候渲染input
          if (valueType === 'text' || valueType === 'input' || !valueType) {
            return (
              <ProFormText
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
