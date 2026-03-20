export type SubscriptionStatus = "ACTIVE" | "PAYMENT_OVERDUE" | "SUSPENDED" | "CANCELLED";
export type InvoiceStatus = "PENDING" | "PAID" | "OVERDUE" | "DISPUTED" | "VOIDED";
export type PaymentMethod = "BANK_TRANSFER" | "CARD" | "USSD" | "MANUAL";
export type Currency = "NGN";

export interface Subscription {
  id: string;
  tenant_id: string;
  session_id: string;
  status: SubscriptionStatus;
  price_per_student_per_term: number;
  currency: Currency;
  start_date: Date;
  end_date?: Date;
  cancelled_at?: Date;
  cancellation_reason?: string;
  created_at: Date;
  updated_at: Date;
}

export interface InvoiceLineItem {
  description: string;
  quantity: number;
  unit_price: number;
  amount: number;
}

export interface Invoice {
  id: string;
  tenant_id: string;
  subscription_id: string;
  term_id: string;
  invoice_number: string;
  status: InvoiceStatus;
  currency: Currency;
  line_items: InvoiceLineItem[];
  subtotal_amount: number;
  tax_amount: number;
  discount_amount: number;
  total_amount: number;
  student_count: number;
  due_date: Date;
  issued_date: Date;
  paid_at?: Date;
  payment_method?: PaymentMethod;
  payment_reference?: string;
  notes?: string;
  billing_email: string;
  pdf_url?: string;
  created_at: Date;
  updated_at: Date;
  disputed_at?: Date;
  dispute_reason?: string;
  voided_at?: Date;
  void_reason?: string;
}

export type BillingAdjustmentType = "CREDIT" | "DISCOUNT" | "CHARGE" | "REFUND";

export interface BillingAdjustment {
  id: string;
  tenant_id: string;
  invoice_id?: string;
  type: BillingAdjustmentType;
  amount: number;
  currency: Currency;
  reason: string;
  applied_by: string;
  created_at: Date;
}
