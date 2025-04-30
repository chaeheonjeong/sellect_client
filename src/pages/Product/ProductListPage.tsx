import { useEffect, useState } from 'react';
import ProductFilters from '@pages/Product/components/ProductFilters.jsx';
import ProductGrid from '@pages/Product/components/ProductGrid.jsx';
import { useLocation } from 'react-router-dom';
import axios from 'axios';
import { ProductType, SortType } from '@/types/productTypes';
import { FilterType, priceRangeOption } from '@/types/filterTypes';

const VITE_API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
const DEFAULT_MIN_PRICE = 0;
const DEFAULT_MAX_PRICE = 500000;

export default function ProductListPage() {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const keyword = searchParams.get('keyword');

  const [products, setProducts] = useState<ProductType[]>([]);
  const [filters, setFilters] = useState<FilterType>({
    categoryId: '',
    brandId: '',
    brand: '',
    largeCategory: '',
    mediumCategory: '',
    smallCategory: '',
    minPrice: DEFAULT_MIN_PRICE,
    maxPrice: DEFAULT_MAX_PRICE,
  });
  const [selectedPrice, setSelectedPrice] = useState(0);
  const [customPrice, setCustomPrice] = useState(false);
  const [sortType, setSortType] = useState<SortType>('LATEST');
  const [page, setPage] = useState(0);
  const [isLastPage, setIsLastPage] = useState(true);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          `${VITE_API_BASE_URL}/api/v1/search/products`,
          {
            params: {
              keyword: keyword,
              page: page,
              sortType: sortType,
              categoryId: filters.categoryId,
              brandId: filters.brandId,
              minPrice: filters.minPrice,
              maxPrice: filters.maxPrice,
            },
          }
        );
        if (page === 0) {
          setProducts(response.data['result']['content']);
        } else {
          setProducts((prev) => {
            const newProducts = [
              ...prev,
              ...response.data['result']['content'],
            ];
            return Array.from(
              new Map(newProducts.map((p) => [p.product_id, p])).values()
            );
          });
        }
        setIsLastPage(response.data['result']['last']);
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    if (keyword) {
      fetchProducts();
    }
  }, [keyword, filters, selectedPrice, customPrice, sortType, page]);

  const handleFilterChange = (newFilters: FilterType) => {
    setFilters(newFilters);
    setPage(0); // 필터 변경 시 페이지 초기화
  };

  const handlePriceFilter = (index: number) => {
    if (index === selectedPrice) return;
    setSelectedPrice(index);
    setCustomPrice(false);
    setFilters({
      ...filters,
      minPrice: priceRangeOption[index].min,
      maxPrice: priceRangeOption[index].max,
    });
    setPage(0); // 가격 필터 변경 시 페이지 초기화
  };

  const applyCustomPrice = () => {
    setSelectedPrice(0);
    setCustomPrice(true);
    setPage(0); // 커스텀 가격 적용 시 페이지 초기화
  };

  const handleSortChange = (newSortType: SortType) => {
    setSortType(newSortType);
    setPage(0); // 정렬 변경 시 페이지 초기화
  };

  const loadMore = () => {
    setPage((prev) => prev + 1);
  };

  return (
    <div className='min-h-screen flex flex-row bg-gray-50 pt-24 py-12 px-4 sm:px-6 lg:px-8'>
      <ProductFilters
        filters={filters}
        selectedPrice={selectedPrice}
        customPrice={customPrice}
        onFilterChange={handleFilterChange}
        onPriceFilter={handlePriceFilter}
        onCustomPriceApply={applyCustomPrice}
      />
      <ProductGrid
        products={products}
        filters={filters}
        sortType={sortType}
        onSortChange={handleSortChange}
        onLoadMore={loadMore}
        isLastPage={isLastPage}
      />
    </div>
  );
}
