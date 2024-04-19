import {AxiosError} from 'axios';

interface IApiError<ErrorData> {
  statusCode: number;
  message: string;
  axios: AxiosError<ErrorData>;
}

export class ApiError<ErrorData> extends Error implements IApiError<ErrorData> {
  statusCode: number;
  axios: AxiosError<any>;

  constructor(message: string, config: AxiosError<any>) {
    super();
    this.name = 'ApiError';
    this.message = message;
    this.statusCode = parseInt(config.code ?? '0', 10) as number;
    this.axios = config;
    // this.details =
  }
}

interface IStorageError {}

export class StorageError extends Error implements IStorageError {
  constructor(error: Error) {
    super();
    this.name = 'StorageError';
    this.message = error.message;
    this.stack = error.stack;
  }
}
