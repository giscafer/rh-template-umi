/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-07-11 00:29:48
 * @description 处理 action 副作用
 */

import { isFunction, noop } from 'lodash';
import { useEffect } from 'react';
import { Observer, Subject, Unsubscribable } from 'rxjs';

export type SubjectStateType = {
  /**
   * action type
   */
  action: string;
  /**
   * 数据
   */
  payload?: any;
};

type Listener = (state: SubjectStateType) => void;

export type RhObservable<T> = {
  next: (state: SubjectStateType) => void;
  take: (
    action: string | string[],
    cb: (state: SubjectStateType) => void,
  ) => void;
  subscribe(observer: Partial<Observer<T>>): Unsubscribable;
};

export const DefaultObservable = {
  take: (action: string | string[], cb: (state: SubjectStateType) => void) =>
    cb,
  next: (state: SubjectStateType) => state,
  subscribe: (observer?: any) => observer,
};

const actionMap = new Map<string, any>();

function useTable(workflow = noop) {
  const subject = new Subject();

  const actionObservable$: RhObservable<any> = {
    take: (action: string | string[], listener: Listener) => {
      if (Array.isArray(action)) {
        action.map((act) => actionMap.set(act, listener));
      } else {
        actionMap.set(action, listener);
      }
    },
    next: (state: SubjectStateType) => subject.next(state),
    subscribe: (observer?: any) => subject.subscribe(observer),
  };

  const subscribe$ = subject.subscribe((state: any) => {
    // 不支持1对多的情况
    const listener = actionMap.get(state?.action);
    if (listener && isFunction(listener)) {
      listener(state);
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

  return { actionObservable$ };
}

export default useTable;
