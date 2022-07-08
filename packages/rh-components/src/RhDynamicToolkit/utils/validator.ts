/**
 * 根据字段配置生成校验器
 * @param fieldProps 字段配置
 * @returns Rules antd 的校验规则
 * https://ant.design/components/form-cn/#Rule
 */

import { isNaN, isNil } from 'lodash';
import { evalFormula } from './formula';
import { isNotEmpty } from './index';

const getMessage = (fieldProps: AnyObject) => {
  return `${
    ['text', 'textarea', 'input'].includes(
      fieldProps.valueType || fieldProps.renderType,
    )
      ? '请输入'
      : '请选择'
  }${fieldProps.title || fieldProps.label || ''}`;
};

/**
 * 生成自定义验证器
 * @param fieldProps
 * @returns Promise.reject 代替 throw new Error，不然正则有奇怪不起作用的bug
 */
export function genValidatorRules(fieldProps: AnyObject) {
  const { validator = [] } = fieldProps;
  const rules = fieldProps.rules || [];
  if (fieldProps.required) {
    rules.push({
      required: true,
      message: getMessage(fieldProps),
    });
  }
  // 自定义validator 校验
  if (validator && validator.length > 0) {
    for (const item of validator) {
      const { type, value, message } = item;

      if (isNil(value)) {
        console.error(`${fieldProps.id}的validator配置中的value不能为空`);
      }
      // 正则
      if (type === 'pattern') {
        const validatorFunc = async (rule, v: string) => {
          try {
            const reg = new RegExp(value);
            let flag = !reg.test(v);
            // validateFirst 有bug，先临时解决
            if (fieldProps.required) {
              flag = flag && isNotEmpty(v);
            }

            if (flag) {
              return Promise.reject(`${message || '格式不正确'}`);
            }
            return;
          } catch (e) {
            return;
          }
        };
        rules.push({
          validator: validatorFunc,
        });
      }
      // 数值区间 range
      if (type === 'range') {
        const validatorFunc = async (rule, v: string) => {
          if (typeof v === 'undefined') return;

          let flag = v < value[0] || v > value[1] || isNaN(Number(v));
          // validateFirst 有bug，先临时解决
          if (fieldProps.required) {
            flag = flag && isNotEmpty(v);
          }
          if (flag) {
            return Promise.reject(
              `${message || `请输入${value[0]}~${value[1]}之间的数字`}`,
            );
          }
          return;
        };
        rules.push({
          validator: validatorFunc,
        });
      }
      if (type === 'min') {
        const validatorFunc = async (rule, v: number) => {
          if (typeof v === 'undefined') return;
          let flag = v < value || isNaN(Number(v));
          // validateFirst 有bug，先临时解决
          if (fieldProps.required) {
            flag = flag && isNotEmpty(v);
          }
          if (flag) {
            return Promise.reject(
              `${message || `请输入大于等于${value}的数字`}`,
            );
          }
          return;
        };
        rules.push({
          validator: validatorFunc,
        });
      }
      if (type === 'max') {
        const validatorFunc = async (rule, v: number) => {
          if (typeof v === 'undefined') return;
          let flag = v > value || isNaN(Number(v));
          // validateFirst 有bug，先临时解决
          if (fieldProps.required) {
            flag = flag && isNotEmpty(v);
          }
          if (flag) {
            return Promise.reject(
              `${message || `请输入小于等于${value}的数字`}`,
            );
          }
          return;
        };
        rules.push({
          validator: validatorFunc,
        });
      }
      if (type === 'maxLength') {
        const validatorFunc = async (rule, v: string) => {
          if (typeof v === 'undefined') return;
          let flag = v.length > value;
          // validateFirst 有bug，先临时解决
          if (fieldProps.required) {
            flag = flag && isNotEmpty(v);
          }
          if (flag) {
            return Promise.reject(`${message || `请输入${value}个字符以内`}`);
          }
          return;
        };
        rules.push({
          validator: validatorFunc,
        });
      }
      if (type === 'expression') {
        const dynRule = (form) => {
          return {
            async validator(rule, v: string) {
              if (typeof v === 'undefined') return;
              let flag = !evalFormula(value, {
                ...form.getFieldsValue(),
                value: v,
              });
              // validateFirst 有bug，先临时解决
              if (fieldProps.required) {
                flag = flag && isNotEmpty(v);
              }
              if (flag) {
                return Promise.reject(
                  `${message || `请输入${value}个字符以内`}`,
                );
              }
              return;
            },
          };
        };
        rules.push(dynRule);
      }
      // 废弃规则，统一采用Formula表达式
      if (type === 'js') {
        const dynRule = (form) => {
          return {
            async validator(rule, v: string) {
              if (typeof v === 'undefined') return;
              try {
                // eslint-disable-next-line no-new-func
                const fn = new Function(
                  'k',
                  'v',
                  'vals',
                  `return (${value})(k, v, vals)`,
                );
                const final = await fn(fieldProps.id, v, form.getFieldsValue());
                if (!final) return Promise.reject(message ?? '自定义校验失败');
              } catch (e) {
                return Promise.reject(e.message ?? '自定义校验失败');
              }
              return;
            },
          };
        };
        rules.push(dynRule);
      }
    }
  }

  return rules;
}
