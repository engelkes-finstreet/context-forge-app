'use client';

import { useState } from 'react';
import { MarkdownEditor, FormMarkdownEditor } from '@/components/forms/fields/form-markdown-editor';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';

const initialContent = `# Welcome to the Markdown Editor Demo

This is a **fully-featured** markdown editor with live preview!

## Features

- **Bold** and *italic* text
- Lists (ordered and unordered)
- Code blocks with syntax highlighting
- Links and images
- Tables
- And much more!

### Code Example

\`\`\`typescript
function greet(name: string): string {
  return \`Hello, \${name}!\`;
}

console.log(greet('World'));
\`\`\`

### Task List

- [x] Research markdown editors
- [x] Install @uiw/react-md-editor
- [x] Create reusable component
- [x] Create demo page
- [ ] Use in actual forms

### Table Example

| Feature | Supported |
|---------|-----------|
| Preview | ✓ |
| Syntax Highlighting | ✓ |
| Dark Mode | ✓ |
| TypeScript | ✓ |

### Blockquote

> This editor supports blockquotes too!
> Great for highlighting important information.

---

**Try editing this content** to see the live preview in action!
`;

export default function MarkdownDemoPage() {
  const [basicValue, setBasicValue] = useState(initialContent);
  const [formValue, setFormValue] = useState('## Form Integration\n\nThis demonstrates how the editor can be integrated into forms with validation and error handling.');
  const [error, setError] = useState<string>();
  const [editOnlyValue, setEditOnlyValue] = useState('# Edit Only Mode\n\nThis editor is in edit-only mode.');
  const [previewOnlyValue, setPreviewOnlyValue] = useState('# Preview Only Mode\n\nThis shows the **rendered** markdown without the editor.');

  const handleValidate = () => {
    if (formValue.length < 10) {
      setError('Content must be at least 10 characters long');
    } else {
      setError(undefined);
      alert('Validation passed!');
    }
  };

  return (
    <div className="container py-8">
      <div className="mb-8">
        <h1 className="text-4xl font-bold tracking-tight mb-2">Markdown Editor Demo</h1>
        <p className="text-muted-foreground text-lg">
          Interactive examples of the integrated markdown editor component
        </p>
        <div className="flex gap-2 mt-4">
          <Badge variant="secondary">@uiw/react-md-editor</Badge>
          <Badge variant="secondary">TypeScript</Badge>
          <Badge variant="secondary">Next.js 15</Badge>
        </div>
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>Basic Editor</CardTitle>
            <CardDescription>
              Full-featured markdown editor with live preview. Edit the left side to see the preview update in real-time on the right.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <MarkdownEditor
              value={basicValue}
              onChange={setBasicValue}
              height={500}
              placeholder="Start typing your markdown..."
            />
            <div className="mt-4 p-4 bg-muted rounded-lg">
              <p className="text-sm font-medium mb-2">Character Count: {basicValue.length}</p>
              <p className="text-xs text-muted-foreground">
                The editor supports all standard markdown syntax including headings, lists, code blocks, tables, and more.
              </p>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Form Integration</CardTitle>
            <CardDescription>
              Editor component designed for form usage with labels, descriptions, and error handling.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <FormMarkdownEditor
              value={formValue}
              onChange={setFormValue}
              height={300}
              label="Task Description"
              description="Enter a detailed description for your task using markdown formatting"
              placeholder="Describe the task..."
              required
              error={error}
            />
            <div className="flex gap-2">
              <Button onClick={handleValidate}>Validate Content</Button>
              <Button variant="outline" onClick={() => setFormValue('')}>Clear</Button>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Different Preview Modes</CardTitle>
            <CardDescription>
              The editor supports three different modes: live (split view), edit (editor only), and preview (preview only).
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="live" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="live">Live (Split View)</TabsTrigger>
                <TabsTrigger value="edit">Edit Only</TabsTrigger>
                <TabsTrigger value="preview">Preview Only</TabsTrigger>
              </TabsList>
              <TabsContent value="live" className="mt-4">
                <MarkdownEditor
                  value={basicValue}
                  onChange={setBasicValue}
                  preview="live"
                  height={350}
                />
              </TabsContent>
              <TabsContent value="edit" className="mt-4">
                <MarkdownEditor
                  value={editOnlyValue}
                  onChange={setEditOnlyValue}
                  preview="edit"
                  height={350}
                />
              </TabsContent>
              <TabsContent value="preview" className="mt-4">
                <MarkdownEditor
                  value={previewOnlyValue}
                  onChange={setPreviewOnlyValue}
                  preview="preview"
                  height={350}
                />
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Customization Options</CardTitle>
            <CardDescription>
              The editor can be customized with different heights, disabled toolbar, and custom styling.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Compact Editor (200px height, no toolbar)</h3>
              <MarkdownEditor
                value="# Compact Mode\n\nThis is a more compact editor suitable for smaller content areas."
                height={200}
                hideToolbar={true}
              />
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Large Editor (600px height)</h3>
              <MarkdownEditor
                value="# Large Mode\n\nThis is a larger editor for more extensive content."
                height={600}
              />
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Usage Examples</CardTitle>
            <CardDescription>
              Code examples showing how to use the markdown editor components in your application.
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <h3 className="text-sm font-medium mb-2">Basic Usage</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`import { MarkdownEditor } from '@/components/forms/fields/form-markdown-editor';

function MyComponent() {
  const [value, setValue] = useState('');

  return (
    <MarkdownEditor
      value={value}
      onChange={setValue}
      height={400}
      placeholder="Enter markdown..."
    />
  );
}`}</code>
              </pre>
            </div>
            <div>
              <h3 className="text-sm font-medium mb-2">Form Integration</h3>
              <pre className="bg-muted p-4 rounded-lg overflow-x-auto">
                <code>{`import { FormMarkdownEditor } from '@/components/forms/fields/form-markdown-editor';

function MyForm() {
  const [value, setValue] = useState('');
  const [error, setError] = useState<string>();

  return (
    <FormMarkdownEditor
      value={value}
      onChange={setValue}
      label="Description"
      description="Enter a description"
      error={error}
      required
      height={300}
    />
  );
}`}</code>
              </pre>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
