'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { useSession, Session } from 'next-auth/react';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ThemeToggle } from '@/components/theme-toggle';
import { UserAvatar } from '@/components/user-avatar';

interface NavbarProps {}

export function Navbar({}: NavbarProps) {
  const pathname = usePathname();
  const { data: session, status } = useSession();

  const isActive = (path: string): boolean => pathname === path;

  return (
    <nav className="border-b">
      <div className="flex h-16 items-center px-4">
        <div className="flex items-center space-x-4">
          <Link href="/" className="font-bold">
            Code Snippets
          </Link>
          {session && (
            <>
              <Link
                href="/dashboard"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/dashboard') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Dashboard
              </Link>
              <Link
                href="/snippets"
                className={`text-sm font-medium transition-colors hover:text-primary ${
                  isActive('/snippets') ? 'text-primary' : 'text-muted-foreground'
                }`}
              >
                Snippets
              </Link>
            </>
          )}
        </div>
        <div className="ml-auto flex items-center space-x-4">
          <ThemeToggle />
          {status === 'loading' ? (
            <div className="h-8 w-8 animate-pulse rounded-full bg-muted" />
          ) : session ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="relative h-8 w-8 rounded-full">
                  <UserAvatar user={session.user} />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end">
                <DropdownMenuItem asChild>
                  <Link href="/settings">Settings</Link>
                </DropdownMenuItem>
                <DropdownMenuItem asChild>
                  <Link href="/api/auth/signout">Sign Out</Link>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button asChild>
              <Link href="/api/auth/signin">Sign In</Link>
            </Button>
          )}
        </div>
      </div>
    </nav>
  );
} 