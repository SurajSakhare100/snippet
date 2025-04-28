'use client';

import { useEffect, useState } from 'react';
import dynamic from 'next/dynamic';
// import { oneDark } from '@codemirror/theme-one-dark';

interface CodeEditorProps {
  value: string;
  language: string;
  onChange?: (value: string) => void;
  readOnly?: boolean;
}

const CodeMirror = dynamic(
  () => import('@uiw/react-codemirror').then((mod) => mod.default),
  { ssr: false }
);

export default function CodeEditor({
  value,
  onChange,
  readOnly = false,
}: CodeEditorProps) {
  const [extensions, setExtensions] = useState<any[]>([]);

  useEffect(() => {
    const loadExtensions = async () => {
      const { javascript } = await import('@codemirror/lang-javascript');
      setExtensions([javascript()]);
    };
    loadExtensions();
  }, []);

  return (
    <CodeMirror
      value={value}
      height="100%"
      // theme={oneDark}
      extensions={extensions}
      onChange={onChange}
      readOnly={readOnly}
      className="h-full w-full"
    />
  );
} 