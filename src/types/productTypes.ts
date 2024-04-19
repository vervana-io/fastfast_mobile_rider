import {Media, categoriesType, sellerTypes, singleProductType} from '.';

export interface ProductTypes {
  id: number;
  business_id: number;
  title: number;
  description: string;
  units: number;
  price: number;
  discount: number;
  prep_time: string;
  special_note: number;
  unit_low_level: number;
  status: number;
  created_at: string;
  updated_at: string;
  love_reactant_id: string;
  media: Media[];
  seller: sellerTypes;
  categories: categoriesType[];
  product_addon_category: productAddonCategoryType[];
}

export interface productAddonCategoryType {
  id: number;
  product_id: number;
  name: string;
  description: string;
  is_required: number;
  status: 0;
  created_at: string;
  updated_at: string;
  addons: addonsType[];
}

export interface addonsType {
  id: number;
  category_id: number;
  name: string;
  price: number;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface pivot {
  order_id: number;
  product_id: number;
  quantity: number;
  amount: number;
}

export interface productAddonsType {
  id: number;
  order_product_id: number;
  addon_id: number;
  status: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  addon: productAddonInfoType;
}

export interface productAddonInfoType {
  id: number;
  category_id: number;
  name: string;
  price: number;
  status: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
  category: singleProductType;
}
