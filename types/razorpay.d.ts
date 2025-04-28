declare module 'razorpay' {
  interface RazorpayOptions {
    key_id: string;
    key_secret: string;
  }

  interface RazorpayOrder {
    amount: number;
    currency: string;
    receipt?: string;
    notes?: Record<string, string>;
  }

  interface RazorpayPayment {
    id: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    method: string;
    created_at: number;
  }

  interface RazorpayOrderResponse {
    id: string;
    amount: number;
    currency: string;
    receipt: string;
    status: string;
    attempts: number;
    notes: Record<string, string>;
    created_at: number;
  }

  interface RazorpayPaymentResponse {
    id: string;
    amount: number;
    currency: string;
    status: string;
    order_id: string;
    method: string;
    created_at: number;
    email: string;
    contact: string;
    notes: Record<string, string>;
  }

  interface RazorpayListParams {
    count?: number;
    skip?: number;
    from?: number;
    to?: number;
  }

  class Razorpay {
    constructor(options: RazorpayOptions);
    
    orders: {
      create(options: RazorpayOrder): Promise<RazorpayOrderResponse>;
      fetch(orderId: string): Promise<RazorpayOrderResponse>;
      all(params?: RazorpayListParams): Promise<{ items: RazorpayOrderResponse[] }>;
    };
    
    payments: {
      fetch(paymentId: string): Promise<RazorpayPaymentResponse>;
      all(params?: RazorpayListParams): Promise<{ items: RazorpayPaymentResponse[] }>;
      capture(paymentId: string, amount: number): Promise<RazorpayPaymentResponse>;
    };
  }

  export = Razorpay;
} 