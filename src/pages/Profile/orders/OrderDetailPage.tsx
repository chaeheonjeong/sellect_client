import { useParams } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios, { AxiosError } from 'axios';
import OrderHeader from '@components/order/OrderHeader.jsx';
import PaymentSummary from '@components/order/PaymentSummary.tsx';
import { Order } from '../../../types/orderTypes.js';
import OrderItem from '@components/order/OrderItem.js';

interface OrderDetailType extends Order {
  discount_cost: number;
  total_price: number;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL; // ✅ 환경 변수 사용

function OrderDetailPage() {
  const { orderId } = useParams();
  const [order, setOrder] = useState<OrderDetailType>();
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderDetail = async () => {
      try {
        const response = await axios.get(
          `${API_BASE_URL}/api/v1/orders/${orderId}`,
          {
            withCredentials: true, // ✅ 쿠키 포함하여 인증 요청
          }
        );

        if (response.data.is_success && response.data.result) {
          setOrder({
            ...response.data.result,
            order_items: response.data.result.order_items || [], // ✅ `order_items`이 없으면 빈 배열 설정
          });
        } else {
          throw new Error(
            response.data.message || '❌ 주문 정보를 가져오는 데 실패했습니다.'
          );
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchOrderDetail();
  }, [orderId]);

  if (loading) {
    return (
      <div className='text-center py-12'>📦 주문 정보를 불러오는 중...</div>
    );
  }
  if (!order) {
    return (
      <div className='text-center py-12'>❌ 주문 정보를 찾을 수 없습니다.</div>
    );
  }

  const totalPrice = order.total_price;
  const discount = order.discount_cost;
  const finalPrice = totalPrice - discount;

  return (
    <div className='pt-12 bg-gray-50 min-h-screen'>
      <div className='max-w-3xl mx-auto px-4 py-8'>
        <h1 className='text-2xl font-bold text-gray-900 mb-4'>📦 주문 상세</h1>
        <div className='bg-white p-6 rounded-lg shadow-md border-t border-gray-200'>
          <OrderHeader
            order_number={order.order_number}
            update_at={order.update_at}
          />
          <div className='mt-4'>
            <h3 className='text-lg font-semibold text-gray-900 mb-3'>
              🛍 주문 상품
            </h3>
            <div className='flex flex-col gap-4'>
              {order.order_items?.map((item) => (
                <OrderItem
                  key={item.product_id}
                  brand_name={item.brand_name}
                  image_url={item.image_url}
                  product_id={item.product_id}
                  product_name={item.product_name}
                  product_price={item.product_price}
                  quantity={item.quantity}
                />
              ))}
            </div>
          </div>
          <PaymentSummary
            totalPrice={totalPrice}
            discount={discount}
            finalPrice={finalPrice}
          />
        </div>
      </div>
    </div>
  );
}

export default OrderDetailPage;
