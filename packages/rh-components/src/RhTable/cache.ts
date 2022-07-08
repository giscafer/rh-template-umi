/**
 * @author giscafer
 * @email giscafer@outlook.com
 * @created 2022-06-06 19:01:38
 * @description 缓存列设置（临时方案）
 * 缺陷：无版本控制，临时存储sessionStorage
 */

import { sessionStore } from '@roothub/shared/storage';
import { intersection, map } from 'lodash';
import { useCallback, useState } from 'react';

const toPlainObject = (obj) => {
  const keys = Object.keys(obj);
  const result = {};
  keys.forEach((key) => {
    if (!obj[key]?.$$typeof && typeof obj[key] !== 'function') {
      result[key] = obj[key];
    }
  });
  return result;
};

const convertPlainObjArr = (arr) => {
  return arr.map((item) => {
    return toPlainObject(item);
  });
};

export default function useColumnCache(id, columns) {
  const [cache, setCache] = useState(() => {
    if (!id) {
      console.log('RhTable id is empty, column settings are not available');
      return columns;
    }
    const cache = sessionStore.get(id);
    const initCache = sessionStore.get(`${id}_init`);
    const plainColumn = convertPlainObjArr(columns);

    if (cache && initCache) {
      const initCacheKeys = map(initCache, 'dataIndex');
      const columnsKeys = map(columns, 'dataIndex');
      // 如果初始缓存的key不包含当前的key（column配置项代码变动过），则更新缓存
      const diffKeys = intersection(initCacheKeys, columnsKeys);

      if (diffKeys.length !== columnsKeys.length) {
        sessionStore.set(`${id}_init`, plainColumn);
        sessionStore.set(id, plainColumn);
      }
    } else {
      //  首次渲染
      sessionStore.set(`${id}_init`, plainColumn);
      sessionStore.set(id, plainColumn);
    }
    return cache || plainColumn;
  });

  // debug
  /*   useEffect(() => {
    console.log('useColumnCache', cache);
  }, [cache]); */

  // 恢复默认
  const clearColumnCache = useCallback(() => {
    const initCache = sessionStore.get(`${id}_init`);
    // console.log('clearColumnCache', initCache);

    if (initCache) {
      sessionStore.set(id, initCache);
      setCache(initCache);
    }
  }, [id]);

  const setColumnCache = useCallback(
    (value) => {
      setCache(convertPlainObjArr(value));
      sessionStore.set(id, convertPlainObjArr(value));
    },
    [id],
  );

  return { columnCache: cache, setColumnCache, clearColumnCache };
}
