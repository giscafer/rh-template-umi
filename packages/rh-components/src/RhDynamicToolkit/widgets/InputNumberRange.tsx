import { ProFormDigitRange } from '@ant-design/pro-components';

function InputNumberRange({
  form,
  separator,
  separatorWidth = 60,
  fieldProps,
  ...restProps
}) {
  /*   const handleChange = useCallback(
    (e) => {
      console.log('InputNumberRange====================================');
      console.log(e, restProps.transform);
      console.log('====================================');
      if (restProps.transform) {
        const tFields = restProps.transform.split(',');
        if (tFields.length === 2) {
          form.setFieldsValue({ [tFields[0]]: e[0] });
          form.setFieldsValue({ [tFields[1]]: e[1] });
        } else {
          console.error(`${restProps.dataIndex}的transform应该是两个字段逗号间隔`);
        }

        console.log(form.getFieldsValue(), { [tFields[0]]: e[0] });
      }
    },
    [form, restProps.dataIndex, restProps.transform],
  );
 */

  return (
    <ProFormDigitRange
      separator={separator}
      separatorWidth={separatorWidth}
      {...restProps}
      fieldProps={fieldProps}
    />
  );
}

export default InputNumberRange;
