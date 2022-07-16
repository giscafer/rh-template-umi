export interface Separators {
  thousandSeparator: string;
  decimalSeparator: string;
}

export interface FormatConfig {
  /**
   * 千分位分隔符
   * @default true
   */
  thousandSeparator?: boolean | string;
  /**
   * 设置小数点
   * @default .
   */
  decimalSeparator?: string;
  /**
   * 数值精度
   */
  precision?: number;
}

export interface Options extends FormatConfig {
  /**
   * 设置数值的前缀
   */
  prefix?: string;
  /**
   * 设置数值的后缀
   */
  suffix?: string;
  /**
   * 格式化的模板
   */
  template?: string;
  /**
   * 允许负数
   * @default true
   */
  allowNegative?: boolean;
}
