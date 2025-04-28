'use client';

import { useState, useEffect } from 'react';
import dynamic from 'next/dynamic';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { X } from 'lucide-react';

const CodeMirror = dynamic(
  () => import('@uiw/react-codemirror').then((mod) => mod.default),
  { ssr: false }
);

interface SnippetEditorProps {
  initialTitle?: string;
  initialLanguage?: string;
  initialCode?: string;
  initialTags?: string[];
  onSave: (data: {
    title: string;
    language: string;
    code: string;
    tags: string[];
  }) => void;
  onDelete?: () => void;
}

const languages = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'sql', label: 'SQL' },
  { value: 'xml', label: 'XML' },
];

export default function SnippetEditor({
  initialTitle = '',
  initialLanguage = 'javascript',
  initialCode = '',
  initialTags = [],
  onSave,
  onDelete,
}: SnippetEditorProps) {
  const [title, setTitle] = useState(initialTitle);
  const [language, setLanguage] = useState(initialLanguage);
  const [code, setCode] = useState(initialCode);
  const [tags, setTags] = useState<string[]>(initialTags);
  const [newTag, setNewTag] = useState('');
  const [extensions, setExtensions] = useState<any[]>([]);

  useEffect(() => {
    const loadExtensions = async () => {
      const { javascript } = await import('@codemirror/lang-javascript');
      setExtensions([javascript()]);
    };
    loadExtensions();
  }, []);

  const handleAddTag = () => {
    if (newTag.trim() && !tags.includes(newTag.trim())) {
      setTags([...tags, newTag.trim()]);
      setNewTag('');
    }
  };

  const handleRemoveTag = (tagToRemove: string) => {
    setTags(tags.filter((tag) => tag !== tagToRemove));
  };

  const handleSave = () => {
    onSave({
      title,
      language,
      code,
      tags,
    });
  };

  return (
    <div className="mx-auto max-w-7xl p-4">
      <div className="rounded-lg border bg-card shadow-sm">
        {/* Header */}
        <div className="flex items-center gap-4 border-b bg-muted/50 p-4">
          <Input
            placeholder="Untitled Snippet"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="w-64"
          />
          <Select value={language} onValueChange={setLanguage}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select language" />
            </SelectTrigger>
            <SelectContent>
              {languages.map((lang) => (
                <SelectItem key={lang.value} value={lang.value}>
                  {lang.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <div className="flex flex-1 items-center gap-2">
            <Input
              placeholder="Add tag"
              value={newTag}
              onChange={(e) => setNewTag(e.target.value)}
              onKeyDown={(e) => e.key === 'Enter' && handleAddTag()}
              className="w-32"
            />
            <Button variant="outline" size="sm" onClick={handleAddTag}>
              Add Tag
            </Button>
          </div>
          <div className="flex gap-2">
            <Button onClick={handleSave}>Save</Button>
            {onDelete && (
              <Button variant="destructive" onClick={onDelete}>
                Delete
              </Button>
            )}
          </div>
        </div>

        {/* Tags */}
        <div className="flex flex-wrap gap-2 border-b p-2">
          {tags.map((tag) => (
            <Badge key={tag} variant="secondary" className="flex items-center gap-1">
              {tag}
              <button
                onClick={() => handleRemoveTag(tag)}
                className="ml-1 rounded-full p-0.5 hover:bg-muted"
              >
                <X className="h-3 w-3" />
              </button>
            </Badge>
          ))}
        </div>

        {/* Code Editor */}
        <div className="h-[600px]">
          <CodeMirror
            value={code}
            height="100%"
            extensions={extensions}
            onChange={setCode}
            className="h-full w-full"
          />
        </div>
      </div>
    </div>
  );
} 