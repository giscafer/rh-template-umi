import { RhObservable, SubjectStateType } from '@roothub/components/src/RhTable/hooks/useTable';
import { message } from 'antd';

/**
 * action workflow handle
 */
export default function workflow(observable: RhObservable<SubjectStateType>) {
  // 监听按钮
  observable.take('add', (state: SubjectStateType) => {
    // 处理按钮逻辑
    message.info('action=' + state.action);
  });
}
