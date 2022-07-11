/**
 * @author giscafer
 * @description  Http Adapter 实现类，解耦
 * 比如此实现类依赖 antd message组件，如果是 RN 或 Vue 技术栈，只需要实现 HttpAdapter 接口即可，别的地方都不需要变更
 */

import { baseURL, isMockMode } from '@/config/constant';
import { getToken, saveToken, signOut } from '@roothub/helper/src/auth/auth';
import { message } from 'antd';
import { AxiosError, AxiosInstance, AxiosResponse } from 'axios';
import dayjs from 'dayjs';
import { HttpAdapter } from './http-adapter';
import {
  ERR_MESSAGE_SHOW_DURATION,
  RES_PERMISSION_DENIED_CODE,
  RES_SUCCESS_DEFAULT_CODE,
  RES_UNAUTHORIZED_CODE,
} from './http-code';

export interface Token {
  accessToken?: string;
  refreshToken?: string;
  tokenExpireTime?: string;
  tokenExpiresIn?: number;
  userId?: number;
  ispassword?: boolean;
}

export class RNHttpAdapterImp implements HttpAdapter {
  baseURL: string;
  constructor() {
    this.baseURL = baseURL;
  }

  async getToken<T = Token>(): Promise<T> {
    const token = await getToken();
    return token as T;
  }

  /**
   * 拦截器
   */
  interceptRequestConfig(instance: AxiosInstance, axiosConfig = {}) {
    instance.interceptors.request.use(
      async (config: any) => {
        const token = await this.getToken();
        if (token) {
          // ['X-Access-Token'] is a custom headers key
          config.headers.token = token;
        }
        config.headers['Content-Type'] = 'application/json';

        return config;
      },
      (error) => {
        this.handleErrorResponse(error, axiosConfig);
      },
    );

    // response interceptor
    instance.interceptors.response.use(
      async (response: AxiosResponse<any>) => this.handleResponse(response),
      (error) => {
        return this.handleErrorResponse(error, axiosConfig);
      },
    );
  }

  /**
   * 刷新token
   * @returns Promise<string>
   */
  async refreshToken(): Promise<string> {
    // 校验token
    const token = await this.getToken();

    let { accessToken = '', refreshToken, tokenExpireTime } = token || {};
    if (!isMockMode) {
      if (!token || !token?.accessToken) {
        this.handleLogout();
        return '';
      }
      // 判断当前日期是否晚于tokenExpireTime，如果是表示token已经过期，需要用refreshToken去换一个新的token
      if (dayjs().isAfter(dayjs(tokenExpireTime))) {
        const result = await fetch(`${this.baseURL}/auth/token/refresh?refreshToken=${refreshToken}`).then((response) =>
          response.json(),
        );
        const { data } = result || {};
        accessToken = data.accessToken;
        saveToken(data);
      }
    } else {
      // mock模式，造个token
      accessToken = 'fakeToken-xxxxx';
    }

    return accessToken;
  }

  handleLogout() {
    signOut();
  }

  handleResponse(response: AxiosResponse<any> & { config: { silent?: boolean } }) {
    const res = response.data || {};
    const { silent = false } = response.config;

    if (res.code === RES_SUCCESS_DEFAULT_CODE) {
      // 成功
      return res;
    } else if (res.code === RES_UNAUTHORIZED_CODE) {
      if (!silent) {
        message.info('您已经登出，您可以取消以停留在此页面，或再次登录', ERR_MESSAGE_SHOW_DURATION);
      }
      this.handleLogout();
    } else if (res.code === RES_PERMISSION_DENIED_CODE) {
      // token不存在,请重新登录账户
      this.handleLogout();
    }

    return this.handleErrorResponse(res, { silent });
  }

  handleErrorResponse(
    error: AxiosError & { desc?: string; msg?: string },
    axiosConfig: { silent?: any },
  ): Promise<any> {
    // 后端不统一处理
    const msg = error.desc || error.message || error.msg;
    if (!axiosConfig?.silent) {
      message.error(msg, ERR_MESSAGE_SHOW_DURATION);
    }
    return Promise.reject(error);
  }
}
