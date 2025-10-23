import { PageHeader } from '@/components/ui/page-header';
import { PageContent } from '@/components/ui/page-content';
import { Card, CardContent } from '@/components/ui/card';

export default function MarkdownExamplePage() {
  return (
    <>
      <PageHeader>
        <PageHeader.Title
          title="Markdown Typography Example"
          subtitle="Demonstrating @tailwindcss/typography plugin with prose classes"
        />
      </PageHeader>

      <PageContent>
        <Card>
          <CardContent className="pt-6">
            {/* The prose class from @tailwindcss/typography provides beautiful default styles for markdown */}
            <div className="prose prose-lg dark:prose-invert max-w-none">
              <h1>Typography Plugin Demo</h1>
              <p className="lead">
                This page demonstrates the Tailwind CSS Typography plugin with various markdown elements.
                The plugin provides beautiful typographic defaults for HTML you don't control.
              </p>

              <h2>Headings</h2>
              <p>
                All heading levels are styled appropriately with the typography plugin. Here's how they look:
              </p>
              <h1>Heading 1</h1>
              <h2>Heading 2</h2>
              <h3>Heading 3</h3>
              <h4>Heading 4</h4>
              <h5>Heading 5</h5>
              <h6>Heading 6</h6>

              <h2>Paragraphs and Text Formatting</h2>
              <p>
                This is a standard paragraph with <strong>bold text</strong>, <em>italic text</em>,
                and <code>inline code</code>. You can also use <a href="#">links</a> and they'll be
                styled automatically.
              </p>
              <p>
                The typography plugin handles proper spacing between paragraphs, ensuring your content
                is readable and aesthetically pleasing without any additional styling effort.
              </p>

              <h2>Lists</h2>
              <h3>Unordered Lists</h3>
              <ul>
                <li>First item in the list</li>
                <li>Second item with more content
                  <ul>
                    <li>Nested item one</li>
                    <li>Nested item two</li>
                  </ul>
                </li>
                <li>Third item back at root level</li>
              </ul>

              <h3>Ordered Lists</h3>
              <ol>
                <li>First step in the process</li>
                <li>Second step with details
                  <ol>
                    <li>Sub-step A</li>
                    <li>Sub-step B</li>
                  </ol>
                </li>
                <li>Final step to complete</li>
              </ol>

              <h2>Blockquotes</h2>
              <blockquote>
                <p>
                  This is a blockquote. It's perfect for highlighting important quotes or
                  callouts in your content. The typography plugin styles these beautifully
                  with appropriate padding and border.
                </p>
              </blockquote>

              <h2>Code Blocks</h2>
              <p>Inline code like <code>const example = true;</code> is styled differently from code blocks:</p>
              <pre><code>{`function greet(name) {
  console.log(\`Hello, \${name}!\`);
  return true;
}

// Call the function
greet('World');`}</code></pre>

              <h2>Tables</h2>
              <table>
                <thead>
                  <tr>
                    <th>Feature</th>
                    <th>Description</th>
                    <th>Status</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>Typography Plugin</td>
                    <td>Beautiful default styles for markdown content</td>
                    <td>✅ Active</td>
                  </tr>
                  <tr>
                    <td>Dark Mode</td>
                    <td>Automatic dark mode support with prose-invert</td>
                    <td>✅ Active</td>
                  </tr>
                  <tr>
                    <td>Responsive Design</td>
                    <td>Scales beautifully on all screen sizes</td>
                    <td>✅ Active</td>
                  </tr>
                </tbody>
              </table>

              <h2>Horizontal Rules</h2>
              <p>You can use horizontal rules to separate sections:</p>
              <hr />
              <p>Like this! The typography plugin styles these appropriately too.</p>

              <h2>Images</h2>
              <p>
                Images are also styled by the typography plugin (note: placeholder shown for demo):
              </p>
              <figure>
                <img
                  src="https://via.placeholder.com/800x400/6366f1/ffffff?text=Markdown+Image+Example"
                  alt="Example image demonstrating typography plugin"
                />
                <figcaption>
                  Figure captions are styled beautifully as well
                </figcaption>
              </figure>

              <h2>Additional Elements</h2>
              <h3>Definition Lists</h3>
              <dl>
                <dt>Typography Plugin</dt>
                <dd>A Tailwind CSS plugin that provides beautiful typographic defaults</dd>
                <dt>Prose Classes</dt>
                <dd>The set of classes (prose, prose-lg, prose-invert) used to apply typography styles</dd>
              </dl>

              <h3>Task Lists</h3>
              <ul>
                <li><input type="checkbox" checked disabled /> Completed task</li>
                <li><input type="checkbox" disabled /> Pending task</li>
                <li><input type="checkbox" disabled /> Another pending task</li>
              </ul>

              <h2>Color Variants</h2>
              <p>
                The typography plugin works seamlessly with your theme. Toggle dark mode to see
                the <code>prose-invert</code> class automatically adjust all typography colors
                for optimal readability.
              </p>

              <h2>Conclusion</h2>
              <p>
                The Tailwind CSS Typography plugin is an essential tool for any content-heavy
                application. It provides sensible defaults that make your markdown content look
                professional without any additional styling effort. Simply wrap your content in
                a <code>prose</code> class and you're good to go!
              </p>
            </div>
          </CardContent>
        </Card>
      </PageContent>
    </>
  );
}
