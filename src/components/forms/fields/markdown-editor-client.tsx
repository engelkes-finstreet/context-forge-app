"use client";

import dynamic from "next/dynamic";
import { useState, useEffect } from "react";
import { useTheme } from "next-themes";
import "@uiw/react-md-editor/markdown-editor.css";

// Dynamically import MDEditor with SSR disabled
const MDEditor = dynamic(() => import("@uiw/react-md-editor"), {
  ssr: false,
});

interface MarkdownEditorClientProps {
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  height?: number;
}

/**
 * Client-side wrapper for @uiw/react-md-editor
 *
 * This component handles the dynamic import of the markdown editor
 * which requires browser APIs and cannot be server-side rendered.
 */
export function MarkdownEditorClient({
  value,
  onChange,
  placeholder,
  height = 500,
}: MarkdownEditorClientProps) {
  const [mounted, setMounted] = useState(false);
  const { theme, resolvedTheme } = useTheme();

  // Ensure component only renders on client
  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return (
      <div
        className="border rounded-md bg-muted/30 flex items-center justify-center text-sm text-muted-foreground"
        style={{ height }}
      >
        Loading editor...
      </div>
    );
  }

  // Use resolvedTheme to get the actual theme (light/dark), fallback to theme
  const colorMode = (resolvedTheme || theme) as "light" | "dark";

  return (
    <div data-color-mode={colorMode}>
      <MDEditor
        value={value}
        onChange={(val) => onChange(val || "")}
        height={height}
        preview="live"
        hideToolbar={false}
        enableScroll={true}
        visibleDragbar={false}
        highlightEnable={true}
        textareaProps={{
          placeholder: placeholder || "Write your markdown here...",
        }}
      />
    </div>
  );
}
