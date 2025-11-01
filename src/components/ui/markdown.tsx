import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { cn } from "@/lib/utils";

interface MarkdownProps {
  content: string;
  className?: string;
}

/**
 * Markdown Renderer Component
 *
 * Renders markdown content with TailwindCSS typography plugin styling.
 * Supports GitHub Flavored Markdown (GFM) for tables, task lists, strikethrough, etc.
 */
export function Markdown({ content, className }: MarkdownProps) {
  return (
    <div
      className={cn(
        "prose prose-slate dark:prose-invert max-w-none",
        "prose-headings:font-bold prose-headings:tracking-tight",
        "prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl",
        "prose-p:text-foreground prose-p:leading-relaxed",
        "prose-a:text-primary prose-a:no-underline hover:prose-a:underline",
        "prose-code:text-primary prose-code:bg-muted prose-code:px-1.5 prose-code:py-0.5 prose-code:rounded prose-code:before:content-none prose-code:after:content-none",
        "prose-pre:bg-muted prose-pre:border prose-pre:border-border",
        "prose-blockquote:border-l-primary prose-blockquote:text-muted-foreground",
        "prose-strong:text-foreground prose-strong:font-semibold",
        "prose-ul:list-disc prose-ol:list-decimal",
        "prose-li:text-foreground",
        "prose-table:border-collapse prose-table:border prose-table:border-border",
        "prose-th:bg-muted prose-th:border prose-th:border-border prose-th:px-4 prose-th:py-2",
        "prose-td:border prose-td:border-border prose-td:px-4 prose-td:py-2",
        "prose-img:rounded-lg prose-img:shadow-md",
        className,
      )}
    >
      <ReactMarkdown remarkPlugins={[remarkGfm]}>{content}</ReactMarkdown>
    </div>
  );
}
