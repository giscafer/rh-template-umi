import { evaluate } from 'amis-formula';
import moment from 'moment';

const defaultContext = {
  a: 1,
  b: 2,
  c: 3,
  d: 4,
  e: 5,
};

function evalFormula(expression: string, data: any = defaultContext) {
  return evaluate(expression, data, {
    evalMode: true,
  });
}

test('formula:expression', () => {
  expect(evalFormula('a + 3')).toBe(4);
  expect(evalFormula('b * 3')).toBe(6);
  expect(evalFormula('b * 3 + 4')).toBe(10);
  expect(evalFormula('c * (3 + 4)')).toBe(21);
  expect(evalFormula('d / (a + 1)')).toBe(2);
  expect(evalFormula('5 % 3')).toBe(2);
  expect(evalFormula('3 | 4')).toBe(7);
  expect(evalFormula('4 ^ 4')).toBe(0);
  expect(evalFormula('4 ^ 4')).toBe(0);
  expect(evalFormula('4 & 4')).toBe(4);
  expect(evalFormula('4 & 3')).toBe(0);
  expect(evalFormula('~-1')).toBe(0);
  expect(evalFormula('!!1')).toBe(true);
  expect(evalFormula('!!""')).toBe(false);
  expect(evalFormula('1 || 2')).toBe(1);
  expect(evalFormula('1 && 2')).toBe(2);
  expect(evalFormula('1 && 2 || 3')).toBe(2);
  expect(evalFormula('1 || 2 || 3')).toBe(1);
  expect(evalFormula('1 || 2 && 3')).toBe(1);
  expect(evalFormula('(1 || 2) && 3')).toBe(3);
  expect(evalFormula('1 == "1"')).toBe(true);
  expect(evalFormula('1 === "1"')).toBe(false);
  expect(evalFormula('1 < 1')).toBe(false);
  expect(evalFormula('1 <= 1')).toBe(true);
  expect(evalFormula('1 > 1')).toBe(false);
  expect(evalFormula('1 >= 1')).toBe(true);
  expect(evalFormula('3 >> 1')).toBe(1);
  expect(evalFormula('3 << 1')).toBe(6);
  expect(evalFormula('10 ** 3')).toBe(1000);

  expect(evalFormula('10 ? 3 : 2')).toBe(3);
  expect(evalFormula('0 ? 3 : 2')).toBe(2);
});

test('formula:expression2', () => {
  expect(evalFormula('a[0]', { a: [1, 2, 3] })).toBe(1);
  expect(evalFormula('a[b]', { a: [1, 2, 3], b: 1 })).toBe(2);
  expect(evalFormula('a[b - 1]', { a: [1, 2, 3], b: 1 })).toBe(1);
  expect(evalFormula('a[b ? 1 : 2]', { a: [1, 2, 3], b: 1 })).toBe(2);
  expect(evalFormula('a[c ? 1 : 2]', { a: [1, 2, 3], b: 1 })).toBe(3);
});

test('formula:if', () => {
  expect(evalFormula('IF(true, 2, 3)')).toBe(2);
  expect(evalFormula('IF(false, 2, 3)')).toBe(3);
  expect(evalFormula('IF(false, 2, IF(true, 3, 4))')).toBe(3);
});

test('formula:and', () => {
  expect(!!evalFormula('AND(0, 1)')).toBe(false);
  expect(!!evalFormula('AND(1, 1)')).toBe(true);
  expect(!!evalFormula('AND(1, 1, 1, 0)')).toBe(false);
});

test('formula:or', () => {
  expect(!!evalFormula('OR(0, 1)')).toBe(true);
  expect(!!evalFormula('OR(1, 1)')).toBe(true);
  expect(!!evalFormula('OR(1, 1, 1, 0)')).toBe(true);
  expect(!!evalFormula('OR(0, 0, 0, 0)')).toBe(false);
});

test('formula:xor', () => {
  expect(evalFormula('XOR(0, 1)')).toBe(false);
  expect(evalFormula('XOR(1, 0)')).toBe(false);
  expect(evalFormula('XOR(1, 1)')).toBe(true);
  expect(evalFormula('XOR(0, 0)')).toBe(true);
});

test('formula:ifs', () => {
  expect(!!evalFormula('IFS(0, 1, 2)')).toBe(true);
  expect(!!evalFormula('IFS(0, 1, 2, 2, 3)')).toBe(true);
  expect(!!evalFormula('IFS(0, 1, 0, 2, 0)')).toBe(false);
});
test('formula:math', () => {
  expect(evalFormula('ABS(1)')).toBe(1);
  expect(evalFormula('ABS(-1)')).toBe(1);
  expect(evalFormula('ABS(0)')).toBe(0);

  expect(evalFormula('MAX(1, -1, 2, 3, 5, -9)')).toBe(5);
  expect(evalFormula('MIN(1, -1, 2, 3, 5, -9)')).toBe(-9);

  expect(evalFormula('MOD(3, 2)')).toBe(1);

  expect(evalFormula('PI()')).toBe(Math.PI);

  expect(evalFormula('ROUND(3.5)')).toBe(4);
  expect(evalFormula('ROUND(3.4)')).toBe(3);

  expect(evalFormula('ROUND(3.456789, 2)')).toBe(3.46);
  expect(evalFormula('CEIL(3.456789)')).toBe(4);
  expect(evalFormula('FLOOR(3.456789)')).toBe(3);

  expect(evalFormula('SQRT(4)')).toBe(2);
  expect(evalFormula('AVG(4, 6, 10, 10, 10)')).toBe(8);

  // 示例来自 https://support.microsoft.com/zh-cn/office/devsq-%E5%87%BD%E6%95%B0-8b739616-8376-4df5-8bd0-cfe0a6caf444
  expect(evalFormula('DEVSQ(4,5,8,7,11,4,3)')).toBe(48);
  // 示例来自 https://support.microsoft.com/zh-cn/office/avedev-%E5%87%BD%E6%95%B0-58fe8d65-2a84-4dc7-8052-f3f87b5c6639
  expect(evalFormula('ROUND(AVEDEV(4,5,6,7,5,4,3), 2)')).toBe(1.02);
  // 示例来自 https://support.microsoft.com/zh-cn/office/harmean-%E5%87%BD%E6%95%B0-5efd9184-fab5-42f9-b1d3-57883a1d3bc6
  expect(evalFormula('ROUND(HARMEAN(4,5,8,7,11,4,3), 3)')).toBe(5.028);

  expect(evalFormula('LARGE([1,3,5,4,7,6], 3)')).toBe(5);
  expect(evalFormula('LARGE([1,3,5,4,7,6], 1)')).toBe(7);

  expect(evalFormula('UPPERMONEY(7682.01)')).toBe('柒仟陆佰捌拾贰元壹分');
  expect(evalFormula('UPPERMONEY(7682)')).toBe('柒仟陆佰捌拾贰元整');

  // 非数字类型转换是否正常？
  expect(evalFormula('"3" + "3"')).toBe(6);
  expect(evalFormula('"3" - "3"')).toBe(0);
  expect(evalFormula('AVG(4, "6", "10", 10, 10)')).toBe(8);
});

test('formula:text', () => {
  expect(evalFormula('LEFT("abcdefg", 2)')).toBe('ab');
  expect(evalFormula('RIGHT("abcdefg", 2)')).toBe('fg');
  expect(evalFormula('LENGTH("abcdefg")')).toBe(7);
  expect(evalFormula('LEN("abcdefg")')).toBe(7);
  expect(evalFormula('ISEMPTY("abcdefg")')).toBe(false);
  expect(evalFormula('ISEMPTY("")')).toBe(true);
  expect(evalFormula('CONCATENATE("a", "b", "c", "d")')).toBe('abcd');
  expect(evalFormula('CHAR(97)')).toBe('a');
  expect(evalFormula('LOWER("AB")')).toBe('ab');
  expect(evalFormula('UPPER("ab")')).toBe('AB');
  expect(evalFormula('SPLIT("a,b,c")')).toMatchObject(['a', 'b', 'c']);
  expect(evalFormula('TRIM("  ab ")')).toBe('ab');
  expect(evalFormula('STARTSWITH("xab", "ab")')).toBe(false);
  expect(evalFormula('STARTSWITH("xab", "x")')).toBe(true);
  expect(evalFormula('ENDSWITH("xab", "x")')).toBe(false);
  expect(evalFormula('ENDSWITH("xab", "b")')).toBe(true);
  expect(evalFormula('UPPERFIRST("xab")')).toBe('Xab');
  expect(evalFormula('PADSTART("5", 3, "0")')).toBe('005');
  expect(evalFormula('PADSTART(5, 3, 0)')).toBe('005');
  expect(evalFormula('CAPITALIZE("star")')).toBe('Star');
  expect(evalFormula('ESCAPE("&")')).toBe('&amp;');
  expect(evalFormula('TRUNCATE("amis.baidu.com", 7)')).toBe('amis...');
  expect(evalFormula('BEFORELAST("amis.baidu.com", ".")')).toBe('amis.baidu');
  expect(evalFormula('BEFORELAST("amis", ".")')).toBe('amis');
  expect(evalFormula('STRIPTAG("<b>amis</b>")')).toBe('amis');
  expect(evalFormula('LINEBREAK("am\nis")')).toBe('am<br/>is');
  expect(evalFormula('CONTAINS("xab", "x")')).toBe(true);
  expect(evalFormula('CONTAINS("xab", "b")')).toBe(true);
  expect(evalFormula('REPLACE("xabab", "ab", "cd")')).toBe('xcdcd');
  expect(evalFormula('SEARCH("xabab", "ab")')).toBe(1);
  expect(evalFormula('SEARCH("xabab", "cd")')).toBe(-1);
  expect(evalFormula('SEARCH("xabab", "ab", 2)')).toBe(3);
  expect(evalFormula('MID("xabab", 2, 2)')).toBe('ba');
});

test('formula:date', () => {
  expect(evalFormula('TIMESTAMP(DATE(2021, 11, 21, 0, 0, 0), "x")')).toBe(
    new Date(2021, 11, 21, 0, 0, 0).getTime(),
  );
  expect(
    evalFormula('DATETOSTR(DATE(2021, 11, 21, 0, 0, 0), "YYYY-MM-DD")'),
  ).toBe('2021-12-21');
  expect(evalFormula('DATETOSTR(DATE("2021-12-21"), "YYYY-MM-DD")')).toBe(
    '2021-12-21',
  );
  expect(evalFormula('DATETOSTR(TODAY(), "YYYY-MM-DD")')).toBe(
    moment().format('YYYY-MM-DD'),
  );
  expect(evalFormula('DATETOSTR(NOW(), "YYYY-MM-DD")')).toBe(
    moment().format('YYYY-MM-DD'),
  );
  expect(evalFormula('YEAR(STRTODATE("2021-10-24 10:10:10"))')).toBe(2021);
});

test('formula:last', () => {
  expect(evalFormula('LAST([1, 2, 3])')).toBe(3);
});

test('formula:basename', () => {
  expect(evalFormula('BASENAME("/home/amis/a.json")')).toBe('a.json');
});
