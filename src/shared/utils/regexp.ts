// 常见正则：https://fjy128.github.io/blog/blog/node/regExp

// 不能含中文(文件名、英文备注输入、接口地址等)
export const noChineseCodeReg = /^[_a-zA-Z/][-_a-zA-Z0-9]*([/]*[\.]*[-_a-zA-Z0-9])*$/;
// 只能含中文
export const onlyChineseCodeReg =
  /(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+$/;
// 含中文
export const containChineseReg =
  /(?:[\u3400-\u4DB5\u4E00-\u9FEA\uFA0E\uFA0F\uFA11\uFA13\uFA14\uFA1F\uFA21\uFA23\uFA24\uFA27-\uFA29]|[\uD840-\uD868\uD86A-\uD86C\uD86F-\uD872\uD874-\uD879][\uDC00-\uDFFF]|\uD869[\uDC00-\uDED6\uDF00-\uDFFF]|\uD86D[\uDC00-\uDF34\uDF40-\uDFFF]|\uD86E[\uDC00-\uDC1D\uDC20-\uDFFF]|\uD873[\uDC00-\uDEA1\uDEB0-\uDFFF]|\uD87A[\uDC00-\uDFE0])+/;
// url
export const urlReg =
  // eslint-disable-next-line no-useless-escape
  /^(((ht|f)tps?):\/\/)?[\w-]+(\.[\w-]+)+([\w.,@?^=%&:/~+#-\(\)]*[\w@?^=%&/~+#-\(\)])?$/;

// 只能输入字母、数字和下划线，不能以数字开头
export const accountReg = /^[a-zA-Z][a-zA-Z0-9_]*$/;

// ip
export const ipReg =
  /^((\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])\.){3}(\d|[1-9]\d|1\d\d|2[0-4]\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$/;

export const ipRegString =
  '^((\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])\\.){3}(\\d|[1-9]\\d|1\\d\\d|2[0-4]\\d|25[0-5])(?::(?:[0-9]|[1-9][0-9]{1,3}|[1-5][0-9]{4}|6[0-4][0-9]{3}|65[0-4][0-9]{2}|655[0-2][0-9]|6553[0-5]))?$';

// 数字
export const numberReg = /^\d{1,}$/;
// 正负整数
export const integerReg = /^-?[0-9]\d*$/;

// 数据源编码：数字、字母、下划线、_和- 组成
export const numberNoReg = /[a-zA-Z0-9_-]{2,64}$/;
// 字母开头，下划线和横杆
export const letterNumberNoReg = /^[a-zA-Z][a-zA-Z0-9_-]{2,64}$/;
