import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { useProgress } from '../lib/progress'

let counter = 0

/**
 * Renders a Mermaid diagram, re-rendering when the theme changes so colors
 * track light/dark. Honors prefers-reduced-motion implicitly (mermaid is static).
 */
export function Mermaid({ code }: { code: string }) {
  const { store } = useProgress()
  const ref = useRef<HTMLDivElement>(null)
  const [error, setError] = useState<string | null>(null)
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    let cancelled = false
    const id = `mmd-${counter++}`
    mermaid.initialize({
      startOnLoad: false,
      securityLevel: 'strict',
      theme: store.theme === 'dark' ? 'dark' : 'neutral',
      themeVariables: {
        fontFamily: 'Inter, system-ui, sans-serif',
        primaryColor: store.theme === 'dark' ? '#292524' : '#fdf4ef',
        primaryBorderColor: '#d65d2e',
        lineColor: store.theme === 'dark' ? '#a8a29e' : '#78716c',
        fontSize: '14px',
      },
    })
    mermaid
      .render(id, code)
      .then(({ svg }) => {
        if (!cancelled) {
          setSvg(svg)
          setError(null)
        }
      })
      .catch((e) => {
        if (!cancelled) setError(String(e?.message ?? e))
      })
    return () => {
      cancelled = true
    }
  }, [code, store.theme])

  if (error) {
    return (
      <pre className="card overflow-x-auto p-3 text-xs text-red-600 dark:text-red-400">
        Diagram failed to render: {error}
      </pre>
    )
  }

  return (
    <div
      ref={ref}
      className="mermaid-host flex justify-center overflow-x-auto [&_svg]:h-auto [&_svg]:max-w-full"
      // eslint-disable-next-line react/no-danger
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
