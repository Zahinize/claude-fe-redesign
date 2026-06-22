import { useState } from 'react'
import { Copy, Check } from 'lucide-react'
import { cn } from '@/lib/cn'
import { SeverityBadge, severityTone } from '@/components/ui/StatusChip'
import type { Severity } from '@/components/ui/StatusChip'
import { formatRelative } from '@/lib/format'

export interface LogEntry {
  id: string
  severity: Severity
  title: string
  description: string
  timestamp: string
}

const dotColor: Record<Severity, string> = {
  Critical: 'bg-danger-700',
  High: 'bg-danger-500',
  Medium: 'bg-warning-500',
  Normal: 'bg-brand-500',
  Info: 'bg-brand-500',
  Low: 'bg-neutral-400',
  Debug: 'bg-neutral-400',
}

const CLAMP = 120

function LogRow({ entry, last }: { entry: LogEntry; last: boolean }) {
  const [expanded, setExpanded] = useState(false)
  const [copied, setCopied] = useState(false)
  const long = entry.description.length > CLAMP
  const text = expanded || !long ? entry.description : `${entry.description.slice(0, CLAMP)}…`

  // severityTone referenced to keep parity with badge mapping
  void severityTone

  async function copy() {
    await navigator.clipboard?.writeText(entry.description)
    setCopied(true)
    setTimeout(() => setCopied(false), 1500)
  }

  return (
    <li className="relative flex gap-4 pb-6 last:pb-0">
      <div className="relative flex flex-col items-center pt-1.5">
        <span className={cn('z-10 h-2.5 w-2.5 rounded-full ring-4 ring-surface', dotColor[entry.severity])} />
        {!last && <span className="absolute top-2 h-full w-px bg-border" />}
      </div>
      <div className="flex-1 pb-1">
        <div className="flex items-start justify-between gap-3">
          <div className="flex flex-wrap items-center gap-2">
            <SeverityBadge severity={entry.severity} />
            <span className="text-base font-semibold text-fg-strong">{entry.title}</span>
          </div>
          <span className="shrink-0 whitespace-nowrap text-xs text-fg-subtle">
            {formatRelative(entry.timestamp)}
          </span>
        </div>
        <p className="mt-1 text-base text-fg-muted">
          {text}{' '}
          {long && (
            <button
              onClick={() => setExpanded((e) => !e)}
              className="font-medium text-fg-strong hover:underline"
            >
              {expanded ? 'Read Less' : 'Read More'}
            </button>
          )}
          <button
            onClick={copy}
            aria-label="Copy"
            className="ml-1 inline-flex translate-y-0.5 text-fg-subtle hover:text-fg"
          >
            {copied ? <Check size={13} className="text-success-600" /> : <Copy size={13} />}
          </button>
        </p>
      </div>
    </li>
  )
}

/**
 * Logs timeline (assets/components/component-timeline.png) — used by Audit Trails.
 */
export function LogTimeline({ entries }: { entries: LogEntry[] }) {
  return (
    <ol className="relative">
      {entries.map((entry, i) => (
        <LogRow key={entry.id} entry={entry} last={i === entries.length - 1} />
      ))}
    </ol>
  )
}
