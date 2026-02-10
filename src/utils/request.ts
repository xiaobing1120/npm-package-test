import axios from 'axios'
import { v4 as uuid } from 'uuid';
import { message } from 'antd'
// import queryString from 'query-string';
// import { AseParser, setCrypt } from './crypt/crypt';
import setting from "../../setting.ts";

/* eslint-disable */
const service = axios.create({
  baseURL: "/",
  timeout: 10000,
});

let downLoading: any = null;
let login_token: string | null = ''

const baseData = (d: any): any => {
  const data = d || {};
  return {
    apiCd: '',
    appKey: '',
    appKeyConfig: '',
    channelNo: '',
    current: data.current !== undefined ? data.current : '',
    data: {
      ...data,
    },
    flowId: uuid().replace(/-/g, ''),
    pageSize: data.pageSize !== undefined ? data.pageSize : '',
    timestamp: new Date().getTime(),
    sysId: __SYSID__,
    version: __VERSION__,
  };
};

// 请求前拦截
service.interceptors.request.use(
  async (config: any) => {
    login_token = sessionStorage.getItem('login_token');

    // 飞书鉴权登录
    // if (!login_token && config.url !== '/zycfcAppLogin') await loginAction();

    config.data = config.data || {};

    if (config.url !== '/zycfcAppLogin' && config.headers['Content-Type'] !== 'multipart/form-data' ) {
      config.data = baseData(config.data);
    }

    if (!__IS_PROD__) {
      console.log(`${config.url} 请求前config`, config);
      console.log(`${config.url} 请求前参数`, config.data);
    }

    // 签名
    // const suuid = uuid().replace(/-/g, '');
    // const aseparser = new AseParser(suuid);
    // const deskey = setCrypt(suuid);

    config.headers = {
      channel: 'pc',
      device_type: 'Windows',
      // des_key: deskey,
      // sign: aseparser.getSign(`${config.baseURL}${config.url}`),
      device_no: uuid().replace(/-/g, ''),
      device_name: 'Windows 10',
      sysId: __SYSID__,
      ...config.headers,
      'Content-Type': config.headers['Content-Type']
        ? config.headers['Content-Type']
        : 'application/json',
      ...(login_token ? { login_token } : {}),
    };

    // 加密
    /* if (config.headers['Content-Type'] !== 'multipart/form-data') {
      config.data = aseparser.setAse(JSON.stringify(config.data || {}));
      config.aseparser = aseparser;
    } */

    if (config.responseType === 'blob') {
      // downLoading = toast.load('下载中');
    }

    return config;
  },
  (error: any) => {
    return Promise.reject(error);
  }
);

// 响应后拦截
service.interceptors.response.use(
  (response: any) => {
    if (!__IS_PROD__) {
      // console.log(`${response.config.url} 响应数据 `, response);
    }

    if (response.config['responseType'] === 'blob') {
      const filename =
        (response.headers['content-disposition'] || '').match(
          /filename\=(.+)/
        ) || [];
      if (filename.length > 0) {
        const blob = new Blob([response.data]);
        const objectURL = URL.createObjectURL(blob);
        let btn = document.createElement('a');
        btn.download = decodeURIComponent(filename[1]);
        btn.href = objectURL;
        btn.click();
        URL.revokeObjectURL(objectURL);
        // btn = null;

        downLoading && downLoading.close();

        message.success('下载成功');
        return {};
      } else {
        downLoading && downLoading.close();
        // toast.info('下载失败');
        return Promise.reject({ message: '下载失败' });
      }
    }


    let res: any = response.data || {};

    // 解密
    /* if (typeof response.data === 'string') {
      res = response.config.aseparser.getAse(response.data);
      res = JSON.parse(res);
    } else {
      res = response.data;
    } */

    if (!__IS_PROD__) {
      console.log(`${response.config.url} 响应数据 res`, res);
    }

    // res.returnCode === '000000' || 飞书网关
    if (res.code === setting.successCode) {
      return res
    } else {
      // 登录异常处理  res.returnCode === '100001' 飞书网关
      if (res.code === '100001') {
        document.cookie = '';
        sessionStorage.clear();
        res = { message: '登陆异常,请重新打开' };
      }
      message.error(res.message);
      return Promise.reject(res);
    }
  },
  (err: { response: { status: any }; message: string }) => {
    console.log('抛出 err', err);
    if (err && err.response) {
      switch (err.response.status) {
        case 400:
          err.message = '请求错误';
          break;

        /*  case 401:
          err.message = '登录失效，请登录';
          window.location.href = window.location.origin + '/login';
          sessionStorage.clear();
          break; */

        case 403:
          err.message = '拒绝访问';
          break;

        case 404:
          err.message = '404，找不到服务或服务正在构建';
          break;

        case 408:
          err.message = '请求超时';
          break;

        case 500:
          err.message = '服务器内部错误';
          break;

        case 501:
          err.message = '服务未实现';
          break;

        case 502:
          err.message = '网关错误';
          break;

        case 503:
          err.message = '服务不可用';
          break;

        case 504:
          err.message = '网关超时';
          break;

        case 505:
          err.message = 'HTTP版本不受支持';
          break;

        default:
      }
    }
    message.error(err.message);
    return Promise.reject(err);
  }
);

// 登录
/* const loginAction = async () => {
  const query = queryString.parse(location.search);
  return service
    .post('/zycfcAppLogin', { code: query.code })
    .then((res: any) => {
      if (res.login_token) {
        login_token = res.login_token
        sessionStorage.setItem('login_token', res.login_token);
      }
    })
    .catch((e) => console.log('登录错误', e));
}; */

export default service;
