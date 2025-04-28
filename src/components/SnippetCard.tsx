'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Pencil, Trash2 } from 'lucide-react';

interface SnippetCardProps {
  snippet: {
    id: string;
    title: string;
    language: string;
    code: string;
    tags: string[];
  };
  onDelete?: () => void;
}

export default function SnippetCard({ snippet, onDelete }: SnippetCardProps) {
  const router = useRouter();
  const [isDeleting, setIsDeleting] = useState(false);

  const handleEdit = () => {
    router.push(`/snippets/${snippet.id}/edit`);
  };

  const handleDelete = async () => {
    if (!confirm('Are you sure you want to delete this snippet?')) return;

    setIsDeleting(true);
    try {
      const response = await fetch(`/api/snippets/${snippet.id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete snippet');

      toast.success('Snippet deleted successfully');
      onDelete?.();
    } catch (error) {
      toast.error('Failed to delete snippet');
    } finally {
      setIsDeleting(false);
    }
  };

  return (
    <div className="group relative rounded-lg border bg-card p-4 shadow-sm transition-all hover:shadow-md">
      <div className="absolute right-2 top-2 flex gap-2 opacity-0 transition-opacity group-hover:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleEdit}
          className="h-8 w-8"
        >
          <Pencil className="h-4 w-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          onClick={handleDelete}
          disabled={isDeleting}
          className="h-8 w-8 text-destructive hover:text-destructive"
        >
          <Trash2 className="h-4 w-4" />
        </Button>
      </div>

      <h3 className="mb-2 text-lg font-semibold">{snippet.title}</h3>
      <div className="mb-4 flex flex-wrap gap-2">
        {snippet.tags.map((tag) => (
          <Badge key={tag} variant="secondary">
            {tag}
          </Badge>
        ))}
      </div>
      <div className="rounded-md bg-muted p-4">
        <pre className="overflow-x-auto text-sm">
          <code>{snippet.code}</code>
        </pre>
      </div>
    </div>
  );
} 