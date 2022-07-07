import { Evaluator, evaluate, parse } from 'amis-formula';

/**
 * 更多用法见：src\components\RhDynamicToolkit\utils\__tests__\fomula.test.ts
 * @param expression
 * @param data
 * @param evalMode 直接是运算表达式？还是从模板开始 ${} 里面才算运算表达式
 * false 为模板开始 ${}，true是直接表达式
 * @returns
 */
export function evalFormula(expression: string, data: any = {}, evalMode = false) {
  return evaluate(expression, data, {
    evalMode,
  });
}

/**
 * 动态变量赋值
 * eg:
 * ```json
 *  "tabs": {
 *     "id": "channel",
 *      "source": "${tabList}"
 *    },
 * ```
 * @param path 参数就是 "${tabList}" ，data 可以传 {tabList:[{label:"Channel",value:"Channel"}]}
 * @param defaultFilter 支持 raw | html 等
 */
export const resolveVariableAndFilter = (
  path?: string,
  data: object = {},
  defaultFilter: string = '| raw',
  fallbackValue = (value: any) => value,
) => {
  if (!path || typeof path !== 'string') {
    return undefined;
  }

  try {
    const ast = parse(path, {
      evalMode: false,
      allowFilter: true,
    });

    const ret = new Evaluator(data, {
      defaultFilter,
    }).evalute(ast);

    return ret == null && !~path.indexOf('default') && !~path.indexOf('now') ? fallbackValue(ret) : ret;
  } catch (e) {
    console.warn(e);
    return undefined;
  }
};
