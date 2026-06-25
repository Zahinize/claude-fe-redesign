import { useState } from 'react'
import { Database } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Modal } from '@/components/ui/Modal'
import { Badge } from '@/components/ui/Badge'
import { SearchableSelect } from '@/components/ui/SearchableSelect'
import { useToast } from '@/components/ui/Toast'
import type { DataAsset, ServiceCatalog } from '@/data/schemas'
import { useServiceCatalogs } from './useClassification'
import { LEVEL_META } from './classificationMeta'
import { SUB_LEVELS } from './subLevels'
import type { SubLevel } from './subLevels'
import { SubLevelInfoModal } from './SubLevelInfoModal'

interface Props {
  open: boolean
  onClose: () => void
}

/* ---------------- row renderers ---------------- */

function CountBadge({ value }: { value: number }) {
  return (
    <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50 text-sm font-semibold text-brand-600 ring-1 ring-inset ring-brand-100 tnum">
      {value}
    </span>
  )
}

function CatalogRow({ catalog }: { catalog: ServiceCatalog }) {
  return (
    <div className="flex items-center justify-between gap-3">
      <div className="min-w-0">
        <p className="truncate text-base font-semibold text-fg-strong">{catalog.name}</p>
        <p className="text-sm text-fg-muted">
          {catalog.datasetCount} datasets · {catalog.tableCount} tables visible
        </p>
      </div>
      <CountBadge value={catalog.datasetCount} />
    </div>
  )
}

function MonoChip({ label, value }: { label: string; value: string }) {
  return (
    <span className="inline-flex max-w-full items-center truncate rounded-chip border border-border bg-surface-sunken/70 px-2 py-1 font-mono text-2xs text-fg-muted">
      <span className="font-semibold text-fg-strong">{label}</span>:&nbsp;{value}
    </span>
  )
}

function AssetRow({ asset, compact = false }: { asset: DataAsset; compact?: boolean }) {
  return (
    <div className="flex items-start gap-3">
      <span className="mt-0.5 flex h-9 w-9 shrink-0 items-center justify-center rounded-control bg-brand-50 text-brand-600">
        <Database size={18} />
      </span>
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-2">
          <div className="min-w-0">
            <p className="truncate text-base font-semibold text-fg-strong">{asset.name}</p>
            <p className="text-sm text-fg-muted">
              {asset.fields} fields · {asset.linkedColumns} linked columns
            </p>
          </div>
          <Badge tone="neutral" variant="outline" className="shrink-0 uppercase tracking-wide">
            {asset.kind}
          </Badge>
        </div>
        {!compact && (
          <div className="mt-2 flex flex-col gap-1.5">
            <MonoChip label="host" value={asset.host} />
            <MonoChip label="connector" value={asset.connector} />
          </div>
        )}
      </div>
    </div>
  )
}

function SubLevelRow({ sub, compact = false }: { sub: SubLevel; compact?: boolean }) {
  const meta = LEVEL_META[sub.level]
  return (
    <div className="flex items-center gap-3">
      <span className={cn('h-2.5 w-2.5 shrink-0 rounded-full', meta.dot)} />
      <div>
        <p className="text-base font-semibold text-fg-strong">{sub.level}</p>
        {!compact && <p className="text-sm text-fg-muted">{sub.code}</p>}
      </div>
    </div>
  )
}

/* ---------------- modal ---------------- */

export function ClassifyDataModal({ open, onClose }: Props) {
  const { toast } = useToast()
  const { data: catalogs = [] } = useServiceCatalogs()

  const [catalog, setCatalog] = useState<ServiceCatalog | null>(null)
  const [asset, setAsset] = useState<DataAsset | null>(null)
  const [subLevel, setSubLevel] = useState<SubLevel | null>(null)
  const [infoOpen, setInfoOpen] = useState(false)

  function reset() {
    setCatalog(null)
    setAsset(null)
    setSubLevel(null)
    setInfoOpen(false)
  }

  function handleClose() {
    reset()
    onClose()
  }

  function confirmWorkbench() {
    if (!asset || !subLevel) return
    toast({
      tone: 'success',
      title: 'Opening workbench',
      description: `${asset.qualifiedName} · ${subLevel.level}`,
    })
    handleClose()
  }

  return (
    <>
      <Modal
        open={open}
        onClose={handleClose}
        tone="info"
        title="Classify data"
        description="Choose the source, then choose the dataset or table to open the classification workbench."
        overflowVisible
      >
        <div className="flex flex-col gap-4">
          {/* 1 — Service catalog */}
          <SearchableSelect<ServiceCatalog>
            label="Service catalog"
            value={catalog}
            options={catalogs}
            getKey={(c) => c.id}
            getSearchText={(c) => c.name}
            placeholder="Choose service catalog"
            searchPlaceholder="Search service catalogs"
            renderTrigger={(c) => <CatalogRow catalog={c} />}
            renderOption={(c) => <CatalogRow catalog={c} />}
            onChange={(c) => {
              setCatalog(c)
              setAsset(null)
              setSubLevel(null)
            }}
          />

          {/* 2 — Dataset or table */}
          <SearchableSelect<DataAsset>
            label="Dataset or table"
            value={asset}
            options={catalog?.items ?? []}
            getKey={(a) => a.id}
            getSearchText={(a) => `${a.name} ${a.qualifiedName} ${a.kind}`}
            placeholder={catalog ? 'Choose dataset or table' : 'Choose a service catalog first'}
            searchPlaceholder="Search datasets and tables"
            disabled={!catalog}
            renderTrigger={(a) => <AssetRow asset={a} compact />}
            renderOption={(a) => <AssetRow asset={a} />}
            onChange={(a) => {
              setAsset(a)
              setSubLevel(null)
            }}
          />

          {/* 3 — Sub level */}
          <SearchableSelect<SubLevel>
            label="Sub level"
            value={subLevel}
            options={SUB_LEVELS}
            getKey={(s) => s.level}
            getSearchText={(s) => `${s.level} ${s.code}`}
            placeholder={asset ? 'Choose sub level' : 'Choose a dataset or table first'}
            searchPlaceholder="Search sub levels"
            disabled={!asset}
            renderTrigger={(s) => <SubLevelRow sub={s} compact />}
            renderOption={(s) => <SubLevelRow sub={s} />}
            onChange={(s) => {
              setSubLevel(s)
              setInfoOpen(true)
            }}
          />
        </div>
      </Modal>

      {subLevel && asset && (
        <SubLevelInfoModal
          open={infoOpen}
          subLevel={subLevel}
          asset={asset}
          onCancel={() => setInfoOpen(false)}
          onConfirm={confirmWorkbench}
        />
      )}
    </>
  )
}
