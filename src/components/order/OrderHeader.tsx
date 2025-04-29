import { Link } from 'react-router-dom';
import { Order } from '@/types/orderTypes';

interface OrderHeaderProps
  extends Pick<Order, 'order_id' | 'update_at' | 'order_number'> {
  showDetailLink?: boolean;
}

function OrderHeader({
  order_id,
  order_number,
  update_at,
  showDetailLink = false,
}: OrderHeaderProps) {
  const orderDate = new Date(update_at);
  const formattedDate = orderDate
    ? `${orderDate.getFullYear()}. ${
        orderDate.getMonth() + 1
      }. ${orderDate.getDate()}`
    : '날짜 없음';

  return (
    <div className='flex flex-col sm:flex-row justify-between items-start sm:items-center pb-4'>
      <p className='text-lg font-bold text-gray-900'>{formattedDate} 주문</p>
      {showDetailLink ? (
        <Link
          to={`/order/${order_id}`}
          className='text-sm text-blue-600 hover:text-blue-800 border border-blue-600 hover:border-blue-800 rounded px-4 py-2 mt-2 sm:mt-0'
        >
          주문 상세 보기
        </Link>
      ) : (
        order_number && (
          <p className='text-sm text-gray-500 mt-1 sm:mt-0'>
            주문번호 {order_number}
          </p>
        )
      )}
    </div>
  );
}

export default OrderHeader;
