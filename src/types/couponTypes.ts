import CouponInfo from '@/pages/Order/components/CouponItem';

interface CouponIdentity {
  coupon_id: string;
  discount_cost: number;
  expiration_date: string;
}

interface SellerInfo {
  seller_nickname: string;
  seller_id: string;
}

interface CouponInfo extends CouponIdentity {
  seller_info: SellerInfo;
}

interface CouponOrderInfo {
  user_received_coupon_id: string;
}

export type CouponProfileType = {
  coupon_info: CouponInfo;
  is_used: boolean;
};

export type CouponOrderType = CouponIdentity & CouponOrderInfo;

export type CouponDownloadType = {
  coupon_info: CouponInfo;
  is_registered: boolean;
};
