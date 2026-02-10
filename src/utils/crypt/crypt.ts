import JSEncrypt from 'jsencrypt';
import CryptoJS from 'crypto-js';
import { v4 as uuid } from 'uuid';
// import { Any } from '@/constants/types';

let PUBLICKEY;
if (__IS_PROD__) {
  PUBLICKEY = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEA2tRp9n5mdJDBR8KUrcaphjN9c8H6Pd41vMENh5QELn1eBBrXGu6W6KhNB2buY/ZjpZp+mga7xIs+xm6V1vIOSp8YBvg7cZiKmHXJRxKgKzXPsAun9yukhA9HJWbG/4lY+G6YIdb3izT/xMMAP3flZHmr8qqQ2R7PGfDCVWvXZ5Ajfy12DDa/arjY21zNqq4u0Hir4Cf+aRiIW1b7I53O8Mqc+6s34M38XgwRx8H0+IdSqII1mF8ov7F+oeAvy1LgQ9bvRtqdDe/4ybNdNw9okano5XaqSunJN0JKSduu9k75TMYNrrGkO01/tQ/7X1EkqU8JGV0aUellbjwZEip2qQIDAQAB\n-----END PUBLIC KEY-----`;
} else {
  PUBLICKEY = `-----BEGIN PUBLIC KEY-----\nMIIBIjANBgkqhkiG9w0BAQEFAAOCAQ8AMIIBCgKCAQEAhqTwdgmuxET6Y6jdsesiwsEzBV+21gaCRsLO4WVoAyDhQYEdcLJQ7EFi7s5uWIg1P2sYsgJpyewxqVFRr/begn5qdZNTT6LF8RSj6sOfxyWmkHrWcpY2Lnrbq7iBvIRqMC2FJTp23sRLvCM3Uz6P+ylIM5vImklAb263tSlAAiae3mwHLnMhFi+zsh+NWuSqdnjSZCBjz0hxzaLeTvuV3YDfW5t+eD/O9+/H6oqaFMbVBawHO6QNXVmHeaZNOzn8xNQjMwZ3LctEtH9Us2DlFqzdSeNKGWt1gs3qypW+9NjfQ2eTHnUm6yH4VjyGSOtb56QgN39oJ4fuUP0u40EkyQIDAQAB\n-----END PUBLIC KEY-----`;
}

const _iv = '16-Bytes--String';
/**
 *
 * @returns 非对称加密
 */
const crypt = (KEY: string): any => {
  const encrypt = new JSEncrypt();
  encrypt.setPublicKey(KEY);
  return (txtval: string): any => {
    return encrypt.encrypt(txtval);
  };
};
const genMonth = (month: number): string => {
  return month > 8 ? `${month + 1}` : `0${month + 1}`;
};

const genTime = (time: number): string | number => {
  return time > 9 ? time : `0${time}`;
};

const genMilliTime = (time: number): string | number => {
  if (time > 9) {
    return time > 99 ? time : `0${time}`;
  }
  return `00${time}`;
};

class AseParser {
  aseKey: string;

  key: any;

  constructor(aseKey: string) {
    this.aseKey = aseKey;
    this.key = CryptoJS.enc.Utf8.parse(aseKey);
  }

  setAse(txtval: string): string {
    // let key = CryptoJS.enc.Utf8.parse(aseKey);//将密钥转换成Utf8字节数组
    const cpt = CryptoJS.AES.encrypt(txtval, this.key, {
      iv: CryptoJS.enc.Utf8.parse(_iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    // const cptData = cpt.toString();
    return cpt.toString();
  }

  getAse(cptData: string): string {
    // let key = CryptoJS.enc.Utf8.parse(aseKey);//将密钥转换成Utf8字节数组
    const dpt = CryptoJS.AES.decrypt(cptData, this.key, {
      iv: CryptoJS.enc.Utf8.parse(_iv),
      mode: CryptoJS.mode.CBC,
      padding: CryptoJS.pad.Pkcs7,
    });
    return dpt.toString(CryptoJS.enc.Utf8);
  }

  getSign(api: string): string {
    const currentTime = new Date();
    const timeStr = `${currentTime.getFullYear()}${genMonth(
      currentTime.getMonth()
    )}${genTime(currentTime.getDate())}${genTime(
      currentTime.getHours()
    )}${genTime(currentTime.getMinutes())}${genTime(
      currentTime.getSeconds()
    )}${genMilliTime(currentTime.getMilliseconds())}`;
    const deviceId = uuid().replace(/-/g, '');
    const signStr = `${timeStr}${deviceId}`;
    // console.log(`${signStr}${deviceId}${api}`);
    return this.setAse(`${signStr}${deviceId}${api}`);
  }
}

const setCrypt = crypt(PUBLICKEY);

export { setCrypt, AseParser, genMonth };
