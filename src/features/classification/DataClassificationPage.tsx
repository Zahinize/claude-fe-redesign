import { useMemo, useState } from 'react'
import {
  ShieldCheck,
  ShieldAlert,
  ShieldHalf,
  Lock,
  Globe,
  Layers,
  LayoutGrid,
  List,
  FolderSearch,
} from 'lucide-react'
import { cn } from '@/lib/cn'
import { Breadcrumb } from '@/components/ui/Breadcrumb'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { SearchInput } from '@/components/ui/SearchInput'
import { Select } from '@/components/ui/Select'
import { EmptyState } from '@/components/ui/EmptyState'
import { LoadingBlock } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { formatNumber } from '@/lib/format'
import { CLASSIFICATION_LEVELS } from '@/data/schemas'
import type { ClassificationScheme } from '@/data/schemas'
import { summarize } from '@/data/generators/classification'
import { useClassificationSchemes } from './useClassification'
import { LEVEL_META, TOP_LEVEL_META } from './classificationMeta'
import { ClassificationStatCard } from './ClassificationStatCard'
import { SchemeCard, SchemeListRow } from './SchemeCard'

type ViewMode = 'grid' | 'list'
const ALL = 'All'

function LabeledFilter<T extends string>({
  label,
  value,
  options,
  onChange,
}: {
  label: string
  value: T
  options: readonly T[]
  onChange: (v: T) => void
}) {
  return (
    <div className="flex flex-col gap-1">
      <span className="px-0.5 text-xs font-medium text-fg-muted">{label}</span>
      <Select value={value} options={options} onChange={onChange} />
    </div>
  )
}

function ViewToggle({ value, onChange }: { value: ViewMode; onChange: (v: ViewMode) => void }) {
  const btn = (mode: ViewMode, Icon: typeof LayoutGrid, label: string) => (
    <button
      type="button"
      aria-label={label}
      aria-pressed={value === mode}
      onClick={() => onChange(mode)}
      className={cn(
        'flex h-8 w-8 items-center justify-center rounded-[0.4rem] transition-colors',
        value === mode ? 'bg-surface text-brand-600 shadow-sm' : 'text-fg-muted hover:text-fg',
      )}
    >
      <Icon size={17} />
    </button>
  )
  return (
    <div className="flex items-center gap-0.5 rounded-control border border-border bg-surface-sunken p-0.5">
      {btn('grid', LayoutGrid, 'Grid view')}
      {btn('list', List, 'List view')}
    </div>
  )
}

export function DataClassificationPage() {
  const { toast } = useToast()
  const { data: schemes, isLoading } = useClassificationSchemes()

  const [view, setView] = useState<ViewMode>('grid')
  const [search, setSearch] = useState('')
  const [domain, setDomain] = useState<string>(ALL)
  const [catalog, setCatalog] = useState<string>(ALL)
  const [level, setLevel] = useState<string>(ALL)

  const all = schemes ?? []
  const summary = useMemo(() => summarize(all), [all])

  const domains = useMemo(() => [ALL, ...new Set(all.map((s) => s.domain))].sort(), [all])
  const catalogs = useMemo(() => [ALL, ...new Set(all.map((s) => s.serviceCatalog))].sort(), [all])
  const levels = [ALL, ...CLASSIFICATION_LEVELS]

  const filtered = useMemo(() => {
    const q = search.trim().toLowerCase()
    return all.filter((s) => {
      if (domain !== ALL && s.domain !== domain) return false
      if (catalog !== ALL && s.serviceCatalog !== catalog) return false
      if (level !== ALL && s.classification !== level) return false
      if (q && !`${s.title} ${s.description} ${s.source} ${s.id}`.toLowerCase().includes(q)) return false
      return true
    })
  }, [all, search, domain, catalog, level])

  const statCards = [
    { title: 'Top level scheme', count: summary.classified, meta: TOP_LEVEL_META, icon: Layers },
    { title: 'Top Secret', count: summary.byLevel['Top Secret'], meta: LEVEL_META['Top Secret'], icon: ShieldAlert },
    { title: 'Secret', count: summary.byLevel.Secret, meta: LEVEL_META.Secret, icon: Lock },
    { title: 'Restricted', count: summary.byLevel.Restricted, meta: LEVEL_META.Restricted, icon: ShieldHalf },
    { title: 'Public', count: summary.byLevel.Public, meta: LEVEL_META.Public, icon: Globe },
  ]

  function openScheme(s: ClassificationScheme) {
    toast({ tone: 'success', title: 'Opening scheme', description: `${s.id} · ${s.title.slice(0, 32)}…` })
  }

  function classifyData() {
    toast({
      tone: 'success',
      title: 'Classification queued',
      description: `${formatNumber(filtered.length)} schemes scheduled`,
    })
  }

  return (
    <div className="mx-auto flex w-full max-w-[1600px] flex-col gap-5 px-5 py-5 sm:px-6">
      <Breadcrumb
        icon={ShieldCheck}
        items={[{ label: 'Governance', to: '/governance/catalog' }, { label: 'Data Classification' }]}
      />

      {/* Summary metrics */}
      <Card className="p-5">
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {statCards.map((c) => (
            <ClassificationStatCard
              key={c.title}
              title={c.title}
              count={c.count}
              total={summary.total}
              meta={c.meta}
              icon={c.icon}
            />
          ))}
        </div>
      </Card>

      {/* Toolbar */}
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-xl font-semibold text-fg-strong">Classification Schemes</h1>
          <p className="mt-1 text-sm text-fg-muted">{formatNumber(filtered.length)} shown</p>
        </div>
        <div className="flex flex-wrap items-end gap-3">
          <div className="self-end">
            <ViewToggle value={view} onChange={setView} />
          </div>
          <div className="self-end">
            <SearchInput value={search} onValueChange={setSearch} placeholder="Search" className="w-48" />
          </div>
          <LabeledFilter label="Domain" value={domain} options={domains} onChange={setDomain} />
          <LabeledFilter label="Service Catalog" value={catalog} options={catalogs} onChange={setCatalog} />
          <LabeledFilter label="Classification" value={level} options={levels} onChange={setLevel} />
          <div className="self-end">
            <Button variant="primary" leftIcon={ShieldCheck} onClick={classifyData}>
              Classify Data
            </Button>
          </div>
        </div>
      </div>

      {/* Results */}
      {isLoading ? (
        <LoadingBlock label="Loading classification schemes…" />
      ) : filtered.length === 0 ? (
        <Card>
          <EmptyState
            icon={FolderSearch}
            title="No matching schemes"
            description="Try adjusting your search or filters."
          />
        </Card>
      ) : view === 'grid' ? (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2 xl:grid-cols-3">
          {filtered.map((s) => (
            <SchemeCard key={s.id} scheme={s} onOpen={openScheme} />
          ))}
        </div>
      ) : (
        <div className="flex flex-col gap-3">
          {filtered.map((s) => (
            <SchemeListRow key={s.id} scheme={s} onOpen={openScheme} />
          ))}
        </div>
      )}
    </div>
  )
}
