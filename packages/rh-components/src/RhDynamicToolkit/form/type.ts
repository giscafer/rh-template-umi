/**
 * @author giscafer
 * @homepage http://giscafer.com
 * @created 2022-06-21 20:41:05
 * @description 规范定义，但目前表单封装比较简单还未增强，基本都是业务需求渐进增强
 */

export interface FormHorizontal {
  left?: number;
  right?: number;
  leftFixed?: boolean | number | 'xs' | 'sm' | 'md' | 'lg';
  justify?: boolean; // 两端对齐
  labelAlign?: 'left' | 'right'; // label对齐方式
  /** label自定义宽度，默认单位为px */
  labelWidth?: number | string;
}

export interface BaseApiObject {
  /**
   * API 发送类型
   */
  method?: 'get' | 'post' | 'put' | 'delete' | 'patch' | 'jsonp';

  /**
   * API 发送目标地址
   */
  url: string;

  /**
   * 用来控制携带数据. 当key 为 `&` 值为 `$$` 时, 将所有原始数据打平设置到 data 中. 当值为 $$ 将所有原始数据赋值到对应的 key 中. 当值为 $ 打头时, 将变量值设置到 key 中.
   */
  data?: {
    [propName: string]: any;
  };

  /**
   * 默认数据映射中的key如果带点，或者带大括号，会转成对象比如：
   *
   * {
   *   'a.b': '123'
   * }
   *
   * 经过数据映射后变成
   * {
   *  a: {
   *   b: '123
   *  }
   * }
   *
   * 如果想要关闭此功能，请设置 convertKeyToPath 为 false
   */
  convertKeyToPath?: boolean;

  /**
   * 用来做接口返回的数据映射。
   */
  responseData?: {
    [propName: string]: any;
  };

  /**
   * 如果 method 为 get 的接口，设置了 data 信息。
   * 默认 data 会自动附带在 query 里面发送给后端。
   *
   * 如果想通过 body 发送给后端，那么请把这个配置成 false。
   *
   * 但是，浏览器还不支持啊，设置了只是摆设。除非服务端支持 method-override
   */
  attachDataToQuery?: boolean;

  /**
   * 发送体的格式
   */
  dataType?: 'json' | 'form-data' | 'form';

  /**
   * 如果是文件下载接口，请配置这个。
   */
  responseType?: 'blob';

  /**
   * 携带 headers，用法和 data 一样，可以用变量。
   */
  headers?: {
    [propName: string]: string | number;
  };

  /**
   * 设置发送条件
   */
  sendOn?: string;

  /**
   * 默认都是追加模式，如果想完全替换把这个配置成 true
   */
  replaceData?: boolean;

  /**
   * 是否自动刷新，当 url 中的取值结果变化时，自动刷新数据。
   *
   * @default true
   */
  autoRefresh?: boolean;

  /**
   * 当开启自动刷新的时候，默认是 api 的 url 来自动跟踪变量变化的。
   * 如果你希望监控 url 外的变量，请配置 traceExpression。
   */
  trackExpression?: string;

  /**
   * 如果设置了值，同一个接口，相同参数，指定的时间（单位：ms）内请求将直接走缓存。
   */
  cache?: number;

  /**
   * 强制将数据附加在 query，默认只有 api 地址中没有用变量的时候 crud 查询接口才会
   * 自动附加数据到 query 部分，如果想强制附加请设置这个属性。
   * 对于那种临时加了个变量但是又不想全部参数写一遍的时候配置很有用。
   */
  forceAppendDataToQuery?: boolean;

  /**
   * qs 配置项
   */
  qsOptions?: {
    arrayFormat?: 'indices' | 'brackets' | 'repeat' | 'comma';
    indices?: boolean;
    allowDots?: boolean;
  };

  /**
   * autoFill 是否显示自动填充错误提示
   */
  silent?: boolean;
}

export interface FormSchemaBase {
  /**
   * 渲染类型
   * 'drawer' | 'form' | 'table' | 'form-group'
   */
  type: string;
  /**
   * 表单标题
   */
  title?: string;

  /**
   * 按钮集合，会固定在底部显示。
   */
  actions?: Array<any>;

  /**
   * 表单项集合
   */
  body?: any;

  data?: any;

  /**
   * 是否开启调试，开启后会在顶部实时显示表单项数据。
   */
  debug?: boolean;

  /**
   * 用来初始化表单数据
   */
  initApi?: string | BaseApiObject;

  /**
   * Form 用来获取初始数据的 api,与initApi不同的是，会一直轮询请求该接口，直到返回 finished 属性为 true 才 结束。
   */
  initAsyncApi?: string | BaseApiObject;

  /**
   * 设置了initAsyncApi后，默认会从返回数据的data.finished来判断是否完成，也可以设置成其他的xxx，就会从data.xxx中获取
   */
  initFinishedField?: string;

  /**
   * 设置了initAsyncApi以后，默认拉取的时间间隔
   */
  initCheckInterval?: number;

  /**
   * 是否初始加载
   */
  initFetch?: boolean;

  /**
   * 建议改成 api 的 sendOn 属性。
   */
  initFetchOn?: string;

  /**
   * 设置后将轮询调用 initApi
   */
  interval?: number;

  /**
   * 是否静默拉取
   */
  silentPolling?: boolean;

  /**
   * 配置停止轮询的条件
   */
  stopAutoRefreshWhen?: string;

  /**
   * 是否开启本地缓存
   */
  persistData?: string;

  /**
   * 提交成功后清空本地缓存
   */
  clearPersistDataAfterSubmit?: boolean;

  /**
   * Form 用来保存数据的 api。
   *
   */
  api?: string | BaseApiObject;

  /**
   * Form 也可以配置 feedback。
   */
  feedback?: any;

  /**
   * 设置此属性后，表单提交发送保存接口后，还会继续轮询请求该接口，直到返回 finished 属性为 true 才 结束。
   */
  asyncApi?: string | BaseApiObject;

  /**
   * 轮询请求的时间间隔，默认为 3秒。设置 asyncApi 才有效
   */
  checkInterval?: number;

  /**
   * 如果决定结束的字段名不是 `finished` 请设置此属性，比如 `is_success`
   */
  finishedField?: string;

  /**
   * 提交完后重置表单
   */
  resetAfterSubmit?: boolean;

  /**
   * 提交后清空表单
   */
  clearAfterSubmit?: boolean;

  /**
   * 配置表单项默认的展示方式。
   */
  mode?: 'normal' | 'inline' | 'horizontal';

  /**
   * 表单项显示为几列
   */
  columnCount?: number;

  /**
   * 如果是水平排版，这个属性可以细化水平排版的左右宽度占比。
   */
  horizontal?: FormHorizontal;

  /**
   * 是否自动将第一个表单元素聚焦。
   */
  autoFocus?: boolean;

  /**
   * 消息文案配置，记住这个优先级是最低的，如果你的接口返回了 msg，接口返回的优先。
   */
  messages?: {
    /**
     * 表单验证失败时的提示
     */
    validateFailed?: string;
  };

  name?: string;

  /**
   * 设置主键 id, 当设置后，检测表单是否完成时（asyncApi），只会携带此数据。
   * @default id
   */
  primaryField?: string;

  redirect?: string;

  reload?: string;

  /**
   * 修改的时候是否直接提交表单。
   */
  submitOnChange?: boolean;

  /**
   * 表单初始先提交一次，联动的时候有用
   */
  submitOnInit?: boolean;

  /**
   * 默认的提交按钮名称，如果设置成空，则可以把默认按钮去掉。
   */
  submitText?: string;

  /**
   * 默认表单提交自己会通过发送 api 保存数据，但是也可以设定另外一个 form 的 name 值，或者另外一个 `CRUD` 模型的 name 值。 如果 target 目标是一个 `Form` ，则目标 `Form` 会重新触发 `initApi` 和 `schemaApi`，api 可以拿到当前 form 数据。如果目标是一个 `CRUD` 模型，则目标模型会重新触发搜索，参数为当前 Form 数据。
   */
  target?: string;

  /**
   * 是否用 panel 包裹起来
   */
  wrapWithPanel?: boolean;

  /**
   * 是否固定底下的按钮在底部。
   */
  affixFooter?: boolean;

  /**
   * 页面离开提示，为了防止页面不小心跳转而导致表单没有保存。
   */
  promptPageLeave?: boolean;

  /**
   * 具体的提示信息，选填。
   */
  promptPageLeaveMessage?: string;

  /**
   * 组合校验规则，选填
   */
  rules?: Array<{
    rule: string;
    message: string;

    // 高亮表单项
    name?: string | Array<string>;
  }>;

  /**
   * 禁用回车提交
   */
  preventEnterSubmit?: boolean;

  /**
   * label自定义宽度，默认单位为px
   */
  labelWidth?: number | string;
}
