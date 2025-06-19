import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';

import {authStore} from '@store/auth';

export const todo = () => {
  if (__DEV__) {
    throw new Error('Function not implemented.');
  }
};

export const isObject = (data: unknown): boolean =>
  typeof data === 'object' && !Array.isArray(data);

export function debugAPIResponse(res: AxiosResponse<unknown>) {
  const config = res.config;
  const fetchUrl = res.config.url;

  const data = res?.data;
  
}

export function debugError<E extends Error>(e: E) {
  
}

export function debugAPIError(e: AxiosError<any>) {
  // e.response?.status === 401 && authStore.logout();
 
}

export function debugAPIRequest(req: AxiosRequestConfig<any>) {
  
}
