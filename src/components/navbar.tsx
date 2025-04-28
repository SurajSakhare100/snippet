'use client';

import Link from 'next/link';
import { useSession } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './theme-toggle';

interface NavbarProps {
  className?: string;
}

export function Navbar({ className }: NavbarProps) {
  const { data: session } = useSession();

  return (
    <nav className={`flex items-center justify-between p-4 ${className}`}>
      <Link href="/" className="text-xl font-bold">
        Snippet
      </Link>
      <div className="flex items-center gap-4">
        <ThemeToggle />
        {session ? (
          <Link href="/dashboard">
            <Button variant="outline">Dashboard</Button>
          </Link>
        ) : (
          <Link href="/api/auth/signin">
            <Button>Sign In</Button>
          </Link>
        )}
      </div>
    </nav>
  );
} 