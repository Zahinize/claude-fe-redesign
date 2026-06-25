import { Link2, CornerDownRight, ShieldCheck } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'
import type { BadgeTone } from '@/components/ui/Badge'
import type { ClassificationLevel, ClassificationMethod, SchemeKind } from '@/data/schemas'

/**
 * Maps a classification level to design-system tones + the static Tailwind class
 * strings used by the summary stat cards (solid circles + accent bottom bar).
 * All values are token-based — no raw hex.
 */
export interface LevelMeta {
  tone: BadgeTone
  /** Solid fill (e.g. progress bar). */
  circle: string
  /** Progress / accent fill. */
  bar: string
  /** Card border tint. */
  border: string
  /** Icon / accent text color. */
  text: string
  /** Soft tinted background (icon chip, surfaces). */
  soft: string
  /** Solid dot (sub-level chips/options). */
  dot: string
  /** Level-tinted solid button (e.g. "Open workbench"). */
  solidBtn: string
  /** Level-tinted outline button (e.g. "Cancel"). */
  outlineBtn: string
}

export const LEVEL_META: Record<ClassificationLevel, LevelMeta> = {
  'Top Secret': { tone: 'danger', circle: 'bg-danger-500', bar: 'bg-danger-500', border: 'border-danger-100', text: 'text-danger-600', soft: 'bg-danger-50', dot: 'bg-danger-500', solidBtn: 'bg-danger-600 text-white hover:bg-danger-700', outlineBtn: 'border-danger-200 text-danger-600 hover:bg-danger-50' },
  Secret: { tone: 'warning', circle: 'bg-warning-500', bar: 'bg-warning-500', border: 'border-warning-100', text: 'text-warning-600', soft: 'bg-warning-50', dot: 'bg-warning-500', solidBtn: 'bg-warning-500 text-white hover:bg-warning-600', outlineBtn: 'border-warning-100 text-warning-600 hover:bg-warning-50' },
  Restricted: { tone: 'brand', circle: 'bg-brand-600', bar: 'bg-brand-600', border: 'border-brand-100', text: 'text-brand-600', soft: 'bg-brand-50', dot: 'bg-brand-600', solidBtn: 'bg-brand-600 text-white hover:bg-brand-700', outlineBtn: 'border-brand-200 text-brand-600 hover:bg-brand-50' },
  Public: { tone: 'success', circle: 'bg-success-500', bar: 'bg-success-500', border: 'border-success-100', text: 'text-success-600', soft: 'bg-success-50', dot: 'bg-success-500', solidBtn: 'bg-success-600 text-white hover:bg-success-700', outlineBtn: 'border-success-100 text-success-600 hover:bg-success-50' },
  Unclassified: { tone: 'neutral', circle: 'bg-neutral-400', bar: 'bg-neutral-300', border: 'border-neutral-200', text: 'text-fg-muted', soft: 'bg-neutral-100', dot: 'bg-neutral-400', solidBtn: 'bg-neutral-700 text-white hover:bg-neutral-800', outlineBtn: 'border-neutral-300 text-fg hover:bg-surface-sunken' },
}

/** Brand-blue accent for the "Top level scheme" summary metric. */
export const TOP_LEVEL_META: LevelMeta = {
  tone: 'brand',
  circle: 'bg-brand-600',
  bar: 'bg-brand-600',
  border: 'border-brand-100',
  text: 'text-brand-600',
  soft: 'bg-brand-50',
  dot: 'bg-brand-600',
  solidBtn: 'bg-brand-600 text-white hover:bg-brand-700',
  outlineBtn: 'border-brand-200 text-brand-600 hover:bg-brand-50',
}

/** Type pill tone: Dataset = blue, Table = green. */
export const KIND_TONE: Record<SchemeKind, BadgeTone> = {
  Dataset: 'brand',
  Table: 'success',
}

/** Method tag presentation on the classification chip. */
export interface MethodMeta {
  label: string
  icon?: LucideIcon
  className: string
}

export const METHOD_META: Record<ClassificationMethod, MethodMeta> = {
  direct: { label: 'direct', className: 'text-success-600' },
  linked: { label: 'linked', icon: Link2, className: 'text-fg-muted' },
  inherited: { label: 'inherited', icon: CornerDownRight, className: 'text-fg-muted' },
}

export const LevelShieldIcon: LucideIcon = ShieldCheck
