import {apiInstance} from './axios';
import {authStore} from '@store/auth';

const BASE_URL = process.env.BASE_URL;

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
      return new Promise(resolve => {
        resolve(res);
      });
    } catch (e: any) {
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
      return new Promise(resolve => {
        resolve(res);
      });
    } catch (e) {
      return Promise.reject(e);
    }
  }
}

export const http = new Http();
