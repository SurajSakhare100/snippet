import { NextResponse } from 'next/server';
import { handleWebhook } from '@/lib/razorpay';

export async function POST(req: Request) {
  try {
    const signature = req.headers.get('x-razorpay-signature');
    const payload = await req.json();

    if (!signature) {
      return new NextResponse('Missing signature', { status: 400 });
    }

    await handleWebhook(payload, signature);

    return new NextResponse('Webhook processed', { status: 200 });
  } catch (error) {
    console.error('Webhook error:', error);
    return new NextResponse('Webhook error', { status: 400 });
  }
} 