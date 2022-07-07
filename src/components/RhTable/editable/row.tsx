import { Form } from 'antd';
import { PropsWithChildren } from 'react';

type RowProps = {
  record: any;
  'data-row-index': string;
};

export default function EditableRow(props: PropsWithChildren<RowProps>) {
  const [form] = Form.useForm();

  const { record, ...rest } = props;

  return (
    <Form key={props['data-row-index']} form={form} component={false} initialValues={record}>
      <tr {...rest} />
    </Form>
  );
}
