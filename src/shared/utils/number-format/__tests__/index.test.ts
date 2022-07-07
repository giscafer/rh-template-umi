import { numberFormat } from '../index';

describe('numberFormat', () => {
  describe('format', () => {
    it('直接使用', () => {
      const result = numberFormat().format(123456);
      expect(result).toEqual('123,456');
    });

    it('不使用千分符', () => {
      const result = numberFormat({ thousandSeparator: false }).format(123456);
      expect(result).toEqual('123456');
    });

    it(`千分符设置为 '*'`, () => {
      const result = numberFormat({ thousandSeparator: '*' }).format(123456);
      expect(result).toEqual('123*456');
    });

    it('负数', () => {
      const result = numberFormat().format(-123456);
      expect(result).toEqual('-123,456');
    });

    it('精度', () => {
      const result = numberFormat({ precision: 2 }).format(123456.789);
      expect(result).toEqual('123,456.78');
    });

    it(`添加前缀`, () => {
      const result = numberFormat({ prefix: '$' }).format(123456);
      expect(result).toEqual('$123,456');
    });

    it(`添加后缀`, () => {
      const result = numberFormat({ suffix: '/100' }).format(98);
      expect(result).toEqual('98/100');
    });

    it(`使用模板`, () => {
      const result = numberFormat({ template: '## [##]' }).format(123456);
      expect(result).toEqual('12 [34]');
    });
  });
});
