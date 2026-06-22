/** Intl-based formatting helpers so no date/number formatting is hand-rolled. */

const dateTimeFmt = new Intl.DateTimeFormat('en-GB', {
  day: '2-digit',
  month: 'short',
  year: 'numeric',
  hour: 'numeric',
  minute: '2-digit',
  hour12: true,
})

const dateFmt = new Intl.DateTimeFormat('en-US', {
  day: 'numeric',
  month: 'short',
  year: 'numeric',
})

const numberFmt = new Intl.NumberFormat('en-US')

/** "11 Jul, 2026, 4:00 PM" — matches the Figma timestamp style. */
export function formatDateTime(iso: string | number | Date): string {
  const d = new Date(iso)
  // en-GB gives "11 Jul 2026, 16:00"; massage to the Figma "11 Jul, 2026, 4:00 PM"
  const parts = dateTimeFmt.formatToParts(d)
  const get = (t: Intl.DateTimeFormatPartTypes) => parts.find((p) => p.type === t)?.value ?? ''
  const dayPeriod = get('dayPeriod').toUpperCase()
  return `${get('day')} ${get('month')}, ${get('year')}, ${get('hour')}:${get('minute')} ${dayPeriod}`
}

/** "Jan 10, 2024" */
export function formatDate(iso: string | number | Date): string {
  return dateFmt.format(new Date(iso))
}

export function formatNumber(n: number): string {
  return numberFmt.format(n)
}

/** "2 hours ago" style relative time. */
export function formatRelative(iso: string | number | Date): string {
  const then = new Date(iso).getTime()
  const now = Date.now()
  const diff = Math.max(0, now - then)
  const mins = Math.floor(diff / 60000)
  if (mins < 1) return 'just now'
  if (mins < 60) return `${mins} min${mins === 1 ? '' : 's'} ago`
  const hours = Math.floor(mins / 60)
  if (hours < 24) return `${hours} hour${hours === 1 ? '' : 's'} ago`
  const days = Math.floor(hours / 24)
  if (days < 30) return `${days} day${days === 1 ? '' : 's'} ago`
  return formatDate(iso)
}
