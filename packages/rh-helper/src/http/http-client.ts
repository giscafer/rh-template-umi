import type { AxiosInstance, AxiosRequestConfig, ResponseType } from 'axios';
import axios from 'axios';
import { RNHttpAdapterImp } from './adapter/http-adapter-impl';

export type QueryParamsType = Record<string | number, any>;

export interface FullRequestParams extends Omit<AxiosRequestConfig, 'data' | 'params' | 'url' | 'responseType'> {
  /** set parameter to `true` for call `securityWorker` for this request */
  secure?: boolean;
  /** request path */
  path: string;
  /** content type of request body */
  type?: ContentType;
  /** query params */
  query?: QueryParamsType;
  /** format of response (i.e. response.json() -> format: "json") */
  format?: ResponseType;
  /** request body */
  body?: unknown;
  /**
   * 静默请求，失败不主动提示错误信息，只reject
   */
  silent?: boolean;
}

export type RequestParams = Omit<FullRequestParams, 'method' | 'path'>;

export interface ApiConfig<SecurityDataType = unknown> extends Omit<AxiosRequestConfig, 'data' | 'cancelToken'> {
  securityWorker?: (
    securityData: SecurityDataType | null,
  ) => Promise<AxiosRequestConfig | void> | AxiosRequestConfig | void;
  secure?: boolean;
  format?: ResponseType;
  silent?: boolean;
}

export enum ContentType {
  Json = 'application/json',
  FormData = 'multipart/form-data',
  UrlEncoded = 'application/x-www-form-urlencoded',
}

export class HttpClient<SecurityDataType = unknown> extends RNHttpAdapterImp {
  private instance: AxiosInstance;
  private securityData: SecurityDataType | null = null;
  private securityWorker?: ApiConfig<SecurityDataType>['securityWorker'];
  private secure?: boolean;
  private format?: ResponseType;
  private silent?: boolean;

  config: AxiosRequestConfig = {};

  private cancellationToken = axios.CancelToken.source();

  constructor({ securityWorker, secure, format, ...axiosConfig }: ApiConfig<SecurityDataType> = {}) {
    super();

    this.instance = axios.create({
      baseURL: this.baseURL,
      ...axiosConfig,
    });

    this.secure = secure;
    this.format = format;
    this.securityWorker = securityWorker;
    this.silent = axiosConfig.silent ?? false;
    this.cancellationToken = axios.CancelToken.source();
    this.config.cancelToken = this.cancellationToken.token;
    this.interceptRequestConfig(this.instance, { silent: this.silent });
  }

  private mergeRequestParams(params1: AxiosRequestConfig, params2?: AxiosRequestConfig): AxiosRequestConfig {
    return {
      ...this.instance.defaults,
      ...params1,
      ...(params2 || {}),
      headers: {
        ...(this.instance.defaults.headers || {}),
        ...(params1.headers || {}),
        ...((params2 && params2.headers) || {}),
      } as any,
    };
  }

  public cancelRequests() {
    this.cancellationToken.cancel('RequestCancellation');
    return new HttpClient();
  }

  public setSecurityData = (data: SecurityDataType | null) => {
    this.securityData = data;
  };

  /**
   * 请求入口
   * @param
   * @returns Promise<T>
   */
  public request = async <T = any>({
    secure,
    path,
    type,
    query,
    format,
    body,
    ...params
  }: FullRequestParams): Promise<T> => {
    // 校验 token
    const accessToken = await this.refreshToken();
    if (!accessToken) {
      return Promise.reject();
    }

    const secureParams =
      ((typeof secure === 'boolean' ? secure : this.secure) &&
        this.securityWorker &&
        (await this.securityWorker(this.securityData))) ||
      {};
    const requestParams = this.mergeRequestParams(params, secureParams);
    const responseFormat = format || this.format || void 0;

    console.log(this.instance, path);
    console.log('requestParams=', requestParams);

    return this.instance.request({
      ...requestParams,
      headers: {
        ...(type && type !== ContentType.FormData ? { 'Content-Type': type } : {}),
        ...(requestParams.headers || {}),
      },
      params: query,
      responseType: responseFormat,
      data: body,
      url: path,
    });
  };
}
