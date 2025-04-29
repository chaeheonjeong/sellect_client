type PaymentStatus = 'DONE' | 'APPROVE' | 'READY' | 'FAIL' | 'CANCEL';

export interface PaymentHistoryType {
  created_at: string;
  id: string;
  order_id: string;
  pid: string;
  price: number;
  status: PaymentStatus;
}
