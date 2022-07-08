import { RhDynamicModalForm } from '../form';
import formSchemaJson from './form.json';

function DemoRhDynamicModalForm() {
  return (
    <div className="m1 flex">
      <RhDynamicModalForm
        schema={formSchemaJson}
        text="新增 modal form"
        params={{ datasourceId: 'test111' }}
      />
    </div>
  );
}

export default DemoRhDynamicModalForm;
