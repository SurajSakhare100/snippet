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

  class Razorpay {
    [x: string]: any;
    constructor(options: RazorpayOptions);
    
    orders: {
      create(options: RazorpayOrder): Promise<{ id: string }>;
      fetch(orderId: string): Promise<any>;
      all(params?: any): Promise<any>;
    };
    
    payments: {
      fetch(paymentId: string): Promise<RazorpayPayment>;
      all(params?: any): Promise<any>;
      capture(paymentId: string, amount: number): Promise<any>;
    };
  }

  export = Razorpay;
} 