import type { Flashcard } from '../content/types'

/** Trigger a client-side download of text content as a file. No network. */
export function downloadFile(filename: string, text: string, mime = 'text/plain') {
  const blob = new Blob([text], { type: `${mime};charset=utf-8` })
  const url = URL.createObjectURL(blob)
  const a = document.createElement('a')
  a.href = url
  a.download = filename
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  // Release the object URL on the next tick.
  setTimeout(() => URL.revokeObjectURL(url), 0)
}

/** Flashcards as tab-separated `term<TAB>definition`, one per line — ready for Quizlet import. */
export function toTSV(cards: Flashcard[]): string {
  return cards
    .map((c) => `${c.term.replace(/\t/g, ' ')}\t${c.def.replace(/\t/g, ' ').replace(/\n/g, ' ')}`)
    .join('\n')
}

/** Read a File (from an <input type="file">) as text. */
export function readFileAsText(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => resolve(String(reader.result ?? ''))
    reader.onerror = () => reject(new Error('Could not read the file.'))
    reader.readAsText(file)
  })
}
