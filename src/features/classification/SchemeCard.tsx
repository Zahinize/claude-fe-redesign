import { ExternalLink, Database } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { IconButton } from '@/components/ui/IconButton'
import { formatDateTime } from '@/lib/format'
import type { ClassificationScheme } from '@/data/schemas'
import { KIND_TONE, LEVEL_META, METHOD_META, LevelShieldIcon } from './classificationMeta'

/** Classification chip: shield (level-colored) + level + method tag. */
export function ClassificationChip({ scheme }: { scheme: ClassificationScheme }) {
  const level = LEVEL_META[scheme.classification]
  const method = METHOD_META[scheme.method]
  const MethodIcon = method.icon
  return (
    <div className="inline-flex items-center gap-2 self-start rounded-control border border-border bg-surface px-3 py-1.5">
      <LevelShieldIcon size={16} className={level.text} />
      <span className="text-sm font-semibold text-fg-strong">{scheme.classification}</span>
      <span className={cn('inline-flex items-center gap-1 text-xs font-medium', method.className)}>
        {MethodIcon && <MethodIcon size={13} />}
        {method.label}
      </span>
    </div>
  )
}

/** Small bordered metadata pill. */
function MetaPill({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-control border border-border px-2.5 py-1 text-xs font-medium text-fg-muted">
      {children}
    </span>
  )
}

export function SchemeMeta({ scheme }: { scheme: ClassificationScheme }) {
  return (
    <div className="flex flex-wrap gap-2">
      {scheme.kind === 'Dataset' ? (
        <>
          <MetaPill>{scheme.fields} fields</MetaPill>
          <MetaPill>{scheme.mappedColumns} mapped columns</MetaPill>
        </>
      ) : (
        <>
          <MetaPill>{scheme.columns} columns</MetaPill>
          <MetaPill>table</MetaPill>
        </>
      )}
    </div>
  )
}

interface SchemeCardProps {
  scheme: ClassificationScheme
  onOpen?: (scheme: ClassificationScheme) => void
}

export function SchemeCard({ scheme, onOpen }: SchemeCardProps) {
  return (
    <Card
      className={cn(
        'group flex flex-col gap-3 p-5 transition-shadow hover:shadow-dropdown',
        onOpen && 'cursor-pointer',
      )}
    >
      <div className="flex items-start justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone={KIND_TONE[scheme.kind]}>{scheme.kind}</Badge>
          <span className="text-sm font-medium text-fg-subtle tnum">#{scheme.index}</span>
        </div>
        <IconButton
          icon={ExternalLink}
          label="Open scheme"
          size="sm"
          onClick={() => onOpen?.(scheme)}
        />
      </div>

      <div>
        <h3 className="line-clamp-2 text-base font-semibold text-fg-strong">{scheme.title}</h3>
        <p className="mt-1 line-clamp-1 text-sm text-fg-muted">{scheme.description}</p>
      </div>

      <ClassificationChip scheme={scheme} />
      <SchemeMeta scheme={scheme} />

      <div className="mt-auto flex items-center justify-between border-t border-border pt-3 text-xs text-fg-muted">
        <span className="flex items-center gap-1.5">
          <Database size={13} className="text-fg-subtle" />
          {scheme.source}
        </span>
        <span className="tnum">{formatDateTime(scheme.updatedAt)}</span>
      </div>
    </Card>
  )
}

/** Compact horizontal row for the list view. */
export function SchemeListRow({ scheme, onOpen }: SchemeCardProps) {
  return (
    <Card
      className={cn(
        'flex items-center gap-4 px-4 py-3 transition-shadow hover:shadow-dropdown',
        onOpen && 'cursor-pointer',
      )}
    >
      <div className="flex w-28 shrink-0 items-center gap-2">
        <Badge tone={KIND_TONE[scheme.kind]}>{scheme.kind}</Badge>
        <span className="text-sm font-medium text-fg-subtle tnum">#{scheme.index}</span>
      </div>
      <div className="min-w-0 flex-1">
        <h3 className="truncate text-base font-semibold text-fg-strong">{scheme.title}</h3>
        <p className="flex items-center gap-1.5 truncate text-xs text-fg-muted">
          <Database size={12} className="text-fg-subtle" />
          {scheme.source} · {scheme.domain}
        </p>
      </div>
      <div className="hidden shrink-0 lg:block">
        <ClassificationChip scheme={scheme} />
      </div>
      <div className="hidden w-44 shrink-0 xl:block">
        <SchemeMeta scheme={scheme} />
      </div>
      <span className="hidden w-40 shrink-0 text-right text-xs text-fg-muted tnum sm:block">
        {formatDateTime(scheme.updatedAt)}
      </span>
      <IconButton icon={ExternalLink} label="Open scheme" size="sm" onClick={() => onOpen?.(scheme)} />
    </Card>
  )
}
