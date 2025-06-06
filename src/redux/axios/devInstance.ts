import AsyncStorage from '@react-native-async-storage/async-storage';
import axios, {AxiosError, InternalAxiosRequestConfig} from 'axios';
import {STORAGE_KEY} from '../../constant';

const BASE_URL = 'https://testriderapi.fastfastapp.com/api/';
//testriderapi.fastfastapp.com/api/orders?page=1&per_page=6&status=1

export const devInstance = axios.create({
  baseURL: BASE_URL, // ideally from .env
});

devInstance.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    const token = await AsyncStorage.getItem(STORAGE_KEY.ACCESS_TOKEN);
    config.headers['Content-Type'] = 'application/json';
    config.headers['Authorization'] = `Bearer ${token}`;
    console.log('CONFIG', JSON.stringify(config, null, 2));
    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  },
);
