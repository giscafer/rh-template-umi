import { useRef, useState } from 'react';

export const waitTime = (time: number = 100) => {
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(true);
    }, time);
  });
};

export const tryRun = (job: { (): any; (): any; name: any }) => {
  try {
    return job();
  } catch (e) {
    console.warn(`try run ${job.name ?? 'unknown'} failed`, e);
    return null;
  }
};

export function useStateAndRef(init: any) {
  const [state, setState] = useState(init);
  const ref = useRef(state);
  ref.current = state;
  return [state, setState, ref];
}
