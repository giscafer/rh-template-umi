/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-11 00:29:48
 * @description 处理 action 副作用
 */

import { assign, cloneDeep, isFunction, merge, noop } from 'lodash';
import { useEffect, useState } from 'react';
import { map, Observer, Subject, Unsubscribable } from 'rxjs';
import { useObservable } from 'rxjs-hooks';

export type SubjectAction = {
  /**
   * action type
   */
  type: string;
  /**
   * 数据
   */
  payload?: any;
};

type Listener = (state: SubjectAction) => void;

export type RhObservable<T> = {
  next: (action: SubjectAction) => void;
  take: (
    action: string | string[],
    cb: (action: SubjectAction) => void,
  ) => void;
  put: (actionState: SubjectAction) => void;
  subscribe(observer: Partial<Observer<T>>): Unsubscribable;
};

export const DefaultObservable = {
  put: (actionState: SubjectAction) => actionState,
  take: (action: string | string[], cb: (actionState: SubjectAction) => void) =>
    cb,
  next: (actionState: SubjectAction) => actionState,
  subscribe: (observer?: any) => observer,
};

function useTable(workflow = noop) {
  const [tableState, setTableState] = useState<Record<string, any>>({});
  const subject = new Subject();
  const actionMap = new Map<string, any>();

  const actionObservable$: RhObservable<any> = {
    take: (action: string | string[], listener: Listener) => {
      if (Array.isArray(action)) {
        action.map((act) => actionMap.set(act, listener));
      } else {
        actionMap.set(action, listener);
      }
    },
    put: (actionState) => {
      const { type = '$merge' } = actionState;
      let payload = actionState.payload ?? {};
      if (typeof payload !== 'object') {
        payload = {};
      }
      let newSate = cloneDeep(tableState);
      if (type === '$merge') {
        setTableState(merge(newSate, payload));
      }
      if (type === '$assign') {
        setTableState(assign(newSate, payload));
      }
      if (type === '$set') {
        newSate = { ...payload };
        setTableState(newSate);
      }
    },
    next: (actionState: SubjectAction) => subject.next(actionState),
    subscribe: (observer?: any) => subject.subscribe(observer),
  };

  const subscribe$ = subject.subscribe((actionState: any) => {
    // 不支持1对多的情况
    const listener = actionMap.get(actionState?.type);
    if (listener && isFunction(listener)) {
      listener(actionState);
    }
  });

  useEffect(() => {
    if (isFunction(workflow)) {
      workflow(actionObservable$);
    }
    return () => {
      actionMap.clear();
      subscribe$.unsubscribe();
    };
  }, [workflow]);

  // tableState 可观察数据流
  const state$: Record<string, any> = useObservable(
    (_, inputs$) => inputs$.pipe(map(([v]) => v)),
    {},
    [tableState],
  );

  return { state$, actionObservable$ };
}

export default useTable;
