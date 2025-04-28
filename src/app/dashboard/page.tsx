'use client';

import { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { SnippetCard } from '@/components/SnippetCard';

interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  tags: string[];
}

export default function DashboardPage() {
  const { data: session } = useSession();
  const [snippets, setSnippets] = useState<Snippet[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchSnippets = async () => {
      try {
        const response = await fetch('/api/snippets');
        if (!response.ok) throw new Error('Failed to fetch snippets');
        const data = await response.json();
        setSnippets(data);
      } catch (err) {
        console.error('Error fetching snippets:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchSnippets();
  }, []);

  if (!session) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center">
        <h1 className="text-2xl font-bold">Please sign in to view your snippets</h1>
        <Link href="/api/auth/signin">
          <Button className="mt-4">Sign In</Button>
        </Link>
      </div>
    );
  }

  if (loading) {
    return <div>Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <div className="mb-4 flex items-center justify-between">
        <h1 className="text-2xl font-bold">Your Snippets</h1>
        <Link href="/snippets/new">
          <Button>New Snippet</Button>
        </Link>
      </div>
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {snippets.map((snippet) => (
          <SnippetCard key={snippet.id} snippet={snippet} />
        ))}
      </div>
    </div>
  );
} 