export interface addressesTypes {
  id?: number;
  addressable_type?: string;
  addressable_id?: number;
  house_number: number;
  street: string;
  nearest_bus_stop: string;
  city: cityType;
  state: stateType;
  country: string;
  latitude: string;
  longitude: string;
  status?: number;
  is_primary?: number;
  created_at?: string;
  updated_at?: string;
}

export interface locationData {
  longitude: string,
  latitude: string
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

export interface cityType {
  country_id: number;
  created_at: string;
  id: number;
  is_capital: number;
  latitude: string;
  longitude: string;
  name: string;
  state_id: number;
  status: number;
  updated_at: string;
}

export interface stateType {
  capital: string;
  country_id: number;
  created_at: string;
  id: number;
  latitude: string;
  longitude: string;
  name: string;
  status: number;
  updated_at: string;
}