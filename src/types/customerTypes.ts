import {userTypes} from '.';

export interface customerTypes {
  id: number;
  user_id: number;
  first_name: string;
  other_name: string;
  last_name: string;
  phone_number_one: string;
  phone_number_two: string;
  default_lga: string;
  default_city: string;
  default_state: string;
  referral_code: string;
  avatar: string;
  love_reacter_id: string;
  created_at: string;
  updated_at: string;
  user: userTypes;
}
