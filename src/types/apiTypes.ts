import {paginationType} from '.';

export interface apiType {
  data: {};
  message: string;
  status: boolean;
}

export interface apiPaginatedType extends paginationType {
  data?: [];
  page: number;
  size: number;
  total: number;
}

export interface ApiErrorType {
  data: {
    detail: string;
    errors: {};
  };
  status: number;
  statusText: string | undefined;
}
