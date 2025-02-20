export interface bankTypes {
  id: number;
  name: string;
  slug: string;
  code: string;
  longcode: string;
  gateway: string;
  pay_with_bank: boolean;
  supports_transfer: boolean;
  active: boolean;
  country: string;
  currency: string;
  type: string;
  is_deleted: boolean;
}

export interface bankAccountType {
  id: number;
  account_name: string;
  account_number: string;
  bank_name: string;
  bank_code: string;
  is_main: number;
  status: number;
}
