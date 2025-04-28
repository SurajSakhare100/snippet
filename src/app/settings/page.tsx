'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface Subscription {
  status: 'free' | 'pro';
  currentPeriodEnd?: Date;
}

export default function SettingsPage() {
  const { data: session, status } = useSession();
  const [subscription, setSubscription] = useState<Subscription | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      setSubscription(session?.user?.subscription);
      setLoading(false);
    }
  }, [status, session]);

  const handleUpgrade = async () => {
    try {
      const response = await fetch('/api/subscription/create', {
        method: 'POST',
      });

      if (!response.ok) {
        throw new Error('Failed to create subscription');
      }

      const data = await response.json();
      window.location.href = data.url; // Redirect to Razorpay checkout
    } catch (error) {
      console.error('Error upgrading subscription:', error);
    }
  };

  if (status === 'loading' || loading) {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 p-4">
          <div className="container">
            <Skeleton className="h-8 w-48" />
            <div className="mt-8">
              <Skeleton className="h-32" />
            </div>
          </div>
        </main>
      </div>
    );
  }

  if (status === 'unauthenticated') {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 p-4">
          <div className="container flex flex-col items-center justify-center gap-4 py-24 text-center">
            <h1 className="text-2xl font-bold">Please sign in to view settings</h1>
            <Button asChild>
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          </div>
        </main>
      </div>
    );
  }

  return (
    <div className="flex min-h-screen flex-col">
      <Navbar />
      <main className="flex-1 p-4">
        <div className="container">
          <h1 className="mb-8 text-2xl font-bold">Settings</h1>
          <Card>
            <CardHeader>
              <CardTitle>Subscription</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium">Current Plan</p>
                  <p className="text-2xl font-bold">
                    {subscription?.status === 'pro' ? 'Pro' : 'Free'}
                  </p>
                </div>
                {subscription?.status === 'pro' && subscription.currentPeriodEnd && (
                  <div>
                    <p className="text-sm font-medium">Next Billing Date</p>
                    <p>
                      {new Date(subscription.currentPeriodEnd).toLocaleDateString()}
                    </p>
                  </div>
                )}
                {subscription?.status === 'free' ? (
                  <Button onClick={handleUpgrade}>Upgrade to Pro</Button>
                ) : (
                  <Button variant="destructive">Cancel Subscription</Button>
                )}
              </div>
            </CardContent>
          </Card>
        </div>
      </main>
    </div>
  );
} 