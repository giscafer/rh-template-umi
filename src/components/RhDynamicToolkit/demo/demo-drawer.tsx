import React from 'react';
import { RhDynamicDrawerForm } from '../form/index';
import formSchemaJson from './drawer.json';

function DemoRhDynamicDrawerForm() {
  return (
    <div className="m1 flex">
      <RhDynamicDrawerForm schema={formSchemaJson} text="新增" params={{ datasourceId: 'test111' }} />
      <RhDynamicDrawerForm
        className="ml1"
        schema={formSchemaJson}
        initialValues={{ propertyId: 'primaryIdxxxx', name: '属性名称test' }}
        text="编辑"
        params={{ datasourceId: 'test111' }}
      />
    </div>
  );
}

export default DemoRhDynamicDrawerForm;
