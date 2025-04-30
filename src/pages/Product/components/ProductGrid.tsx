import ProductItem from '@pages/Product/components/ProductItem.jsx';
import { ProductType, SortType, SORT_TYPE } from '@/types/productTypes.js';
import { FilterType } from '@/types/filterTypes.js';

interface ProductGridProps {
  products: ProductType[];
  filters: FilterType;
  sortType: SortType;
  onSortChange: (newSortType: SortType) => void;
  onLoadMore: () => void;
  isLastPage: boolean;
}

export default function ProductGrid({
  products,
  filters,
  sortType,
  onSortChange,
  onLoadMore,
  isLastPage,
}: ProductGridProps) {
  const sortedProducts = [...products].sort((a, b) => {
    if (sortType === SORT_TYPE.PRICE_ASC) return a.price - b.price;
    if (sortType === SORT_TYPE.PRICE_DESC) return b.price - a.price;
    if (sortType === SORT_TYPE.RATING_DESC) return b.rating - a.rating;
    return 0;
  });

  // const filteredProducts = sortedProducts.filter(
  //   (product) =>
  //     (!filters.category || product.category === filters.category) &&
  //     (!filters.brand || product.brand === filters.brand) &&
  //     product.price >= filters.minPrice &&
  //     product.price <= filters.maxPrice
  // );

  // // 중복 제거
  // const uniqueFilteredProducts = Array.from(
  //   new Map(filteredProducts.map((p) => [p.product_id, p])).values()
  // );

  return (
    <div className='w-3/4 pl-8'>
      <header className='flex justify-between items-center mb-6'>
        <h1 className='text-3xl font-extrabold text-gray-900'>상품</h1>
        <select
          onChange={(e) => onSortChange(e.target.value as SortType)}
          value={sortType}
          className='p-2 border rounded'
        >
          <option value={SORT_TYPE.LATEST}>신상품순</option>
          <option value={SORT_TYPE.PRICE_ASC}>가격 낮은순</option>
          <option value={SORT_TYPE.PRICE_DESC}>가격 높은순</option>
          <option value={SORT_TYPE.RATING_DESC}>후기순</option>
        </select>
      </header>
      <div className='grid grid-cols-2 md:grid-cols-4 gap-6'>
        {sortedProducts.map((product) => (
          <ProductItem key={product.product_id} product={product} />
        ))}
      </div>
      {!isLastPage && (
        <div className='mt-8 text-center'>
          <button
            onClick={onLoadMore}
            className='px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700'
          >
            더보기
          </button>
        </div>
      )}
    </div>
  );
}
