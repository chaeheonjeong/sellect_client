interface ProductIdentity {
  product_id: string;
  brand_name: string;
  name: string;
}

interface ProductPricing {
  price: number;
}

interface ProductThumbnail {
  image_url: string;
}

interface ProductSearchSpecificInfo {
  rating: number;
  category_id: number;
}

interface ProductDetailImages {
  images: ProductImageType[];
}

interface ProductDetailSpecificInfo {
  description: string;
  large_category_name: string;
  medium_category_name: string;
  small_category_name: string;
  seller_name: string;
  stock: number;
}

interface ProductImageType {
  product_image_id: string;
  representative: boolean;
  sequence: number;
  image_url: string;
}

export type ProductType = ProductIdentity &
  ProductPricing &
  ProductThumbnail &
  ProductSearchSpecificInfo;
export type ProductDetailType = ProductIdentity &
  ProductPricing &
  ProductDetailImages &
  ProductDetailSpecificInfo;

export const SORT_TYPE = {
  LATEST: 'LATEST',
  PRICE_ASC: 'PRICE_ASC',
  PRICE_DESC: 'PRICE_DESC',
  RATING_DESC: 'RATING_DESC',
} as const;

export type SortType = (typeof SORT_TYPE)[keyof typeof SORT_TYPE];
