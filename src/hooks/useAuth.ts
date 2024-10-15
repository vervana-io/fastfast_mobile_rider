import {AuthType, registerFieldType} from '@types/authType';
import {useMutation, useQuery} from 'react-query';

import {apiType} from '@types/apiTypes';
import {authStore} from '@store/auth';
import {http} from '../config';

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

  return {
    login,
    register,
    sendToken,
    validateToken,
    logout,
    checkIfEmailExist,
    sendEmailToken,
    validateEmailToken,
  };
};
