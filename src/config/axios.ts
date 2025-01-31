import axios, {AxiosError} from 'axios';
import {debugAPIError, debugAPIRequest, debugAPIResponse} from '@helpers/utils';

import {Alert} from 'react-native';
import {ApiErrorType} from '@types/apiTypes';
import NavigationService from '@navigation/NavigationService';
import {authStore} from '@store/auth';
import {rootConfig} from '@store/root';

// import {Agent} from 'https';

// const authStore = store.Auth.auth.token;
// console.log('from axios', authStore);

export const apiInstance = axios.create({
  // .. where we make our configurations
  headers: {
    'Content-Type': 'application/json',
    'Cache-Control': 'no-cache, no-store, must-revalidate, public, max-age=0',
    Pragma: 'no-cache',
    Expires: '0',
  },
});

apiInstance.interceptors.request.use(
  request => {
    debugAPIRequest(request);
    rootConfig.setRequestLoading(true);
    return request;
  },
  error => {
    // console.log('request error', error);
    return Promise.reject(error);
  },
);

apiInstance.interceptors.response.use(
  response => {
    // console.log('res', response);
    // Edit response config
    debugAPIResponse(response);
    rootConfig.setRequestLoading(false);
    return response;
  },
  (error: AxiosError<any>) => {
    debugAPIError(error);
    const statusCode = error.response?.status;
    rootConfig.setRequestLoading(false);
    console.log('error code', statusCode);
    if (statusCode === 403) {
      // config.setShouldLogin(true);
      authStore.logout().then(() => {
        NavigationService.navigate('Auth', {screen: 'Login'});
      });
    } else if (statusCode === 409) {
      Alert.alert('Duplicate Request, try again in one minute');
    }
    const formattedError: ApiErrorType = {
      data: {
        detail: error.response?.data.detail,
        errors: error.response?.data.error,
      },
      response: error.response?.data,
      status: error.response?.status ?? 0,
      statusText: error.response?.statusText,
    };
    return Promise.reject(formattedError);
    // throw new ApiError(error.message, error);
  },
);
