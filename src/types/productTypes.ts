export interface ProductType {
  product_id: string;
  brand_name: string;
  image_url: string;
  name: string;
  price: number;
  rating: number;
  category_id: number;
}

export interface ProductDetailType {
  description: string;
  brand_name: string;
  large_category_name: string;
  medium_category_name: string;
  small_category_name: string;
  name: string;
  price: number;
  product_id: string;
  seller_name: string;
  stock: number;
  images: ProductImageType[];
}

interface ProductImageType {
  product_image_id: string;
  representative: boolean;
  sequence: number;
  image_url: string;
}

export const SORT_TYPE = {
  LATEST: 'LATEST',
  PRICE_ASC: 'PRICE_ASC',
  PRICE_DESC: 'PRICE_DESC',
  RATING_DESC: 'RATING_DESC',
} as const;

export type SortType = (typeof SORT_TYPE)[keyof typeof SORT_TYPE];
