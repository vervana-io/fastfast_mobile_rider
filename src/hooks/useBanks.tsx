import {useMutation, useQuery} from 'react-query';

import {apiType} from '@types/apiTypes';
import {authStore} from '@store/auth';
import {bankTypes} from '@types/bankTypes';
import {http} from '../config';
import {useState} from 'react';

export type options = {
  fetchBanks?: boolean;
  listBankAccounts?: boolean;
};

export const useBanks = (config?: options) => {
  const [bankList, setBankList] = useState<bankTypes[]>([]);

  const getBanks = useQuery(
    ['getBanks'],
    async () => {
      try {
        const req: any = await http.get('misc/get_banks');
        return req.data;
      } catch (error) {
        throw error;
      }
    },
    {
      enabled: Boolean(config?.fetchBanks),
      onSuccess: (val: apiType) => {
        if (val.status) {
          const data: any = val.data;
          setBankList(data);
        }
      },
    },
  );

  const validateBank = useMutation(
    async (data: {account_number: string; bank_code: string}) => {
      try {
        const req: any = await http.post(
          'misc/validate_bank_account_number',
          data,
        );
        return req.data;
      } catch (error) {
        throw error;
      }
    },
  );

  const storeBanks = useMutation(
    async (data: {
      account_name: string;
      account_number: string;
      bank_name: string;
      bank_code: string;
      is_main: number;
    }) => {
      const req: any = await http.post('bank_accounts/store', data);
      return req.data;
    },
  );

  const listBankAccounts = useQuery(
    ['listBankAccounts'],
    async () => {
      try {
        const req: any = await http.get('bank_accounts/list');
        return req.data;
      } catch (error) {
        throw error;
      }
    },
    {
      enabled: Boolean(config?.listBankAccounts),
      // onSuccess: (val: apiType) => {
      //   if (val.status) {
      //     const data: any = val.data;
      //     setBankList(data);
      //   }
      // },
    },
  );

  return {
    getBanks,
    bankList,
    validateBank,
    storeBanks,
    listBankAccounts,
  };
};
