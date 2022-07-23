import { RhDynamicDrawerForm, RhDynamicModalForm } from '@roothub/components';
import { Button, Divider } from 'antd';
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import simpleJson from '../../table/meta/simple.json';
import formJson from '../form.json';

export default function DynamicForm() {
  const [drawerVisible, setDrawerVisible] = useState(false);

  const navigate = useNavigate();

  return (
    <div className="p2">
      <p>同一个json，可以用三种 form 组件展示</p>
      <Divider />
      <RhDynamicModalForm text="Modal Form" schema={simpleJson} />
      <Divider />
      <Button type="primary" onClick={() => setDrawerVisible(!drawerVisible)}>
        Drawer Form
      </Button>
      <Divider />
      <Button type="primary" ghost onClick={() => navigate('/dynamic/page-form')}>
        单页Form
      </Button>
      {/* RhDynamicDrawerForm 也可以像 Modal Form 那么写，行为和 ProDrawerForm 一致 */}
      <RhDynamicDrawerForm visible={drawerVisible} schema={formJson} onClose={() => setDrawerVisible(false)} />
    </div>
  );
}
