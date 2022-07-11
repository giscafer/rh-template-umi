import { AnyObject } from 'typings';
import { ContentType, HttpClient, RequestParams } from './http-client';

const httpClient = new HttpClient();

/**
 * post 请求
 * @param url 接口url
 * @param data post参数
 * @param params http params
 */
export function httpGet(url: string, query: AnyObject = {}, params: RequestParams = {}) {
  return httpClient.request({
    path: url,
    method: 'GET',
    query,
    ...params,
  });
}
/**
 * post 请求
 * @param url 接口url
 * @param data post参数
 * @param params http params
 */
export function httpPost(url: string, data: AnyObject = {}, params: RequestParams = {}) {
  return httpClient.request({
    path: url,
    method: 'POST',
    body: data,
    ...params,
  });
}

/**
 * PUT 请求
 * @param url 接口url
 * @param params http params
 */
export function httpPut(url: string, data: AnyObject = {}, params: RequestParams = {}) {
  return httpClient.request({
    path: url,
    method: 'PUT',
    body: data,
    ...params,
  });
}
/**
 * DELETE 请求
 * @param url 接口url
 * @param params http params
 */
export function httpDelete(url: string, params: RequestParams = {}) {
  return httpClient.request({
    path: url,
    method: 'DELETE',
    type: ContentType.Json,
    ...params,
  });
}

export default httpClient;
