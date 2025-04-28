'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { Navbar } from '@/components/navbar';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Skeleton } from '@/components/ui/skeleton';
import Link from 'next/link';

interface Snippet {
  _id: string;
  title: string;
  language: string;
  tags: string[];
  createdAt: string;
}

export default function DashboardPage() {
  const { data: session, status } = useSession();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (status === 'authenticated') {
      fetch('/api/snippets')
        .then((res) => res.json())
        .then((data) => {
          setSnippets(data.snippets);
          setLoading(false);
        });
    }
  }, [status]);

  if (status === 'loading') {
    return (
      <div className="flex min-h-screen flex-col">
        <Navbar />
        <main className="flex-1 p-4">
          <div className="container">
            <Skeleton className="h-8 w-48" />
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
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
            <h1 className="text-2xl font-bold">Please sign in to view your dashboard</h1>
            <Button asChild>
              <a href="/api/auth/signin">Sign In</a>
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
          <div className="flex items-center justify-between">
            <h1 className="text-2xl font-bold">Your Snippets</h1>
            <Button asChild>
              <a href="/snippets/new">New Snippet</a>
            </Button>
          </div>
          {loading ? (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {[...Array(6)].map((_, i) => (
                <Skeleton key={i} className="h-32" />
              ))}
            </div>
          ) : snippets.length === 0 ? (
            <div className="mt-8 text-center">
              <p className="text-muted-foreground">No snippets yet. Create your first one!</p>
            </div>
          ) : (
            <div className="mt-4 grid gap-4 md:grid-cols-2 lg:grid-cols-3">
              {snippets.map((snippet) => (
                <Card key={snippet._id}>
                  <CardHeader>
                    <Link href={`/snippets/${snippet._id}/edit`}>
                      <CardTitle>{snippet.title}</CardTitle>
                    </Link>
                  </CardHeader>
                  <CardContent>
                    <div className="flex flex-wrap gap-2">
                      {snippet.tags.map((tag) => (
                        <span
                          key={tag}
                          className="rounded-full bg-muted px-2 py-1 text-xs"
                        >
                          {tag}
                        </span>
                      ))}
                    </div>
                    <p className="mt-2 text-sm text-muted-foreground">
                      {new Date(snippet.createdAt).toLocaleDateString()}
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </div>
      </main>
    </div>
  );
} 