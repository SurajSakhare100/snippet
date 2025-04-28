'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import SnippetEditor from '@/components/SnippetEditor';

type Snippet = {
  title: string;
  language: string;
  code: string;
  tags: string[];
};

export default function EditSnippetPageClient({ snippet, id }: { snippet: Snippet; id: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const handleSave = async (data: Snippet) => {
    try {
      setLoading(true);
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
      toast.error('Failed to update snippet');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    try {
      setLoading(true);
      const response = await fetch(`/api/snippets/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete snippet');

      toast.success('Snippet deleted successfully');
      router.push('/snippets');
    } catch (error) {
      toast.error('Failed to delete snippet');
    } finally {
      setLoading(false);
    }
  };

  if (loading) {
    return <div>Loading...</div>;
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
