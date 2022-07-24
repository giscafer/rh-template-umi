import { RhObservable, SubjectAction } from '@roothub/components/src/RhTable/hooks/useTable';
import { message } from 'antd';

/**
 * action workflow handle
 * 只需要关注“拿”还是“放”
 * put: 放。设置状态
 * take: 拿，取。监听action
 */
export default function workflow(actionObservable$: RhObservable<SubjectAction>) {
  const handleDrawerVisible = (payload = {}) => actionObservable$.put({ type: '$merge', payload });
  const refreshTable = () => actionObservable$.put({ type: '$table/refresh' });

  // 监听按钮action
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  actionObservable$.take('add', (action: SubjectAction) => {
    // 显示简单drawer弹窗
    handleDrawerVisible({ drawerSimpleVisible: true });
  });
  actionObservable$.take('add-complex', () => {
    // 显示复杂drawer弹窗
    handleDrawerVisible({ drawerComplexVisible: true });
  });
  // 批量订阅 toolbar 的 action 数组
  actionObservable$.take(['startAll', 'stopAll', 'batchStart', 'batchStop'], (action: SubjectAction) => {
    message.info('action=' + action.type);
  });
  // 批量订阅 optionActions 数组
  actionObservable$.take(['edit', 'copy', 'delete'], (action: SubjectAction) => {
    message.info('optionActions=' + action.type);
  });

  // 类似hooks的方式返回
  return {
    refreshTable,
    hideDrawer: handleDrawerVisible,
  };
}
