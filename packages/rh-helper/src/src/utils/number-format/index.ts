/* eslint-disable prefer-const */
import type { Options } from './types';
import {
  applyThousandSeparator,
  formatPrecision,
  formatWithPattern,
  getSeparators,
  splitDecimal,
  validateOptions,
} from './utils';

const defaultOptions: Options = {
  allowNegative: true,
  decimalSeparator: '.',
  thousandSeparator: true,
};

export function numberFormat(options: Options = {}) {
  const opts = { ...defaultOptions, ...options };
  validateOptions(opts);

  const { prefix, suffix, template, precision } = opts;
  const { thousandSeparator, decimalSeparator } = getSeparators(opts);

  const formatAsNumber = (numStr: string) => {
    const hasDecimalSeparator = numStr.indexOf('.') !== -1;
    let { beforeDecimal, afterDecimal, addNegation } = splitDecimal(numStr + '', opts.allowNegative);

    if (thousandSeparator) {
      beforeDecimal = applyThousandSeparator(beforeDecimal, thousandSeparator);
    }

    if (precision) {
      afterDecimal = formatPrecision(afterDecimal, precision);
    }

    /** add prefix and suffix */
    if (prefix) beforeDecimal = prefix + beforeDecimal;
    if (suffix) afterDecimal = afterDecimal + suffix;

    /** restore negation sign */
    if (addNegation) beforeDecimal = '-' + beforeDecimal;

    return beforeDecimal + ((hasDecimalSeparator && decimalSeparator) || '') + afterDecimal;
  };

  const formatNumString = (numStr: string = '') => {
    let formattedValue = numStr;

    if (numStr === '') {
      formattedValue = '';
    } else if (typeof template === 'string' && template) {
      formattedValue = formatWithPattern(formattedValue, template);
    } else {
      formattedValue = formatAsNumber(formattedValue);
    }

    return formattedValue;
  };

  return {
    format: (val: number) => formatNumString(val + ''),
  };
}

export default numberFormat;
