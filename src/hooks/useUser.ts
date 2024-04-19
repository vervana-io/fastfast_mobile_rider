import {AuthType, addressesTypes, apiPaginatedType, apiType, profileUpdateType} from '@types/index';
import {useMutation, useQuery} from 'react-query';

import { addressesStore } from '@store/index';
import {authStore} from '@store/auth';
import {http} from '../config';

export type userConfig = {
  enableFetchUser?: boolean;
  enableFetchAddress?: boolean;
};

export const useUser = (config?: userConfig) => {
  const toggleOnlineStatus = useMutation(async (data: {status: number}) => {
    try {
      const req: any = await http.post('profile/update', data);
      return req.data;
    } catch (error) {
      throw error;
    }
  });

  const userDetails = useQuery(
    ['userDetails'],
    async () => {
      try {
        const req: any = await http.get('auth/details');
        return req.data;
      } catch (error) {
        throw error;
      }
    },
    {
      enabled: Boolean(config?.enableFetchUser) && authStore.isLoggedIn,
      onSuccess: (val: apiType) => {
        console.log('val', val);
        if (val.status) {
          const data: any = val.data;
          const payload: AuthType = {
            user: data.user,
            rider: data.rider,
            setting: data.setting,
            token: authStore.auth.token ?? '',
            wallet: data.wallet,
          };
          authStore.setAuth(payload);
        }
      },
    },
  );

  const fetchAddress = useQuery(
    ['fetchAddress'],
    async () => {
      try {
        const req: any = await http.get('addresses/list?page=1&per_page=10');
        return req.data;
      } catch (error) {
        throw error;
      }
    },
    {
      enabled: Boolean(config?.enableFetchAddress),
      onSuccess: (val: apiPaginatedType) => {
        if (val.total > 0) {
          const data: any = val.data;
          addressesStore.setAddresses(data);
        }
      },
    },
  );

  const addAddress = useMutation(async (data: addressesTypes) => {
    try {
      const req: any = await http.post('addresses/store', data);
      return req.data;
    } catch (error) {
      throw error;
    }
  });

  const updateAddress = useMutation(async (data: addressesTypes) => {
    try {
      const req: any = await http.post('addresses/update', data);
      return req.data;
    } catch (error) {
      throw error;
    }
  });

  const profileUpdate = useMutation(async (data: profileUpdateType) => {
    try {
      const req: any = await http.post('profile/update', data);
      return req.data;
    } catch (error) {
      throw error;
    }
  });

  return {
    toggleOnlineStatus,
    userDetails,
    addAddress,
    updateAddress,
    fetchAddress,
    profileUpdate,
  };
};
