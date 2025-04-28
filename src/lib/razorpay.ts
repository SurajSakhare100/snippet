import Razorpay from 'razorpay';
import { connectDB } from './mongodb';
import User from '@/models/User';

if (!process.env.RAZORPAY_KEY_ID || !process.env.RAZORPAY_KEY_SECRET) {
  throw new Error('Razorpay credentials are not configured');
}

export const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

export const SUBSCRIPTION_PLANS = {
  pro: {
    name: 'Pro Plan',
    description: 'Unlimited snippets and advanced features',
    amount: 999, // ₹999/month
    currency: 'INR',
    interval: 'monthly',
  },
};

export async function createSubscription(userId: string) {
  await connectDB();
  const user = await User.findById(userId);
  
  if (!user) {
    throw new Error('User not found');
  }

  const subscription = await razorpay.subscriptions.create({
    plan_id: process.env.RAZORPAY_PLAN_ID!,
    customer_notify: 1,
    total_count: 12, // 12 months subscription
    notes: {
      userId: userId,
    },
  });

  return subscription;
}

export async function handleWebhook(payload: any, signature: string) {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET!;
  
  const crypto = require('crypto');
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(payload))
    .digest('hex');

  if (expectedSignature !== signature) {
    throw new Error('Invalid webhook signature');
  }

  await connectDB();

  switch (payload.event) {
    case 'subscription.charged':
      await handleSubscriptionCharged(payload);
      break;
    case 'subscription.cancelled':
      await handleSubscriptionCancelled(payload);
      break;
    default:
      console.log('Unhandled webhook event:', payload.event);
  }
}

async function handleSubscriptionCharged(payload: any) {
  const { subscription_id, customer_id } = payload.payload.subscription.entity;
  
  await User.findOneAndUpdate(
    { 'subscription.stripeSubscriptionId': subscription_id },
    {
      'subscription.status': 'pro',
      'subscription.currentPeriodEnd': new Date(payload.payload.subscription.entity.current_end),
    }
  );
}

async function handleSubscriptionCancelled(payload: any) {
  const { subscription_id } = payload.payload.subscription.entity;
  
  await User.findOneAndUpdate(
    { 'subscription.stripeSubscriptionId': subscription_id },
    {
      'subscription.status': 'free',
      'subscription.currentPeriodEnd': null,
    }
  );
} 