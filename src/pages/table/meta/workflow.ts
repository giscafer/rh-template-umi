import { RhObservable, SubjectStateType } from '@roothub/components/src/RhTable/hooks/useTable';
import { message } from 'antd';

/**
 * action workflow handle
 * TODO: 优化take函数action支持数组
 */
export default function workflow(actionObservable$: RhObservable<SubjectStateType>) {
  // 监听按钮action
  actionObservable$.take('add', (state: SubjectStateType) => {
    // 处理按钮逻辑
    message.info('action=' + state.action);
  });
  // 批量订阅 action 数组
  actionObservable$.take(['startAll', 'stopAll', 'batchStart', 'batchStop'], (state: SubjectStateType) => {
    message.info('action=' + state.action);
  });
}
