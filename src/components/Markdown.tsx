import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import type { Components } from 'react-markdown'
import { CodeBlock } from './CodeBlock'

const components: Components = {
  code(props) {
    const { className, children } = props
    const match = /language-(\w+)/.exec(className || '')
    const text = String(children).replace(/\n$/, '')
    // Fenced block (has a language or contains newlines) → highlighted block.
    const isBlock = !!match || text.includes('\n')
    if (isBlock) {
      return <CodeBlock code={text} lang={match ? match[1] : undefined} />
    }
    // Inline code → styled by .prose-lesson code rule.
    return <code className={className}>{children}</code>
  },
}

export function Markdown({ children }: { children: string }) {
  return (
    <div className="prose-lesson max-w-reading">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {children}
      </ReactMarkdown>
    </div>
  )
}
