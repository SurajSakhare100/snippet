'use client';

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import SnippetEditor from '@/components/SnippetEditor';
import { toast } from 'sonner';

interface Snippet {
  id: string;
  title: string;
  language: string;
  code: string;
  tags: string[];
}

export default function EditSnippetPage() {
  const router = useRouter();
  const [snippet, setSnippet] = useState<Snippet | null>(null);
  const [loading, setLoading] = useState(true);
  const params = useParams<{ id: string }>();
  const id = params.id;

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await fetch(`/api/snippets/${id}`);
        if (!response.ok) throw new Error('Failed to fetch snippet');
        const data = await response.json();
        setSnippet(data);
      } catch (error) {
        console.log(error);
        toast.error('Failed to load snippet');
        router.push('/snippets');
      } finally {
        setLoading(false);
      }
    };

    fetchSnippet();
  }, [id, router]);

  const handleSave = async (data: {
    title: string;
    language: string;
    code: string;
    tags: string[];
  }) => {
    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });

      if (!response.ok) throw new Error('Failed to update snippet');

      toast.success('Snippet updated successfully');
      router.push('/snippets');
    } catch (error) {
      
      console.log(error);
      toast.error('Failed to update snippet');
    }
  };

  const handleDelete = async () => {
    try {
      const response = await fetch(`/api/snippets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete snippet');

      toast.success('Snippet deleted successfully');
      router.push('/snippets');
    } catch (error) {
      
      console.log(error);
      toast.error('Failed to delete snippet');
    }
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!snippet) {
    return null;
  }

  return (
    <div className="h-[calc(100vh-4rem)]">
      <SnippetEditor
        initialTitle={snippet.title}
        initialLanguage={snippet.language}
        initialCode={snippet.code}
        initialTags={snippet.tags}
        onSave={handleSave}
        onDelete={handleDelete}
      />
    </div>
  );
} 