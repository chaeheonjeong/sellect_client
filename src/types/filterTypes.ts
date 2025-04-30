interface PriceRangeOption {
  label: string;
  min: number;
  max: number;
}

export const priceRangeOption: PriceRangeOption[] = [
  { label: '전체', min: 0, max: 500000000 },
  { label: '50,000원 이하', min: 0, max: 50000 },
  { label: '50,000원 ~ 100,000원', min: 50000, max: 100000 },
  { label: '100,000원 ~ 200,000원', min: 100000, max: 200000 },
  { label: '200,000원 ~ 300,000원', min: 200000, max: 300000 },
  { label: '300,000원 이상', min: 300000, max: 500000 },
];

export interface FilterType {
  categoryId: string;
  brandId: string;
  brand: string;
  largeCategory: string;
  mediumCategory: string;
  smallCategory: string;
  minPrice: number;
  maxPrice: number;
}

export interface CategoryType {
  id: number;
  name: string;
  children: CategoryType[];
}
