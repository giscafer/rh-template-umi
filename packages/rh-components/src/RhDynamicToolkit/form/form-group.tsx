/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-05-26 15:53:11
 * @description 动态表单封装，根据纯json数据生成表单，包含表单校验和数据联动功能，无需写jsx
 */

import cls from 'classnames';
import { isArray } from 'lodash';
import { useMemo } from 'react';
import RhTitle from '../../RhTitle';
import DynamicFormItem from './form-item';

type AnyObject = Record<string, any>;

export type RhDynamicFormGroupProps = {
  /**
   * json schema
   */
  schema: AnyObject;
  /**
   * 分组配置样式，主要是 RhTitle 的属性
   */
  groupProps?: AnyObject;
  /**
   * 表格初始化数据，透传为了做表单渲染判断
   */
  formInitialValues?: AnyObject;
};

function RhDynamicFormGroup({
  schema,
  groupProps = {
    showCollapse: true,
    showCollapseText: true,
    titleStyle: {},
    maxWidth: '1200px',
    gap: '0 16px',
    block: false,
  },
  formInitialValues,
}: RhDynamicFormGroupProps) {
  const renderFormNode = useMemo(() => {
    const schemaList = isArray(schema) ? schema : [schema];

    return schemaList?.map((group) => {
      const { title, label, id, properties: fields, namePrefix } = group;
      if (fields?.length > 0) {
        return (
          <RhTitle
            key={id}
            showCollapse={groupProps.showCollapse}
            showCollapseText={groupProps.showCollapseText}
            fontSize={groupProps?.fontSize}
            title={title || label}
            titleStyle={{ ...groupProps.titleStyle }}
          >
            <div
              className={cls({ 'flex-start': !groupProps.block })}
              style={{ maxWidth: groupProps.maxWidth, gap: groupProps.gap }}
            >
              {fields.map((f: AnyObject) => (
                <DynamicFormItem
                  key={f.id}
                  widgetProps={f}
                  namePrefix={groupProps.namePrefix || namePrefix}
                  block={groupProps.block}
                  formInitialValues={formInitialValues}
                />
              ))}
            </div>
          </RhTitle>
        );
      }
      // 非分组
      return (
        <DynamicFormItem
          key={id}
          widgetProps={group}
          namePrefix={group.namePrefix || namePrefix}
          block={groupProps.block}
          formInitialValues={formInitialValues}
        />
      );
    });
  }, [formInitialValues, schema, groupProps]);

  return <div>{renderFormNode}</div>;
}

export default RhDynamicFormGroup;
