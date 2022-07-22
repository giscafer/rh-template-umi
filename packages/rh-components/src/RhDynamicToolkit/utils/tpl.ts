/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-06-22 19:23:44
 * @description 表达式解析执行，内置公式等，高级表达式依赖 amis-formula
 * 高级表达式详情见：https://aisuda.bce.baidu.com/amis/zh-CN/docs/concepts/expression
 *
 * 更多用法见：src\components\RhDynamicToolkit\utils\__tests__\fomula.test.ts
 */
/* eslint-disable no-param-reassign */
import { evaluate, parse } from 'amis-formula';

// 缓存一下提升性能
// eslint-disable-next-line @typescript-eslint/ban-types
const EVAL_CACHE: { [key: string]: Function } = {};

let customEvalExpressionFn: (expression: string, data?: any) => boolean;
export function setCustomEvalExpression(
  fn: (expression: string, data?: any) => boolean,
) {
  customEvalExpressionFn = fn;
}

const AST_CACHE: { [key: string]: any } = {};
function evalFormula(expression: string, data: any) {
  const ast =
    AST_CACHE[expression] ||
    parse(expression, {
      evalMode: false,
    });
  AST_CACHE[expression] = ast;

  return evaluate(ast, data, {
    defaultFilter: 'raw',
  });
}

// 几乎所有的 visibleOn requiredOn 都是通过这个方法判断出来结果，很粗暴也存在风险，建议自己实现。
// 如果想自己实现，请通过 setCustomEvalExpression 来替换自定义实现方式。
export function evalExpression(expression: string, data?: any): boolean {
  if (typeof customEvalExpressionFn === 'function') {
    return customEvalExpressionFn(expression, data);
  }
  if (!expression || typeof expression !== 'string') {
    return false;
  }

  try {
    // 使用 amis-formula 增强运算表达式能力
    // https://github.com/aisuda/amis-formula/blob/HEAD/src/lexer.ts#L130-L131
    if (
      typeof expression === 'string' &&
      expression.substring(0, 2) === '${' &&
      expression[expression.length - 1] === '}'
    ) {
      // 启用新版本的公式表达式
      return evalFormula(expression, data);
    }

    // 后续改用 FormulaExec['js']
    let debug = false;
    const idx = expression.indexOf('debugger');
    if (~idx) {
      debug = true;
      expression = expression.replace(/debugger;?/, '');
    }

    let fn;
    if (expression in EVAL_CACHE) {
      fn = EVAL_CACHE[expression];
    } else {
      // eslint-disable-next-line no-new-func
      fn = new Function(
        'data',
        'utils',
        `with(data) {${debug ? 'debugger;' : ''}return !!(${expression});}`,
      );
      EVAL_CACHE[expression] = fn;
    }

    data = data || {};

    return fn.call(data, data);
  } catch (e) {
    console.warn(expression, e);
    return false;
  }
}
