import {customerTypes} from './customerTypes';
import {orderType} from './orderTypes';
import {sellerTypes} from './sellerType';

export interface TransactionsType {
  id: number;
  order_id: number;
  transaction_type: string;
  reference: string;
  amount: string;
  fee: string;
  total_amount: string;
  net_amount: string;
  previous_wallet_balance: string;
  new_wallet_balance: string;
  is_card: number;
  is_wallet: number;
  status: number;
  comment: string;
  created_at: string;
  updated_at: string;
  customer: customerTypes;
  seller: sellerTypes;
  order: orderType;
}
