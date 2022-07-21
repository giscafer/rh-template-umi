import {
  cloneDeep,
  find,
  isArray,
  isNaN,
  isNil,
  isObject,
  keys,
  map,
  omit,
  zipObject,
} from 'lodash';
import { DataIndex, ValueEnumType, WidgetProps } from '../form/types';
import { genValidatorRules } from './validator';

export function includesValue(valueList: any[] = [], val: any) {
  // eslint-disable-next-line eqeqeq
  return valueList.some((item) => item == val);
}

// valueEnum 数组简化 成 对象
export function formatValueEnum(
  originEnum?: ValueEnumType[],
  valueType = 'select',
) {
  if (valueType === 'select') {
    if (!isArray(originEnum)) return originEnum;
    const labelList = map(originEnum, 'label');
    const valueList: any[] = map(originEnum, 'value');
    return zipObject(valueList, labelList);
  }
  return originEnum;
}

function typeSafeDataIndex(id: DataIndex): string {
  if (Array.isArray(id)) {
    return id.join('.');
  }
  return id ? String(id) : '';
}

function typeSafeGroupedName(id: any, prefix?: string | string[]) {
  if (!prefix) {
    return id;
  }
  const prefixList = Array.isArray(prefix) ? prefix : [prefix];
  const idList = Array.isArray(id) ? id : [id];
  return [...prefixList, ...idList];
}

export function getFormDataType(dataType = 'string') {
  const type = dataType?.toLowerCase()?.trim();
  if (['int', 'integer', 'number', 'float', 'double'].includes(type)) {
    return 'number';
  }

  return dataType || 'text';
}

/**
 * 转换差异化属性为 antd Form 格式，方便日后直接用 antd proform schema 也可以
 * @param property
 * @returns fieldProps
 */
export function unifiedProperty(property: WidgetProps, namePrefix?: string) {
  const {
    dataIndex,
    title,
    dataType,
    valueEnum,
    renderType,
    valueType,
    initialValue,
    defaultValue,
  } = property;

  const name = typeSafeGroupedName(dataIndex, namePrefix);

  const newProperty: { dataIndex: string; [key: string]: any } = {
    fieldProps: { size: 'medium' },
    ...property,
    name,
    dataIndex: typeSafeDataIndex(dataIndex),
    title,
    valueType: renderType || valueType,
    dataType: getFormDataType(dataType),
    valueEnum: formatValueEnum(valueEnum, renderType || valueType),
    initialValue: isNil(defaultValue) ? initialValue : defaultValue,
    depFieldNameList: property.dependencies?.map(
      (item: { fieldName: any }) => item.fieldName,
    ), // 联动依赖字段
    rules: genValidatorRules(property),
  };

  return newProperty;
}

export function isNumberType(dataType = 'string') {
  return getFormDataType(dataType) === 'number';
}

export function toStringValue(value: any): string {
  let str = String(value);
  if (str === 'undefined' || str === 'null' || str === 'NaN') {
    str = '';
  }
  return str;
}

export function toNumberValue(value: any) {
  if (isNil(value)) {
    return value;
  }
  let num = Number(value);

  if (isNaN(num)) {
    return value;
  }
  return num;
}

export function isNotEmpty(value: any) {
  if (isNil(value)) {
    return false;
  }
  return value !== '';
}

export function convertDataTypeVal(
  dataType: string | undefined,
  val: string | null | undefined,
) {
  if (getFormDataType(dataType) === 'number') {
    if ([undefined, null, ''].includes(val)) return undefined;
    return Number(val);
  }
  return val;
}

export function flatSchemaList(schema: { properties: never[] }) {
  let schemaList: any[] = [];
  if (isArray(schema)) {
    // 不考虑字段重名的情况，基本也不可能
    for (const item of schema) {
      schemaList = schemaList.concat(item.properties || []);
    }
  } else {
    schemaList = schema?.properties || [];
  }
  return schemaList;
}

/**
 * 将 dataIndex 为 "rawMin,rawMax" 的值进行转换
 * @param fieldsValue 表单提交对象
 * @param schema schema 配置
 * @returns
 *  { "rawMin,rawMax":[1,2] } 转换为 { "rawMin": 1, "rawMax": 2 }
 */
export function transformDataIndexVal(
  fieldsValue: Record<string, any> = {},
  schema: any,
): any {
  const schemaList = flatSchemaList(schema);
  const keyList = keys(fieldsValue);
  const obj: Record<string, any> = {};
  for (const key of keyList) {
    // range字段规则
    const keyArr = key.split(',');
    if (keyArr.length > 1 && isArray(fieldsValue[key])) {
      const fieldMeta = find(schemaList, (item) => item.dataIndex === key);

      if (fieldMeta.dataType === 'string') {
        obj[keyArr[0]] = fieldsValue[key][0] + '';
        const secondVal = fieldsValue[key][1];
        obj[keyArr[1]] = secondVal ? `${secondVal}` : secondVal;
      } else {
        obj[keyArr[0]] = fieldsValue[key][0];
        obj[keyArr[1]] = fieldsValue[key][1];
      }
    } else {
      obj[key] = fieldsValue[key];
    }
  }
  return obj;
}

/**
 * 初始化 dataIndex 为 "rawMin,rawMax" 的值
 * @param fieldsValue 表单提交对象
 * @param schema schema 配置
 * @returns
 *  { "rawMin": 1, "rawMax": 2 } 转换为 { "rawMin,rawMax":[1,2] }
 */
export function transformInitVal(initialValues: any, schema: any): any {
  if (!initialValues || !isObject(initialValues)) {
    return initialValues;
  }
  const schemaList = flatSchemaList(schema);
  const keyList = map(schemaList, 'dataIndex');
  const obj: Record<string, any> = cloneDeep(initialValues);
  for (const key of keyList) {
    // range字段规则存在 时
    const keyArr: string[] = key.split(',');
    let val: any[] = [];
    if (keyArr.length > 1) {
      const fieldMeta = find(schemaList, (item) => item.dataIndex === key);

      const firstVal = (initialValues as any)[keyArr[0]];
      const secondVal = (initialValues as any)[keyArr[1]];
      if (
        fieldMeta.dataType === 'string' &&
        fieldMeta.renderType !== 'numberRange'
      ) {
        val = [toStringValue(firstVal), toStringValue(secondVal)];
      } else if (fieldMeta.renderType === 'numberRange') {
        val = [toNumberValue(firstVal), toNumberValue(secondVal)];
      } else {
        val = [firstVal, secondVal];
      }

      obj[key] = val;
      omit(obj, keyArr);
    }
  }
  return obj;
}

/**
 * 对象的属性不存在为空的情况
 */
export function rowDataNotNil(record: Record<string, any>) {
  if (typeof record !== 'object') {
    return false;
  }
  let flag = true;
  for (const key in record) {
    if (record.hasOwnProperty(key) && key !== 'map_row_parentKey') {
      flag = isNotEmpty(record[key]);
      if (!flag) {
        return flag;
      }
    }
  }
  return flag;
}
