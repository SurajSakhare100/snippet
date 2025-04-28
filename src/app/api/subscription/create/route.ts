import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createSubscription } from '@/lib/razorpay';

export async function POST() {
  try {
    const session = await getServerSession(authOptions);

    if (!session?.user?.id) {
      return new NextResponse('Unauthorized', { status: 401 });
    }

    const subscription = await createSubscription(session.user.id);

    return NextResponse.json(subscription);
  } catch (error) {
    console.error('Subscription creation error:', error);
    return new NextResponse('Internal Server Error', { status: 500 });
  }
} 