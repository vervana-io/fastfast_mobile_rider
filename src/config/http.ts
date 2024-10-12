import {apiInstance} from './axios';
// import {BASE_URL} from 'react-native-dotenv';
import {authStore} from '@store/auth';

// const BASE_URL = __DEV__
//   ? 'https://fastrider.zipu.app/api/'
//   : 'https://fastrider.zipu.app/api/';

const BASE_URL = __DEV__ ? process.env.BASE_URL_DEV : process.env.BASE_URL_DEV;

class Http {
  async get(path: string, options: any = {}) {
    const url = options.isGeneric ? path : BASE_URL + path;
    const headers = options.headers;
    try {
      const res = await apiInstance.get(url, {
        headers: {
          Authorization: `Bearer ${authStore.auth.token?.trim()}`,
          headers,
        },
      });
      // console.log(res);
      return new Promise(resolve => {
        resolve(res);
      });
    } catch (e: any) {
      // const error: ApiErrorType = e;
      return Promise.reject(e);
    }
  }
  async post(path: string, payload?: any, options: any = {}) {
    const url = options.isGeneric ? path : BASE_URL + path;
    try {
      const res = await apiInstance.post(url, payload, {
        headers: {
          Authorization: options.Token
            ? `Bearer ${options.Token}`
            : `Bearer ${authStore.auth.token?.trim()}`,
          options,
        },
      });
      // console.log('options', options);
      return new Promise(resolve => {
        resolve(res);
      });
    } catch (e) {
      // console.log('post error', e.response);
      return Promise.reject(e);
    }
  }
}

export const http = new Http();
