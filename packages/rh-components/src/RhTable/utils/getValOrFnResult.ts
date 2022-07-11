import { evaluate } from 'amis-formula';

/**
 * @param expression
 * @param data
 * @param evalMode 直接是运算表达式？还是从模板开始 ${} 里面才算运算表达式
 * false 为模板开始 ${}，true是直接表达式
 * @returns
 */
export function evalFormula(
  expression: string,
  data: any = {},
  evalMode = false,
) {
  return evaluate(expression, data, {
    evalMode,
  });
}

interface GetResultFn<T> {
  (...opt: any[]): T;
}

export default function getValOrFnResult<T = any>(
  target: T | GetResultFn<T>,
  ...args: any[]
): T {
  if (typeof target === 'function') {
    return (target as GetResultFn<T>)(...args);
  }
  // 公式表达式
  if (
    typeof target === 'string' &&
    target.substring(0, 2) === '${' &&
    target[target.length - 1] === '}'
  ) {
    return evalFormula(target, ...args);
  }
  // 其他
  return target as T;
}
