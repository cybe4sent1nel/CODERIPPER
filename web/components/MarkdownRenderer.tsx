import ReactMarkdown from 'react-markdown'
import remarkGfm from 'remark-gfm'
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter'
import { oneDark } from 'react-syntax-highlighter/dist/cjs/styles/prism'
import { ClipboardDocumentIcon, CheckIcon } from '@heroicons/react/24/outline'
import { useState } from 'react'

interface MarkdownRendererProps {
  content: string
  className?: string
}

export default function MarkdownRenderer({ content, className = '' }: MarkdownRendererProps) {
  const [copiedCode, setCopiedCode] = useState<string | null>(null)

  const copyCode = async (code: string) => {
    try {
      await navigator.clipboard.writeText(code)
      setCopiedCode(code)
      setTimeout(() => setCopiedCode(null), 2000)
    } catch (err) {
      console.error('Failed to copy:', err)
    }
  }

  return (
    <div className={`markdown-content ${className}`}>
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        components={{
          // Headings
          h1: ({ children }) => (
            <h1 className="text-xl font-bold mb-4 mt-6 first:mt-0 text-foreground border-b border-border pb-2">
              {children}
            </h1>
          ),
          h2: ({ children }) => (
            <h2 className="text-lg font-semibold mb-3 mt-5 first:mt-0 text-foreground flex items-center gap-2">
              <span className="text-primary">##</span> {children}
            </h2>
          ),
          h3: ({ children }) => (
            <h3 className="text-base font-semibold mb-2 mt-4 first:mt-0 text-foreground">
              {children}
            </h3>
          ),
          
          // Paragraphs
          p: ({ children }) => (
            <p className="mb-3 text-sm leading-relaxed text-foreground/90">
              {children}
            </p>
          ),
          
          // Lists
          ul: ({ children }) => (
            <ul className="mb-4 ml-1 space-y-1.5">
              {children}
            </ul>
          ),
          ol: ({ children }) => (
            <ol className="mb-4 ml-1 space-y-1.5 list-decimal list-inside">
              {children}
            </ol>
          ),
          li: ({ children }) => (
            <li className="text-sm text-foreground/90 flex items-start gap-2">
              <span className="text-primary mt-1.5 text-xs">•</span>
              <span className="flex-1">{children}</span>
            </li>
          ),
          
          // Code blocks
          code: ({ node, inline, className, children, ...props }: any) => {
            const match = /language-(\w+)/.exec(className || '')
            const codeString = String(children).replace(/\n$/, '')
            
            if (!inline && match) {
              return (
                <div className="relative group my-4 rounded-lg overflow-hidden border border-border">
                  {/* Code header */}
                  <div className="flex items-center justify-between px-4 py-2 bg-gray-800 border-b border-gray-700">
                    <span className="text-xs text-gray-400 font-mono">{match[1]}</span>
                    <button
                      onClick={() => copyCode(codeString)}
                      className="flex items-center gap-1 text-xs text-gray-400 hover:text-white transition-colors"
                    >
                      {copiedCode === codeString ? (
                        <>
                          <CheckIcon className="w-3.5 h-3.5 text-green-400" />
                          <span className="text-green-400">Copied!</span>
                        </>
                      ) : (
                        <>
                          <ClipboardDocumentIcon className="w-3.5 h-3.5" />
                          <span>Copy</span>
                        </>
                      )}
                    </button>
                  </div>
                  <SyntaxHighlighter
                    style={oneDark}
                    language={match[1]}
                    PreTag="div"
                    customStyle={{
                      margin: 0,
                      borderRadius: 0,
                      fontSize: '13px',
                      padding: '16px',
                    }}
                    {...props}
                  >
                    {codeString}
                  </SyntaxHighlighter>
                </div>
              )
            }
            
            // Inline code
            return (
              <code className="px-1.5 py-0.5 rounded bg-primary/10 text-primary text-sm font-mono" {...props}>
                {children}
              </code>
            )
          },
          
          // Blockquotes
          blockquote: ({ children }) => (
            <blockquote className="border-l-4 border-primary/50 pl-4 py-1 my-4 bg-primary/5 rounded-r-lg">
              <div className="text-sm italic text-foreground/80">{children}</div>
            </blockquote>
          ),
          
          // Strong/Bold
          strong: ({ children }) => (
            <strong className="font-semibold text-foreground">{children}</strong>
          ),
          
          // Emphasis/Italic
          em: ({ children }) => (
            <em className="italic text-foreground/90">{children}</em>
          ),
          
          // Links
          a: ({ href, children }) => (
            <a
              href={href}
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:text-primary/80 underline underline-offset-2 transition-colors"
            >
              {children}
            </a>
          ),
          
          // Horizontal rule
          hr: () => <hr className="my-6 border-border" />,
          
          // Tables
          table: ({ children }) => (
            <div className="my-4 overflow-x-auto rounded-lg border border-border">
              <table className="w-full text-sm">{children}</table>
            </div>
          ),
          thead: ({ children }) => (
            <thead className="bg-muted/50">{children}</thead>
          ),
          th: ({ children }) => (
            <th className="px-4 py-2 text-left font-semibold text-foreground border-b border-border">
              {children}
            </th>
          ),
          td: ({ children }) => (
            <td className="px-4 py-2 text-foreground/90 border-b border-border/50">
              {children}
            </td>
          ),
        }}
      >
        {content}
      </ReactMarkdown>
    </div>
  )
}
