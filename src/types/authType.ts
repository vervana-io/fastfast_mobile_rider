export interface AuthType {
  token: string;
  user: User;
  rider: Rider;
  setting: Setting;
  wallet: Wallet;
}

export interface User {
  id: number;
  username: string;
  email: string;
  current_latitude: string;
  current_longitude: string;
  created_at: string;
  updated_at: string;
  complaince_status: number;
  rejection_note: string;
}

export interface Rider {
  rider_id: number;
  contract_type: string;
  shift_type: number;
  shift_data: number[];
  first_name: string;
  other_name: string;
  last_name: string;
  phone_number_one: string;
  phone_number_two: string;
  next_of_kin: string;
  next_of_kin_phone_number: string;
  drivers_license: string;
  vehicle_type: string;
  vehicle_brand: string;
  vehicle_plate_number: string;
  vehicle_picture: string;
  first_guarantor_name: string;
  first_guarantor_phone_number: string;
  second_guarantor_name: string;
  second_guarantor_phone_number: string;
  previous_place_of_work: string;
  previous_place_of_work_duration: string;
  bank_name: string;
  bank_code: string;
  account_number: string;
  account_name: string;
  selfie: string;
  status: number;
  deliveried_orders: number;
  ratings: number;
}

export interface Setting {
  rider_map_settings: string;
  rider_show_traffic: number;
  rider_open_maps: number;
}

export interface Wallet {
  account_name: number;
  account_number: number;
  balance: number;
}

export interface loginFieldType {
  email: string;
  password: string;
  fbt: string;
}

export interface registerFieldType {
  provider?: string;
  token?: string;
  phone_number?: string;
  email?: string;
  password?: string;
  first_name?: string;
  last_name?: string;
  // latitude?: string;
  // longitude?: string;
  contract_type?: number;
  shift_type?: number;
  shift_data?: number[];
  next_of_kin?: string;
  next_of_kin_phone_number?: string;
  drivers_license?: File;
  drivers_license_base64?: string;
  vehicle_type?: number;
  vehicle_brand?: string;
  vehicle_plate_number?: string;
  vehicle_picture?: File;
  vehicle_picture_base64?: string;
  first_guarantor_name?: string;
  first_guarantor_phone_number?: string;
  second_guarantor_name?: string;
  second_guarantor_phone_number?: string;
  previous_place_of_work?: string;
  previous_place_of_work_duration?: string;
  bank_name?: string;
  bank_code?: string;
  account_number?: string;
  account_name?: string;
  avatar?: File;
  avatar_base64?: string;
  device_token?: string;
  device_version?: string;
}

export interface bioLoginFieldType {
  signature: string;
  fbt: string;
}

export interface registerStoreType {
  step: number | undefined;
  registerData: registerFieldType;
  method?: 'provider' | 'route' | 'none';
}
