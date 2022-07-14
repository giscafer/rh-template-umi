import { ButtonType } from 'antd/es/button';
import { BaseButtonProps } from 'antd/lib/button/button';

interface BooleanGetter {
  (...arg: any[]): boolean;
}

export type RhActionMeta = {
  name: string;
  action: string;
  /**
   * 按钮类型
   * @type ButtonType
   */
  type?: string & ButtonType;
  /**
   * 超链接&模板url，用来快速跳转页面
   */
  link?: string;
  /**
   * 超链接&模板url 跳转页面时是否为新开弹窗
   */
  targetBlank?: boolean;
  isMore?: boolean;
  visibleOn?: string | boolean | BooleanGetter;
  disabledOn?: string | boolean | BooleanGetter;
  className?: string;
  children?: any[];
} & Omit<BaseButtonProps, 'key' | 'children' | 'type'>;

export type CommonApiType = {
  /**
   * 列表分页请求接口 url，支持restful 和参数模板
   * eg: https://giscafer.com/post/${postId}/detail
   */
  api?: string;
  /**
   * api参数
   * eg: { "postId": 123 }
   * 最后请求 api url 解析为：https://giscafer.com/post/123/detail
   */
  apiParams?: Record<string, string | number>;
  /**
   * 接口请求方式 GET 或 POST
   * @default 'GET'
   */
  apiMethod?: string;
  /**
   * 接口请求参数
   */
  params?: Record<string, any>;
};
