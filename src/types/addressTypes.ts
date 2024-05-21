export interface addressesTypes {
  id?: number;
  addressable_type?: string;
  addressable_id?: number;
  house_number: number;
  street: string;
  nearest_bus_stop: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  status?: number;
  is_primary?: number;
  created_at?: string;
  updated_at?: string;
}

export interface updateAddressesTypes {
  address_id: number;
  addressable_type?: string;
  addressable_id?: number;
  house_number: number;
  street: string;
  nearest_bus_stop: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  status: number;
  is_primary: number;
  created_at: string;
  updated_at: string;
}
