export interface Order {
  order_id?: string;
  order_number?: string;
  order_items: OrderItem[];
  update_at: string;
}

export interface OrderItem {
  brand_name: string;
  image_url: string;
  product_id: number;
  product_name: string;
  product_price: number;
  quantity: number;
}

interface CartItemId {
  cart_item_id: number;
}

export type CartType = OrderItem & CartItemId;
