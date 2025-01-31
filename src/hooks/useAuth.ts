import {AuthType, registerFieldType} from '@types/authType';
import {useMutation, useQuery} from 'react-query';

import { SignUpStep1 } from '@screens/auth';
import Toast from 'react-native-toast-message';
import {apiType} from '@types/apiTypes';
import {authStore} from '@store/auth';
import {http} from '../config';
import { navigate } from '@navigation/NavigationService';

export const useAuth = () => {
  const login = useMutation(
    async (data: {field: string; password: string}) => {
      try {
        const req: any = await http.post('auth/login', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (val: apiType) => {
        if (val.status) {
          const data: any = val.data;
          const payload: AuthType = {
            user: data.user,
            rider: data.rider,
            setting: data.setting,
            token: data.access_token.token,
            wallet: data.wallet,
          };
          authStore.setAuth(payload);
        }
      },
    },
  );

  const sendToken = useMutation(async (data: {phone_number: string}) => {
    try {
      const req: any = await http.post('auth/send_token', data);
      return req.data;
    } catch (error) {
      throw error;
    }
  });

  const validateToken = useMutation(
    async (data: {phone_number: string; pin: string}) => {
      try {
        const req: any = await http.post('auth/validate_token', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
  );

  const sendEmailToken = useMutation(async (data: {email: string}) => {
    try {
      const req: any = await http.post('auth/send_token_email', data);
      return req.data;
    } catch (error) {
      throw error;
    }
  });

  const validateEmailToken = useMutation(
    async (data: {email: string; token: string}) => {
      try {
        const req: any = await http.post('auth/validate_token_email', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
  );

  const register = useMutation(
    async (data: registerFieldType) => {
      try {
        const req: any = await http.post('auth/register', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (val: apiType) => {
        if (val.status) {
          const data: any = val.data;
          const payload: AuthType = {
            user: data.user,
            rider: data.rider,
            setting: data.setting,
            token: data.access_token.token,
            wallet: data.wallet,
          };
          authStore.setAuth(payload);
        }
      },
    },
  );

  const logout = useMutation(async () => {
    try {
      const req: any = await http.post('auth/logout');
      return req.data;
    } catch (error) {
      throw error;
    }
  });

  const checkIfEmailExist = useMutation(async (data: {email: string}) => {
    try {
      const req: any = await http.post('auth/email_exist', data);
      return req.data;
    } catch (error) {
      throw error;
    }
  });

  const checkIfPhoneExist = useMutation(
    async (data: {phone_number: string}) => {
      try {
        const req: any = await http.post('auth/phone_number_exists', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
  );

  const loginWithSSO = useMutation(
    async (data: {
      provider: 'google' | 'facebook' | 'apple';
      token: string;
      device_token: string;
    }) => {
      try {
        const req: any = await http.post('auth/oauth_login', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (val: apiType) => {
        if (val.status) {
          const data: any = val.data;
          const payload: AuthType = {
            user: data.user,
            rider: data.rider,
            setting: data.setting,
            token: data.access_token.token,
            wallet: data.wallet,
          };
          authStore.setAuth(payload);
        }
      },
    },
  );

  const registerWithSSO = useMutation(
    async (data: registerFieldType) => {
      try {
        const req: any = await http.post('auth/oauth_register', data);
        return req.data;
      } catch (error: any) {
        if (error.status === 500) {
          Toast.show({
            text1: 'Internal Server Error',
            text2: 'Please try again later.',
            type: 'error',
          });
          authStore.setRegisterData({
            registerData: {},
            step: undefined,
          });
          navigate('Auth', {screen: 'SignUpStep1'});
        }
        throw error;
      }
    },
    {
      onSuccess: (val: apiType) => {
        if (val.status) {
          const data: any = val.data;
          const payload: AuthType = {
            user: data.user,
            rider: data.rider,
            setting: data.setting,
            token: data.access_token.token,
            wallet: data.wallet,
          };
          authStore.setAuth(payload);
        }
      },
    },
  );

  return {
    login,
    register,
    sendToken,
    validateToken,
    logout,
    checkIfEmailExist,
    sendEmailToken,
    validateEmailToken,
    checkIfPhoneExist,
    loginWithSSO,
    registerWithSSO,
  };
};
