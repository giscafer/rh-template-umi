# RhStorage

- 封装 RhStorage，方便对 LocalStorage 和 SessionStorage 的统一使用和管理
- 解决微前端下，同域缓存覆盖问题

## 🔨 使用

> 见测试文件

```ts
// 默认导出的 storage 为 localStorage，如果需要使用 sessionStorage或者自定义前缀参数等，用 new RhStorage
import storage, { RhStorage } from '../index';

describe('numberFormat', () => {
  describe('set&get', () => {
    it('value type is Number', () => {
      storage.set('a', 123456);
      const result = storage.get('a');
      expect(result).toEqual(123456);
    });
    it('value type is String', () => {
      storage.set('domain', 'giscafer.com');
      const result = storage.get('domain');
      expect(result).toEqual('giscafer.com');
    });
    it('value type is Object', () => {
      const obj = {
        name: 'giscafer',
      };
      storage.set('objKey', obj);
      const result = storage.get('objKey');
      expect(result.name).toEqual('giscafer');
    });
    it('value type is Array', () => {
      storage.set('arrKey', '123456'.split(''));
      const result = storage.get('arrKey');
      expect(result[1]).toEqual('2');
    });
  });

  describe('has', () => {
    it('has key', () => {
      storage.set('giscafer', 'giscafer');
      const hasKey = storage.has('giscafer');
      expect(hasKey).toBeTruthy();
    });
    it('not has key', () => {
      const hasKey = storage.has('giscafer1');
      expect(hasKey).toBeFalsy();
    });
  });

  describe('remove', () => {
    it('remove key', () => {
      storage.set('giscafer', 'giscafer');
      storage.remove('giscafer');
      const hasKey = storage.has('giscafer');
      expect(hasKey).toBeFalsy();
    });
  });

  describe('clear', () => {
    it('clear', () => {
      storage.set('b', 'bbb');
      storage.clear();
      const hasKey = storage.has('b');
      expect(hasKey).toBeFalsy();
    });
  });

  describe('expires', () => {
    it('expires working', () => {
      const s = new RhStorage({ expires: 1 });
      s.set('c', 'ccc');
      const result = s.get('c');
      expect(result).toEqual('ccc');
      setTimeout(() => {
        const result1 = storage.get('c');
        expect(result1).toBeNull();
      }, 2000);
    });
  });

  describe('prefix', () => {
    it('prefix working', () => {
      const s = new RhStorage({ prefix: 'cg_' });
      s.set('url', 'http://giscafer.com');
      const hasUrl = s.has('url');
      expect(hasUrl).toBeTruthy();
      expect(s.prefix).toEqual('cg_');
    });
  });
});
```
