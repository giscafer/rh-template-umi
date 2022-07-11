/* eslint-disable no-param-reassign */
import type { Options, Separators } from './types';

/**
 * 获取分隔符配置
 * @param opts
 * @returns
 */
export function getSeparators({ thousandSeparator = true, decimalSeparator = '.' }: any = {}) {
  if (thousandSeparator === true) {
    thousandSeparator = ',';
  }

  if (!thousandSeparator) {
    thousandSeparator = undefined;
  }

  return {
    thousandSeparator,
    decimalSeparator,
  } as Separators;
}

/**
 * 验证配置
 * @param opts
 */
export function validateOptions(opts: Options = {}) {
  const { thousandSeparator, decimalSeparator } = getSeparators(opts);

  // 十进制分隔符不能与千位分隔符相同
  if (decimalSeparator === thousandSeparator) {
    throw new Error(`
      Decimal separator can't be same as thousand separator.
      thousandSeparator: ${thousandSeparator} (thousandSeparator = {true} is same as thousandSeparator = ",")
      decimalSeparator: ${decimalSeparator} (default value for decimalSeparator is .)
    `);
  }
}

/**
 * 将数字拆分为
 * @param numStr
 * @param allowNegative
 * @returns
 */
export function splitDecimal(numStr: string, allowNegative: boolean = true) {
  const hasNagation = numStr[0] === '-';
  const addNegation = hasNagation && allowNegative;

  numStr = numStr.replace('-', '');

  const parts = numStr.split('.');

  const beforeDecimal = parts[0];
  const afterDecimal = parts[1] || '';

  return {
    beforeDecimal,
    afterDecimal,
    hasNagation,
    addNegation,
  };
}

const thousandsGroupRegex = /(\d)(?=(\d{3})+(?!\d))/g;

export function applyThousandSeparator(str: string, thousandSeparator: string) {
  let index = str.search(/[1-9]/);
  index = index === -1 ? str.length : index;

  return (
    str.substring(0, index) + str.substring(index, str.length).replace(thousandsGroupRegex, '$1' + thousandSeparator)
  );
}

export function formatWithPattern(numStr: string, template: string): string {
  let hashCount = 0;
  const formattedNumberAry = template.split('');
  for (let i = 0, ln = template.length; i < ln; i++) {
    if (template[i] === '#') {
      formattedNumberAry[i] = numStr[hashCount];
      hashCount += 1;
    }
  }
  return formattedNumberAry.join('');
}

export function formatPrecision(numStr: string = '', precision: number = 0) {
  let targetLength = precision >> 0;

  if (numStr.length > targetLength) {
    numStr = numStr.slice(0, targetLength);
  }

  if (targetLength > numStr.length) {
    targetLength = targetLength - numStr.length;

    for (let i = 0; i < targetLength; i++) {
      numStr += '0';
    }
  }

  return numStr;
}
