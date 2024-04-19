export interface categoriesType {
  id: number;
  business_id: number;
  category_id: number;
  name: string;
  description: string;
  status: number;
  created_at: string;
  updated_at: string;
}

export interface singleProductType {
  id: number;
  product_id: number;
  name: string;
  description: string;
  is_required: number;
  status: number;
  deleted_at: string;
  created_at: string;
  updated_at: string;
}
