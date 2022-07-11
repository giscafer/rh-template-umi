// 非对称加密-获取公钥设置加密方法
import JSEncrypt from 'jsencrypt';
const publicKey =
  'MIGfMA0GCSqGSIb3DQEBAQUAA4GNADCBiQKBgQCW3fQpZiXmj7+OnwtvtxYA353AEqW9LA2TvCqWNNdMRtaEIgbmV6qYQE+Osy/M0J+tdRwazA4DWKt8qPkcKUKPynMiTWIGePMHj8J6DCnqP2zmOo5QRQN2YMVLC0cA2bOiZt84Loc+sYctTZAdWKukf1+SzZe+aYS/Snw73mxA7QIDAQAB';
const encryptObj = new JSEncrypt({});
encryptObj.setPublicKey(publicKey);
export const encrypt = encryptObj;
