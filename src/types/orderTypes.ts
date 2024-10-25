import {
  ProductTypes,
  addressesTypes,
  customerTypes,
  productAddonsType,
  riderType,
  sellerTypes,
} from '.';

export interface orderType {
  id: number;
  customer_id: number;
  business_id: number;
  rider_id: number;
  address_id: number;
  promotion_id: number;
  group_id: number;
  sub_total: number;
  delivery_fee: number;
  order_type: number; // 1 for delivery 2 pickup
  delivery_pin: string;
  picked_up_at: string;
  preparation_at: string;
  ready_at: string;
  reference: string;
  VAT: number;
  total_amount: number;
  estimated_prep_time: string;
  estimated_delivery_time: string;
  payment_type: number;
  order_detail: string;
  pick_up_pin: string;
  is_gift: number;
  receiver_phone_number: string;
  receiver_house_number: string;
  receiver_street: string;
  receiver_nearest_bus_stop: string;
  receiver_city: string;
  receiver_state: string;
  receiver_country: string;
  receiver_latitude: string;
  receiver_longitude: string;
  rejection_reason: string;
  cancellation_reason: string;
  is_rider_seller_arrived: number;
  is_rider_customer_arrived: number;
  is_scheduled: number;
  scheduled_at: string;
  rider_seller_arrived_at: string;
  rider_customer_arrived_at: string;
  delivered_at: string;
  rejected_at: string;
  cancelled_at: string;
  status: number;
  created_at: string;
  updated_at: string;
  seller: sellerTypes;
  customer: customerTypes;
  misc_rider_info: riderType;
  address: addressesTypes;
  order_products: order_products[];
  logs: orderLogs[];
}

export interface order_products {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
  amount: number;
  status: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  product: ProductTypes;
  addons: productAddonsType[];
}

export interface orderLogs {
  id: number;
  order_id: number;
  admin_id: number;
  customer_id: number;
  seller_id: number;
  rider_id: number;
  event_type: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface notificationsType {
  data: orderNotifications;
  order_id: string;
  request_id: string;
  rider_id: string;
  title: string;
  user_id: string;
}

export interface orderNotifications {
  notification_name: string;
  order_id: number;
  amount: number;
  delivery_pin: string;
  id: number;
  pick_up_pin: string;
  reference: string;
  rider_id: number;
  sub_total: number;
  delivery_fee: number;
  title: string;
  address: {
    house_number: string;
    street: string;
    city: string;
    latitude: number;
    longitude: number;
  };
  customer_address: {
    house_number: string;
    street: string;
    city: string;
    latitude: number;
    longitude: number;
  };
}
