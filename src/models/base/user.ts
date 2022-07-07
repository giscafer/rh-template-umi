/* eslint-disable @typescript-eslint/no-unused-vars */
// import RhApi from '@/rh/apis';
import { useCallback } from 'react';

export default () => {
  const getUserInfo = useCallback(async (params: any) => {
    return {};
    // return RhApi.Base.userGetUserInfo(params);
  }, []);

  const userLogin = useCallback((params: any) => {
    // return RhApi.Base.userLogin(params);
    return Promise.resolve({
      expireTime: 3471264000000,
      firstLogin: true,
      accessToken: 'eyJ0eXAiOiJKV1QiLCJhbGc',
    });
  }, []);

  return { getUserInfo, userLogin };
};
