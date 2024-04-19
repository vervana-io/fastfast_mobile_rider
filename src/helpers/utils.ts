import { authStore } from '@store/auth';
import {AxiosError, AxiosRequestConfig, AxiosResponse} from 'axios';

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
  console.log(
    '\n',
    '*'.repeat(30),
    '\n',
    `ENDPOINT: ${config.method?.toUpperCase()} ${fetchUrl}`,
    '\n',
    'RESPONSE_BODY: ',
    isObject(data) ? JSON.stringify(data, null, 2) : data,
    '\n',
    '*'.repeat(30),
    '\n',
  );
}

export function debugError<E extends Error>(e: E) {
  console.log(
    '\n',
    '*'.repeat(30),
    '\n',
    'ERROR',
    '\n',
    'TYPE: ',
    e.constructor.name,
    '\n',
    'MESSAGE: ',
    e.message,
    '\n',
    '*'.repeat(30),
    '\n',
  );
}

export function debugAPIError(e: AxiosError<any>) {
  // e.response?.status === 401 && authStore.logout();
  console.log(
    '\n',
    '*'.repeat(30),
    '\n',
    'API_ERROR',
    '\n',
    `ENDPOINT: ${e.config?.method?.toUpperCase()} ${e?.config?.url}`,
    '\n',
    `STATUS_CODE: ${e.response?.status}`,
    '\n',
    'RESPONSE_BODY: ',
    isObject(e.response?.data)
      ? JSON.stringify(e.response?.data, null, 2)
      : e.response?.data,
    '\n',
    '*'.repeat(30),
    '\n',
  );
}

export function debugAPIRequest(req: AxiosRequestConfig<any>) {
  console.log(
    '\n',
    '*'.repeat(30),
    '\n',
    'API_INFO: \n',
    `URL: ${req.method?.toUpperCase()} ${req.url}`,
    '\n',
    `TOKEN: ${req.headers?.Authorization}`,
    // `HEADERS: ${
    //   isObject(req.headers) ? JSON.stringify(req.headers) : req.headers
    // }`,
    '\n',
    `REQUEST_BODY: ${
      req.data
        ? isObject(req.data)
          ? JSON.stringify(req.data)
          : req.data
        : undefined
    }`,
    '\n',
    '*'.repeat(30),
    '\n',
  );
}
