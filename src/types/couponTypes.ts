interface SellerInfo {
  seller_nickname: string;
}

interface CouponInfo {
  coupon_id: string;
  discount_cost: number;
  expiration_date: string;
  seller_info: SellerInfo;
}

export interface CouponType {
  coupon_info: CouponInfo;
  is_used: boolean;
}
