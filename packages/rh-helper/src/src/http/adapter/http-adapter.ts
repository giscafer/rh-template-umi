import { AxiosInstance, AxiosResponse } from 'axios';

export interface HttpAdapter {
  /**
   * 服务 base url
   */
  baseURL: string;
  /**
   * 刷新token
   */
  refreshToken(): Promise<string>;
  /**
   * 拦截器
   * @param instance
   */
  interceptRequestConfig(instance: AxiosInstance): void;
  /**
   * 处理响应
   * @param response
   */
  handleResponse(response: AxiosResponse): Promise<string>;
}
