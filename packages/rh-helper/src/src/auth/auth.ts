import storage from '@roothub/helper/src/storage';

export const TOKEN_KEY = '_rh_token';
export const USER_INFO_KEY = '_rh_token';

export interface TokenType {
  accessToken?: string;
  refreshToken?: string;
  expireTime?: number;
  expiresIn?: number;
  userId?: number;
  isPassword?: boolean;
  firstLogin?: boolean;
}
/**
 * 退出登录
 * @returns
 */
export const signOut = () => {
  return new Promise((resolve, reject) => {
    Promise.all([storage.remove(TOKEN_KEY), storage.remove(USER_INFO_KEY)])
      .then(() => {
        resolve(true);
      })
      .catch(() => {
        reject(false);
      });
  });
};

/**
 * 判断是否已登录
 */
export const isSignedIn = async () => {
  const result = await storage.get(USER_INFO_KEY);
  return !!result;
};

/**
 * 持久化token相关数据
 * @param token
 */
export const saveToken = (tokenInfo: TokenType) => {
  /* const { accessToken, refreshToken, expireTime, expiresIn } = tokenInfo;
  const _token = {
    accessToken,
    refreshToken,
    expireTime,
    expiresIn,
  }; */
  storage.set(TOKEN_KEY, tokenInfo);
};

export const getToken: () => Promise<TokenType> = async () => {
  const result = storage.get(TOKEN_KEY);
  return result;
};
