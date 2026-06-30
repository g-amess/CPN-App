// Bespoke SVG: a 2-D sketch of embedding/vector space, showing that
// semantically related terms cluster together.

interface Point {
  label: string
  x: number
  y: number
  cluster: number
}

const POINTS: Point[] = [
  { label: 'cat', x: 90, y: 70, cluster: 0 },
  { label: 'dog', x: 130, y: 95, cluster: 0 },
  { label: 'kitten', x: 70, y: 110, cluster: 0 },
  { label: 'Python', x: 330, y: 60, cluster: 1 },
  { label: 'function', x: 370, y: 95, cluster: 1 },
  { label: 'variable', x: 320, y: 120, cluster: 1 },
  { label: 'invoice', x: 200, y: 195, cluster: 2 },
  { label: 'payment', x: 240, y: 215, cluster: 2 },
]

const CLUSTER_FILL = ['fill-accent-500', 'fill-emerald-500', 'fill-sky-500']
const CLUSTER_DARK = ['dark:fill-accent-400', 'dark:fill-emerald-400', 'dark:fill-sky-400']

export function EmbeddingSpace() {
  const W = 460
  const H = 260
  return (
    <figure className="my-2">
      <svg viewBox={`0 0 ${W} ${H}`} className="w-full max-w-xl" role="img" aria-label="Embedding space: related terms cluster together">
        <line x1={20} y1={H - 20} x2={W - 10} y2={H - 20} className="stroke-stone-300 dark:stroke-stone-700" />
        <line x1={20} y1={20} x2={20} y2={H - 20} className="stroke-stone-300 dark:stroke-stone-700" />
        <text x={W - 10} y={H - 6} textAnchor="end" className="fill-ink-faint text-[9px]">dimension 1</text>
        <text x={14} y={26} className="fill-ink-faint text-[9px]" transform={`rotate(-90 14 26)`}>dimension 2</text>
        {[0, 1, 2].map((c) => {
          const pts = POINTS.filter((p) => p.cluster === c)
          const cx = pts.reduce((a, p) => a + p.x, 0) / pts.length
          const cy = pts.reduce((a, p) => a + p.y, 0) / pts.length
          return <circle key={c} cx={cx} cy={cy} r={52} className="fill-stone-200/40 dark:fill-stone-800/40" />
        })}
        {POINTS.map((p) => (
          <g key={p.label}>
            <circle cx={p.x} cy={p.y} r={5} className={`${CLUSTER_FILL[p.cluster]} ${CLUSTER_DARK[p.cluster]}`} />
            <text x={p.x + 9} y={p.y + 4} className="fill-ink-soft text-[10px] dark:fill-stone-300">
              {p.label}
            </text>
          </g>
        ))}
      </svg>
      <figcaption className="mt-1 text-xs text-ink-faint">
        Each term becomes a vector; semantically related terms (animals, code, finance) sit closer together.
        Similarity search finds the nearest vectors to a query.
      </figcaption>
    </figure>
  )
}
