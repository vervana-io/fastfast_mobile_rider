import {userTypes} from '.';

export interface sellerTypes {
  id: number;
  user_id: number;
  category_id: number;
  name: string;
  trading_name: string;
  individual_full_name: string;
  individual_address: string;
  individual_selfie: string;
  phone_number_one: string;
  phone_number_two: string;
  business_email: string;
  license_number: string;
  address: string;
  city: string;
  state: string;
  country: string;
  latitude: string;
  longitude: string;
  business_logo: string;
  business_building: string;
  business_thumbnail: string;
  opening_hours: string;
  love_reactant_id: string;
  status: number;
  created_at: string;
  updated_at: string;
  user: userTypes;
}
