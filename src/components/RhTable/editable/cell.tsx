/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-04 13:59:11
 * @description 表格可编辑
 */

import { RhDynamicFormItem } from '@/components/RhDynamicToolkit/form';
import { isNumberType } from '@/components/RhDynamicToolkit/utils';
import { Form, message } from 'antd';
import { get, isNumber, merge, noop, omit, set } from 'lodash';
import { PropsWithChildren, ReactNode, useMemo, useState } from 'react';

type CellProps = {
  title: string;
  children: ReactNode | ReactNode[];
  quickEdit: Record<string, any>;
  dataIndex: string | string[];
  record: Record<string, any>;
  onSave: (record: Record<string, any>) => void;
};

export default function EditableCell(props: PropsWithChildren<CellProps>) {
  const form = Form.useFormInstance();
  const [isEditing, setEditing] = useState(false);

  const { quickEdit, title, dataIndex, record, onSave = noop, ...rest } = props;
  const allowInput = isEditing && quickEdit;

  const onBlurCapture = async () => {
    try {
      const fieldsValue = await form.validateFields();
      setEditing(false);
      const val = get(fieldsValue, dataIndex);

      // eslint-disable-next-line eqeqeq
      if (val == get(record, dataIndex)) {
        // 同样的值不走接口（含字符串数值和number）
        return;
      }
      const newRow = merge({}, record);
      if (isNumberType(quickEdit.dataType)) {
        const numVal = isNumber(Number(val)) ? Number(val) : val;
        set(newRow, dataIndex, numVal);
      } else {
        set(newRow, dataIndex, val);
      }
      onSave(newRow);
    } catch (err) {
      const errors = err?.errorFields[0]?.errors || [];
      message.error(title + errors[0] ?? '未知错误');
    }
  };
  const toggleEdit = () => {
    if (!isEditing) {
      setEditing(true);
    }
  };

  const input = useMemo(() => {
    if (dataIndex) {
      return (
        <RhDynamicFormItem widgetProps={{ id: dataIndex, ...quickEdit }} autoFocus={true} className="fixedError" />
      );
    }
    return null;
  }, [dataIndex, quickEdit]);

  if (quickEdit) {
    return (
      <td {...omit(rest)} onBlurCapture={onBlurCapture} onDoubleClick={toggleEdit}>
        <div className={isEditing ? '' : 'editable-border'}>{allowInput ? input : props.children}</div>
      </td>
    );
  }
  return <td {...rest}>{props.children}</td>;
}
