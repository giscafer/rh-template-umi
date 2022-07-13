import { RhObservable, SubjectAction } from '@roothub/components/src/RhTable/hooks/useTable';
import { message } from 'antd';

/**
 * action workflow handle
 */
export default function workflow(actionObservable$: RhObservable<SubjectAction>) {
  // 监听按钮action
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  actionObservable$.take('add', (action: SubjectAction) => {
    // 设置state
    actionObservable$.put({
      type: '$merge',
      payload: { drawerVisible: true },
    });
  });
  // 批量订阅 action 数组
  actionObservable$.take(['startAll', 'stopAll', 'batchStart', 'batchStop'], (action: SubjectAction) => {
    message.info('action=' + action.type);
  });
  // 批量订阅 tableAction 数组
  actionObservable$.take(['edit', 'copy', 'delete'], (action: SubjectAction) => {
    message.info('action=' + action.type);
  });
}
