import {
  LayoutGrid,
  Search,
  Plug,
  Boxes,
  BookText,
  Workflow,
  ScrollText,
  Tags,
  Languages,
  Network,
  ShieldCheck,
  Database,
  Gauge,
  BadgeCheck,
  FileCheck2,
  ListChecks,
  Settings,
  Puzzle,
  Monitor,
  LogOut,
  ShieldAlert,
  Cookie,
  UserCheck,
  type LucideIcon,
} from 'lucide-react'

export interface NavLeaf {
  label: string
  to: string
  icon?: LucideIcon
  badge?: { text: string; tone: 'brand' | 'warning' | 'danger' }
}

export interface NavGroup {
  label: string
  icon: LucideIcon
  children: NavLeaf[]
}

export type NavEntry =
  | ({ kind: 'leaf' } & NavLeaf)
  | ({ kind: 'group' } & NavGroup)
  | { kind: 'divider' }

/**
 * Full governance nav from assets/components/component-side-navbar.png.
 * Consent Management (the built feature) lives under Data Privacy.
 */
export const NAV: NavEntry[] = [
  { kind: 'leaf', label: 'Dashboard', to: '/dashboard', icon: LayoutGrid, badge: { text: '2 Pending', tone: 'warning' } },
  { kind: 'leaf', label: 'Search', to: '/search', icon: Search },
  { kind: 'leaf', label: 'Connectors', to: '/connectors', icon: Plug, badge: { text: '3', tone: 'danger' } },
  { kind: 'divider' },
  {
    kind: 'group',
    label: 'Governance',
    icon: Boxes,
    children: [
      { label: 'Data Catalog', to: '/governance/catalog' },
      { label: 'Data Classification', to: '/governance/data-classification' },
      { label: 'Business Glossary', to: '/governance/glossary' },
      { label: 'Workflow Management', to: '/governance/workflows' },
      { label: 'Policy Engine', to: '/governance/policy' },
      { label: 'Classification Scheme', to: '/governance/classification' },
      { label: 'Taxonomy', to: '/governance/taxonomy' },
      { label: 'Translation', to: '/governance/translation' },
      { label: 'Synonym Groups', to: '/governance/synonyms' },
    ],
  },
  {
    kind: 'group',
    label: 'Data Quality',
    icon: BadgeCheck,
    children: [
      { label: 'Quality Rules', to: '/quality/rules' },
      { label: 'Scorecards', to: '/quality/scorecards' },
    ],
  },
  {
    kind: 'group',
    label: 'Data Privacy',
    icon: ShieldCheck,
    children: [
      { label: 'Consent Management', to: '/consent' },
      { label: 'RoPA', to: '/privacy/ropa' },
      { label: 'Subject Requests', to: '/privacy/requests' },
      { label: 'Data Mapping', to: '/privacy/mapping' },
    ],
  },
  { kind: 'divider' },
  {
    kind: 'group',
    label: 'Administration',
    icon: ShieldAlert,
    children: [
      { label: 'Users & Roles', to: '/admin/users' },
      { label: 'Audit Log', to: '/admin/audit' },
    ],
  },
  { kind: 'leaf', label: 'Modules', to: '/modules', icon: Puzzle },
  { kind: 'leaf', label: 'Settings', to: '/settings', icon: Settings },
]

/** Bottom-pinned utility items shown in the collapsed rail. */
export const NAV_FOOTER: NavLeaf[] = [
  { label: 'Modules', to: '/modules', icon: Puzzle },
  { label: 'Display', to: '/display', icon: Monitor },
  { label: 'Settings', to: '/settings', icon: Settings },
  { label: 'Logout', to: '/logout', icon: LogOut },
]

// Re-export icons used by the collapsed rail mapping / placeholders.
export const navIcons = {
  LayoutGrid,
  Search,
  Plug,
  Boxes,
  BookText,
  Workflow,
  ScrollText,
  Tags,
  Languages,
  Network,
  ShieldCheck,
  Database,
  Gauge,
  BadgeCheck,
  FileCheck2,
  ListChecks,
  Settings,
  Puzzle,
  Monitor,
  LogOut,
  ShieldAlert,
  Cookie,
  UserCheck,
}
