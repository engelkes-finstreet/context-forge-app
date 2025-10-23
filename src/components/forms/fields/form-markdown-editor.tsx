'use client';

import dynamic from 'next/dynamic';
import { useState } from 'react';
import '@uiw/react-md-editor/markdown-editor.css';
import '@uiw/react-markdown-preview/markdown.css';

const MDEditor = dynamic(
  () => import('@uiw/react-md-editor').then((mod) => mod.default),
  { ssr: false }
);

interface MarkdownEditorProps {
  value?: string;
  onChange?: (value: string | undefined) => void;
  height?: number;
  placeholder?: string;
  preview?: 'live' | 'edit' | 'preview';
  hideToolbar?: boolean;
  enableScroll?: boolean;
  className?: string;
}

export function MarkdownEditor({
  value,
  onChange,
  height = 400,
  placeholder = 'Enter markdown here...',
  preview = 'live',
  hideToolbar = false,
  enableScroll = true,
  className,
}: MarkdownEditorProps) {
  return (
    <div className={className} data-color-mode="auto">
      <MDEditor
        value={value}
        onChange={onChange}
        height={height}
        preview={preview}
        hideToolbar={hideToolbar}
        enableScroll={enableScroll}
        textareaProps={{
          placeholder,
        }}
      />
    </div>
  );
}

interface FormMarkdownEditorProps {
  value: string;
  onChange: (value: string) => void;
  onBlur?: () => void;
  error?: string;
  height?: number;
  placeholder?: string;
  preview?: 'live' | 'edit' | 'preview';
  hideToolbar?: boolean;
  label?: string;
  description?: string;
  required?: boolean;
}

export function FormMarkdownEditor({
  value,
  onChange,
  onBlur,
  error,
  height = 400,
  placeholder = 'Enter markdown here...',
  preview = 'live',
  hideToolbar = false,
  label,
  description,
  required = false,
}: FormMarkdownEditorProps) {
  const handleChange = (val: string | undefined) => {
    onChange(val || '');
  };

  return (
    <div className="space-y-2">
      {label && (
        <label className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70">
          {label}
          {required && <span className="text-destructive ml-1">*</span>}
        </label>
      )}
      {description && (
        <p className="text-sm text-muted-foreground">{description}</p>
      )}
      <div data-color-mode="auto">
        <MDEditor
          value={value}
          onChange={handleChange}
          onBlur={onBlur}
          height={height}
          preview={preview}
          hideToolbar={hideToolbar}
          textareaProps={{
            placeholder,
          }}
        />
      </div>
      {error && <p className="text-sm font-medium text-destructive">{error}</p>}
    </div>
  );
}
