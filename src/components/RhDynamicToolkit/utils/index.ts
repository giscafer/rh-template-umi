import { cloneDeep, find, isArray, isNaN, isNil, isObject, keys, map, omit, zipObject } from 'lodash';
import { evalExpression } from './tpl';
import { genValidatorRules } from './validator';

export function includesValue(valueList = [], val) {
  // eslint-disable-next-line eqeqeq
  return valueList.some((item) => item == val);
}

// valueEnum 数组简化 成 对象
export function formatValueEnum(originEnum, valueType = 'select') {
  if (valueType === 'select') {
    if (!isArray(originEnum)) return originEnum;
    const labelList = map(originEnum, 'label');
    const valueList = map(originEnum, 'value');
    return zipObject(valueList, labelList);
  }
  return originEnum;
}

/**
 * 转换差异化属性为 antd Form 格式，方便日后直接用 antd proform schema 也可以
 * @param property
 * @returns fieldProps
 */
export function unifiedProperty(property, namePrefix) {
  const { id, dataIndex, label, title, dataType, valueEnum, renderType, valueType, initialValue, defaultValue } =
    property;

  const name = typeSafeGroupedName(id ?? dataIndex, namePrefix);

  const newProperty = {
    fieldProps: { size: 'medium' },
    ...property,
    name,
    width: 'md',
    dataIndex: typeSafeDataIndex(id) || dataIndex,
    title: label || title,
    valueType: renderType || valueType,
    dataType: getFormDataType(dataType),
    valueEnum: formatValueEnum(valueEnum, renderType || valueType),
    initialValue: isNil(defaultValue) ? initialValue : defaultValue,
    depFieldNameList: property.dependencies?.map((item) => item.fieldName), // 联动依赖字段
    rules: genValidatorRules(property),
  };

  return newProperty;
}

function typeSafeDataIndex(id) {
  if (Array.isArray(id)) return id.join('.');
  return id;
}

function typeSafeGroupedName(id, prefix = []) {
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

export function isNumberType(dataType = 'string') {
  return getFormDataType(dataType) === 'number';
}

export function convertDataTypeVal(dataType, val) {
  if (getFormDataType(dataType) === 'number') {
    if ([undefined, null, ''].includes(val)) return undefined;
    return Number(val);
  }
  return val;
}

export function flatSchemaList(schema) {
  let schemaList = [];
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
export function transformDataIndexVal(fieldsValue = {}, schema): any {
  const schemaList = flatSchemaList(schema);
  const keyList = keys(fieldsValue);
  const obj = {};
  for (const key of keyList) {
    // range字段规则
    const keyArr = key.split(',');
    if (keyArr.length > 1 && isArray(fieldsValue[key])) {
      const fieldMeta = find(schemaList, (item) => item.id === key);

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
export function transformInitVal(initialValues, schema): any {
  if (!initialValues || !isObject(initialValues)) {
    return initialValues;
  }
  const schemaList = flatSchemaList(schema);
  const keyList = map(schemaList, 'id');
  const obj = cloneDeep(initialValues);
  for (const key of keyList) {
    // range字段规则存在 时
    const keyArr = key.split(',');
    let val: any[] = [];
    if (keyArr.length > 1) {
      const fieldMeta = find(schemaList, (item) => item.id === key);

      const firstVal = initialValues[keyArr[0]];
      const secondVal = initialValues[keyArr[1]];
      if (fieldMeta.dataType === 'string' && fieldMeta.renderType !== 'numberRange') {
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
