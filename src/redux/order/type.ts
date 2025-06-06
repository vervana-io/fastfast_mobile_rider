export interface NewRequestPaginatedOrdersResponse {
  current_page: number;
  data: NewRequestOrder[];
  first_page_url: string;
  from: number;
  last_page: number;
  last_page_url: string;
  links: NewRequestPaginationLink[];
  next_page_url: string | null;
  path: string;
  per_page: number;
  prev_page_url: string | null;
  to: number;
  total: number;
}

export interface NewRequestOrder {
  id: number;
  country_id: number;
  currency_id: number;
  customer_id: number;
  business_id: number;
  franchise_id: number;
  rider_id: number;
  address_id: number;
  promotion_id: number;
  group_id: number;
  coupon_id: number;
  order_type: number;
  reference: string;
  sub_total: string;
  delivery_fee: string;
  service_charge: string;
  VAT: string;
  discount: string;
  rider_bonus: string;
  total_amount: string;
  estimated_prep_time: string;
  estimated_prep_minutes: number;
  estimated_delivery_time: string;
  payment_type: number;
  order_detail: any;
  pick_up_pin: string;
  delivery_pin: string;
  is_gift: number;
  receiver_phone_number: string | null;
  receiver_house_number: string | null;
  receiver_street: string | null;
  receiver_nearest_bus_stop: string | null;
  receiver_city: string | null;
  reciever_state: string | null;
  receiver_state: string | null;
  receiver_country: string | null;
  receiver_latitude: string | null;
  receiver_longitude: string | null;
  delivery_distance: number;
  is_rider_seller_arrived: number;
  is_rider_customer_arrived: number;
  require_customer_verification: number;
  is_scheduled: number;
  scheduled_at: string | null;
  preparation_at: string | null;
  ready_at: string | null;
  rider_seller_arrived_at: string | null;
  rider_customer_arrived_at: string | null;
  picked_up_at: string | null;
  delivered_at: string | null;
  rejected_at: string | null;
  cancelled_at: string | null;
  status: number;
  rider_bonus_status: number;
  created_at: string;
  updated_at: string;
  delivery_latitude: number;
  delivery_longitude: number;
  delivery_address: string;
  status_name: 'pending' | 'ready';
  order_products: NewRequestOrderProduct[];
  seller: NewRequestSeller;
  customer: NewRequestCustomer;
  address: NewRequestAddress;
  misc_rider_info: NewRequestMiscRiderInfo;
}

export interface NewRequestOrderProduct {
  id: number;
  product_id: number;
  order_id: number;
  quantity: number;
  extra_quantity: number;
  amount: number;
  seller_ready_status: number;
  status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  product: NewRequestProduct;
  addons: any[];
}

export interface NewRequestProduct {
  id: number;
  business_id: number;
  franchise_id: number;
  category_id: number;
  title: string;
  description: string;
  units: number;
  price: string;
  discount: string;
  prep_time: number;
  special_note: string | null;
  unit_low_level: number;
  is_allergies: number;
  allergies: string | null;
  status: number;
  created_by: number;
  updated_by: number;
  created_at: string;
  updated_at: string;
  love_reactant_id: number | null;
  media: NewRequestMedia[];
}

export interface NewRequestMedia {
  id: number;
  mediumable_type: string;
  mediumable_id: number;
  media_type: number;
  file: string;
  status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
}
export interface NewRequestSeller {
  id: number;
  tier: number;
  plan: number;
  name: string;
  trading_name: string;
  individual_identity_card: string | null;
  business_email: string;
  address: string | null;
  city: string | null;
  state: string | null;
  country: string | null;
  latitude: string;
  longitude: string;
  opening_hours: string;
  closing_hours: string | null;
  business_logo: string;
  business_thumbnail: string;
  business_memorandum: string | null;
  business_utility_bill: string | null;
  business_building: string;
  paystack_reference: string | null;
  status: number;
  tier_one_approved_by: number;
  tier_two_approved_by: number;
  tier_one_rejected_by: number;
  tier_two_rejected_by: number;
  tier_one_approved_at: string | null;
  tier_two_approved_at: string | null;
  tier_one_rejected_at: string | null;
  tier_two_rejected_at: string | null;
  created_at: string;
  updated_at: string;
  love_reactant_id: number | null;
  user: NewRequestUser;
}

export interface NewRequestUser {
  id: number;
  country_id: number;
  username: string | null;
  email: string;
  phone_number: string | null;
  email_verified_at: string | null;
  pin: string | null;
  device_version: string | null;
  user_type: number;
  current_latitude: string;
  current_longitude: string;
  status: number;
  deletion_note: string | null;
  created_by: number;
  expired_at: string | null;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  medium: any;
}
export interface NewRequestAddress {
  id: number;
  country_id: number;
  state_id: number;
  city_id: number;
  lga_id: number;
  addressable_type: string;
  addressable_id: number;
  house_number: string;
  street: string;
  nearest_bus_stop: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  is_primary: number;
  status: number;
  created_at: string;
  updated_at: string;
  address: string;
}
export interface NewRequestMiscRiderInfo {
  id: number;
  order_id: number;
  rider_id: number;
  waiting_time_feedback: string | null;
  order_issue_type: number;
  order_issue_bad_weather: string | null;
  order_issue_reassignment: string | null;
  order_issue_vehicle_breakdown: string | null;
  order_issue_pick_up: string | null;
  order_issue_delivery_point: string | null;
  order_issue_app_problem: string | null;
  status: number;
  deleted_at: string | null;
  created_at: string;
  updated_at: string;
  media: NewRequestMedia[];
}
export interface NewRequestPaginationLink {
  url: string | null;
  label: string;
  active: boolean;
}

export interface NewRequestCustomer {
  id: number;
  user_id: number;
  first_name: string;
  other_name: string | null;
  last_name: string;
  phone_number_one: string;
  phone_number_two: string | null;
  default_lga: string | null;
  default_city: string;
  default_state: string;
  avatar: string | null;
  created_at: string;
  updated_at: string;
  love_reacter_id: number | null;
  user: NewRequestUser;
}
