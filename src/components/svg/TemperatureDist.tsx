import { useState, useId } from 'react'

// Bespoke, hand-authored SVG: how temperature reshapes the next-token
// probability distribution. Interactive slider, no external library.

const TOKENS = ['the', 'a', 'cat', 'dog', 'quantum', 'banana', 'xyzzy']
const BASE = [0.34, 0.24, 0.16, 0.11, 0.08, 0.045, 0.025]

function applyTemp(probs: number[], temp: number): number[] {
  // temp→0 sharpens toward the argmax; temp→1 flattens toward uniform.
  const t = Math.max(0.01, temp)
  const logits = probs.map((p) => Math.log(p))
  const scaled = logits.map((l) => l / t)
  const max = Math.max(...scaled)
  const exps = scaled.map((s) => Math.exp(s - max))
  const sum = exps.reduce((a, b) => a + b, 0)
  return exps.map((e) => e / sum)
}

export function TemperatureDist() {
  const [temp, setTemp] = useState(0.7)
  const sliderId = useId()
  const dist = applyTemp(BASE, temp)
  const max = Math.max(...dist)

  const W = 460
  const H = 220
  const padL = 30
  const padB = 44
  const barW = (W - padL - 20) / TOKENS.length

  return (
    <figure className="my-2">
      <svg
        viewBox={`0 0 ${W} ${H}`}
        className="w-full max-w-xl"
        role="img"
        aria-label={`Next-token probability distribution at temperature ${temp.toFixed(2)}`}
      >
        <line x1={padL} y1={H - padB} x2={W - 10} y2={H - padB} className="stroke-stone-300 dark:stroke-stone-700" strokeWidth={1} />
        {dist.map((p, i) => {
          const h = (p / max) * (H - padB - 16)
          const x = padL + i * barW + 6
          const y = H - padB - h
          return (
            <g key={TOKENS[i]}>
              <rect
                x={x}
                y={y}
                width={barW - 12}
                height={h}
                rx={3}
                className="fill-accent-500 transition-all dark:fill-accent-400"
              />
              <text x={x + (barW - 12) / 2} y={H - padB + 14} textAnchor="middle" className="fill-ink-faint text-[9px]">
                {TOKENS[i]}
              </text>
              <text x={x + (barW - 12) / 2} y={y - 4} textAnchor="middle" className="fill-ink-faint text-[8px]">
                {(p * 100).toFixed(0)}%
              </text>
            </g>
          )
        })}
      </svg>
      <div className="mt-2 flex items-center gap-3">
        <label htmlFor={sliderId} className="text-sm font-medium text-ink-soft dark:text-stone-300">
          Temperature: <span className="font-mono text-accent-700 dark:text-accent-300">{temp.toFixed(2)}</span>
        </label>
        <input
          id={sliderId}
          type="range"
          min={0}
          max={1}
          step={0.01}
          value={temp}
          onChange={(e) => setTemp(parseFloat(e.target.value))}
          className="h-2 flex-1 cursor-pointer accent-accent-600"
        />
      </div>
      <figcaption className="mt-1 text-xs text-ink-faint">
        At <strong>0</strong> the top token dominates (deterministic). Near <strong>1</strong> the distribution
        flattens, raising the chance of lower-probability tokens.
      </figcaption>
    </figure>
  )
}
