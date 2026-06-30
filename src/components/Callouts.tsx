import { Lightbulb, AlertTriangle } from 'lucide-react'

export function KeyTakeaways({ items }: { items: string[] }) {
  return (
    <section className="my-6 rounded-lg border border-stone-200 bg-stone-100/60 p-4 dark:border-stone-800 dark:bg-stone-900/60">
      <h3 className="mb-2 flex items-center gap-2 text-sm font-semibold text-ink dark:text-stone-200">
        <Lightbulb size={16} className="text-accent-600 dark:text-accent-400" />
        Key takeaways
      </h3>
      <ul className="space-y-1.5">
        {items.map((t, i) => (
          <li key={i} className="flex gap-2 text-sm text-ink-soft dark:text-stone-300">
            <span className="mt-2 h-1 w-1 shrink-0 rounded-full bg-accent-500" aria-hidden />
            <span>{t}</span>
          </li>
        ))}
      </ul>
    </section>
  )
}

export function OutOfScopeBadge({ note }: { note?: string }) {
  return (
    <aside className="my-4 rounded-lg border border-amber-300 bg-amber-50 p-3 text-sm dark:border-amber-800 dark:bg-amber-950/40">
      <div className="flex items-center gap-2 font-semibold text-amber-800 dark:text-amber-300">
        <AlertTriangle size={15} />
        Out of scope for the Architect exam
      </div>
      {note && <p className="mt-1 text-amber-800/90 dark:text-amber-200/90">{note}</p>}
    </aside>
  )
}
