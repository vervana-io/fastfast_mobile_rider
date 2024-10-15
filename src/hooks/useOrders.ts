import {
  apiPaginatedType,
  apiType,
  orderTypes,
  paginationType,
} from '@types/index';

import {http} from '../config';
import {ordersStore} from '@store/orders';
import {useMutation} from 'react-query';
import {useState} from 'react';

export const useOrders = () => {
  const [ordersData, setOrders] = useState<paginationType>();
  const [pastOrdersData, setPastOrders] = useState<paginationType>();
  const [singleOrder, setSingleOrder] = useState<Partial<orderTypes>>();

  const fetchOngoingOrders = useMutation(
    async (data: {
      page?: number;
      per_page?: number;
      status?: '0' | '1' | '2'; // Order status: all -> 0, ongoing -> 1, past -> 2
    }) => {
      try {
        let endpoint = 'orders';
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
        };
        const ongoingCount = val.total;
        ordersStore.setOrders(data, ongoingCount);
        setOrders(payload);
      },
    },
  );

  const fetchPastOrders = useMutation(
    async (data: {
      page?: number;
      per_page?: number;
      status?: '0' | '1' | '2'; // Order status: all -> 0, ongoing -> 1, past -> 2
    }) => {
      try {
        let endpoint = 'orders';
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
        };
        setPastOrders(payload);
      },
    },
  );

  const fetchSingleOrder = useMutation(
    async (data: {id: number}) => {
      try {
        const req: any = await http.get(`orders/single/${data.id}`);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
    {
      onSuccess: (val: apiType) => {
        if (val.status) {
          setSingleOrder(val.data);
          const data: any = val.data;
          ordersStore.setSelectedOrder(data);
        }
      },
    },
  );

  const acceptOrder = useMutation(
    async (data: {order_id: string | number; request_id: number}) => {
      try {
        const req: any = await http.post('orders/accept', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
  );

  const reassignOrder = useMutation(
    async (data: {order_id: string | number; request_id: number}) => {
      try {
        const req: any = await http.post('orders/reject', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
  );

  const pickUpOrder = useMutation(
    async (data: {
      order_id: number;
      request_id: number;
      media_base64: string[];
    }) => {
      try {
        const req: any = await http.post('orders/pick_up', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
  );

  const arrivalOrder = useMutation(
    async (data: {order_id: number; request_id: number}) => {
      try {
        const req: any = await http.post('orders/customer_arrival', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
  );

  const deliveredOrder = useMutation(
    async (data: {order_id: number; request_id: number}) => {
      try {
        const req: any = await http.post('orders/delivered', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
  );

  const complaints = useMutation(
    async (data: {
      title: string;
      body: string;
      old_ticket_id?: number;
      media_base64?: string;
    }) => {
      try {
        const req: any = await http.post('tickets/create', data);
        return req.data;
      } catch (error) {
        throw error;
      }
    },
  );

  return {
    fetchOngoingOrders,
    fetchSingleOrder,
    orderStates: {
      singleOrder,
      ordersData,
    },
    acceptOrder,
    reassignOrder,
    pickUpOrder,
    arrivalOrder,
    deliveredOrder,
    complaints,
  };
};
