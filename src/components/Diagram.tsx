import type { DiagramRef } from '../content/types'
import { Mermaid } from './Mermaid'
import { TemperatureDist } from './svg/TemperatureDist'
import { EmbeddingSpace } from './svg/EmbeddingSpace'
import { TokenStream } from './svg/TokenStream'

export function Diagram({ diagram }: { diagram: DiagramRef }) {
  return (
    <figure className="card my-5 p-4">
      {diagram.title && (
        <figcaption className="mb-3 text-sm font-semibold text-ink dark:text-stone-200">{diagram.title}</figcaption>
      )}
      {diagram.kind === 'mermaid' && diagram.code && <Mermaid code={diagram.code} />}
      {diagram.kind === 'temperature' && <TemperatureDist />}
      {diagram.kind === 'embedding' && <EmbeddingSpace />}
      {diagram.kind === 'tokenstream' && <TokenStream />}
      {diagram.caption && diagram.kind === 'mermaid' && (
        <p className="mt-2 text-xs text-ink-faint">{diagram.caption}</p>
      )}
    </figure>
  )
}
