import { useState, useEffect } from 'react';
import { Link, replace, useNavigate } from 'react-router-dom';
import CartItem from '@pages/Cart/components/CartItem.jsx';
import { useAuth } from '@context/AuthContext.jsx';
import useApiService from '@services/ApiService.ts';
import { CartType } from '@/types/orderTypes';
import { isAxiosError } from 'axios';

function CartPage() {
  const [cartItems, setCartItems] = useState<CartType[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();
  const { updateCartCount } = useAuth();
  const { get, post, patch, del } = useApiService();

  // ✅ 장바구니 데이터 불러오기
  useEffect(() => {
    const fetchCartItems = async () => {
      try {
        const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
        if (!baseApiUrl)
          throw new Error('VITE_API_BASE_URL이 정의되지 않았습니다.');

        const response = await get(`${baseApiUrl}/api/v1/carts`);

        if (response.data.is_success) {
          setCartItems(response.data.result);
        }
      } catch (error: unknown) {
        if (isAxiosError(error)) {
          console.error(
            '❌ 장바구니 조회 오류:',
            error.response?.data || error.message
          );
        }
      } finally {
        setLoading(false);
      }
    };

    fetchCartItems();
  }, []);

  // ✅ 수량 변경 요청
  const changeQuantity = async (cartItemId: number, change: number) => {
    try {
      if (!cartItemId) {
        alert('상품 ID가 올바르지 않습니다.');
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
      const response = await patch(`${baseApiUrl}/api/v1/carts/${cartItemId}`, {
        cart_item_id: cartItemId,
        quantity: change,
      });
      if (response.data.is_success) {
        const updatedItem = response.data.result;
        setCartItems((prevItems) =>
          prevItems.map((item) =>
            item.cart_item_id === updatedItem.id
              ? { ...item, quantity: updatedItem.quantity }
              : item
          )
        );
      } else {
        console.error('❌ 수량 변경 실패:', response.data.message);
      }
    } catch (error: unknown) {
      if (isAxiosError(error)) {
        console.error(
          '❌ 수량 변경 오류:',
          error.response?.data || error.message
        );
      }
    }
  };

  // ✅ 장바구니 아이템 삭제 요청
  const removeItem = async (cartItemId: number) => {
    try {
      if (!cartItemId) {
        alert('상품 ID가 올바르지 않습니다.');
        return;
      }

      const baseApiUrl = import.meta.env.VITE_API_BASE_URL;

      const response = await del(`${baseApiUrl}/api/v1/carts/${cartItemId}`);

      if (response.data.is_success) {
        setCartItems((prevItems) =>
          prevItems.filter((item) => item.cart_item_id !== cartItemId)
        );
        updateCartCount();
      } else {
        console.error('❌ 삭제 실패:', response.data.message);
        alert('장바구니 삭제에 실패했습니다.');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error('❌ 삭제 오류:', error.response?.data || error.message);
      }
    }
  };

  // ✅ 주문 생성 요청
  const createOrder = async () => {
    try {
      const baseApiUrl = import.meta.env.VITE_API_BASE_URL;
      if (!baseApiUrl)
        throw new Error('VITE_API_BASE_URL이 정의되지 않았습니다.');

      const orderData = {
        total_price: cartItems
          .reduce(
            (acc, item) =>
              acc + BigInt(item.product_price) * BigInt(item.quantity),
            BigInt(0)
          )
          .toString(),
        order_items: cartItems.map((item) => ({
          product_id: item.product_id,
          price: BigInt(item.product_price).toString(),
          quantity: item.quantity,
        })),
      };

      const response = await post(
        `${baseApiUrl}/api/v1/order/pending`,
        orderData
      );
      console.log('✅ 주문 생성 응답:', response.data);
      if (response.data.is_success) {
        const orderId = response.data.result.order_id;
        console.log('✅ 주문 생성 성공, 주문 ID:', orderId);
        navigate('/order/form', { state: { orderId } });
      } else {
        console.error('❌ 주문 생성 실패:', response.data.message);
        alert('주문 생성에 실패했습니다.');
      }
    } catch (error) {
      if (isAxiosError(error)) {
        console.error(
          '❌ 주문 생성 오류:',
          error.response?.data || error.message
        );
      }
    }
  };

  if (loading) {
    return <div className='pt-12 text-center'>장바구니 로딩 중...</div>;
  }

  return (
    <div className='pt-12 bg-gray-50 min-h-screen'>
      <div className='max-w-3xl mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>장바구니</h1>
        <div className='bg-white p-6 rounded-lg shadow-md border-t border-gray-200'>
          <h3 className='text-lg font-semibold text-gray-900 mb-3'>
            장바구니 상품
          </h3>
          <div className='flex flex-col gap-4'>
            {cartItems.length === 0 ? (
              <p className='text-gray-500'>장바구니가 비어 있습니다.</p>
            ) : (
              cartItems.map((item) => (
                <CartItem
                  key={item.cart_item_id}
                  item={item}
                  changeQuantity={changeQuantity}
                  removeItem={removeItem}
                />
              ))
            )}
          </div>
          <div className='mt-6'>
            <button
              onClick={createOrder}
              className='w-full py-2.5 bg-indigo-600 text-white font-semibold rounded-md text-base hover:bg-indigo-700 transition'
            >
              주문하기
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

export default CartPage;
