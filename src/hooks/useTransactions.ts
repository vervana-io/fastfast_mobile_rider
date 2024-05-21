import {apiPaginatedType, paginationType} from '@types/index';

import {http} from '../config';
import {transactionsStore} from '@store/transactions';
import {useMutation} from 'react-query';
import {useState} from 'react';

export const useTransactions = () => {
  const [transactionsData, setTransactionsData] =
    useState<Partial<paginationType>>();

  const fetchTransactions = useMutation(
    async (data: {
      page?: number;
      per_page?: number;
      from_date?: string;
      to_date?: string;
      transaction_type?: '1' | '2' | '3' | '4' | '5'; // Types: deposit -> 1, purchase -> 2, bonus -> 3, withdraw -> 4, refund -> 5
      status?: '0' | '1' | '2'; // status: pending -> 0, success -> 1, failed -> 2, reversed -> 3
    }) => {
      try {
        let endpoint = 'transactions';
        if (data) {
          const queryParams = new URLSearchParams(
            data as Record<string, string>,
          );
          endpoint += `?${queryParams.toString()}`;
        }
        const req: any = await http.get(endpoint);
        return req.data;
      } catch (error) {
        return error;
      }
    },
    {
      onSuccess: (val: apiPaginatedType) => {
        const data: any = val.data;
        const payload: paginationType = {
          current_page: val.current_page,
          total: val.total,
          from: val.from,
          links: [],
          first_page_url: '',
          last_page: '',
          last_page_url: '',
          next_page_url: '',
          path: '',
          per_page: '',
          prev_page_url: '',
          to: val.to,
        };
        transactionsStore.setTransactions(data);
        setTransactionsData(payload);
      },
    },
  );

  return {
    fetchTransactions,
    transactionStates: {
      transactionsData,
    },
  };
};
