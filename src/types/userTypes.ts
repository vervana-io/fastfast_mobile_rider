export interface userTypes {
  id: number;
  username: string;
  email: string;
  user_type: number;
  current_latitude: string;
  current_longitude: string;
  complaince_status: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface profileUpdateType {
  password?: string;
  phone_number?: string;
  first_name?: string;
  other_name?: string;
  last_name?: string;
  selfir?: File;
  selfie_base64?: string;
  next_of_kin?: string;
  next_of_kin_phone_number?: string;
  drivers_license?: string;
  drivers_license_base64?: string;
  vehicle_type?: number;
  vehicle_brand?: string;
  vehicle_plate_number?: string;
  vehicle_picture?: string;
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
}

export interface userAddresses {
  id: number;
  customer_id: number;
  house_number: string;
  street: string;
  nearest_bus_stop: string;
  is_primary: number;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  status: number;
  created_at: string;
  updated_at: string;
}
