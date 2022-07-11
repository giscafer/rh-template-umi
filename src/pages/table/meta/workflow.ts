import { RhObservable, SubjectStateType } from '@roothub/components/src/RhTable/hooks/useTable';
import { message } from 'antd';

/**
 * action workflow handle
 * TODO: 优化take函数action支持数组
 */
export default function workflow(observable: RhObservable<SubjectStateType>) {
  // 监听按钮
  observable.take('add', (state: SubjectStateType) => {
    // 处理按钮逻辑
    message.info('action=' + state.action);
  });
  observable.take('startAll', (state: SubjectStateType) => {
    message.info('action=' + state.action);
  });
  observable.take('stopAll', (state: SubjectStateType) => {
    message.info('action=' + state.action);
  });
  observable.take('batchStart', (state: SubjectStateType) => {
    message.info('action=' + state.action);
  });
  observable.take('batchStop', (state: SubjectStateType) => {
    message.info('action=' + state.action);
  });
}
