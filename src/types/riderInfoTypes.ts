import {Media} from '.';

export interface riderType {
  user_id: number;
  contract_type: number;
  first_name: string;
  other_name: string;
  last_name: string;
  phone_number_one: string;
  phone_number_two: string;
  vehicle_type: number;
  vehicle_brand: string;
  vehicle_plate_number: string;
  vehicle_picture: string;
  selfie: string;
  status: number;
  created_at: string;
  updated_at: string;
  user: {
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
  };
}

export interface misc_rider_info {
  id: number;
  order_id: number;
  rider_id: number;
  waiting_time_feedback: string;
  order_issue_type: number;
  order_issue_bad_weather: string;
  order_issue_reassignment: string;
  order_issue_vehicle_breakdown: string;
  order_issue_pick_up: string;
  order_issue_delivery_point: string;
  order_issue_app_problem: string;
  status: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}
