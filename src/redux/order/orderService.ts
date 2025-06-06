import {API_LISTS} from '../api-lists';
import {devInstance} from '../axios/devInstance';

export type AcceptOrderType = {
  order_id: string | number;
  request_id: number;
};

export const accept_order_request = async ({
  order_id,
  request_id,
}: AcceptOrderType) => {
  const response = await devInstance.post(API_LISTS.ACCEPT_ORDER, {
    order_id,
    request_id,
  });
  console.log('SUCCESS ORDER', JSON.stringify(response?.data, null, 2));
  return response;
};

export const reject_order_request = async ({
  order_id,
  request_id,
}: AcceptOrderType) => {
  console.log('REJECT...');
  const response = await devInstance.post(API_LISTS.REJECT_ORDER, {
    order_id,
    request_id,
  });
  console.log('REJECT ORDER', JSON.stringify(response?.data, null, 2));
  return response;
};

export const get_order_requests = async () => {
  const response = await devInstance.get(API_LISTS.GET_ORDER_REQUESTS);
  return response?.data;
};
