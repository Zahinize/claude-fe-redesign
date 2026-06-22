import { useState } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { ChevronDown, ChevronsLeft, ChevronsRight } from 'lucide-react'
import { cn } from '@/lib/cn'
import { Logo } from './Logo'
import { Tooltip } from '@/components/ui/Tooltip'
import { Badge } from '@/components/ui/Badge'
import { NAV } from '@/data/navConfig'
import type { NavEntry, NavGroup } from '@/data/navConfig'

interface SidebarProps {
  collapsed: boolean
  onToggle: () => void
}

function groupHasActive(group: NavGroup, pathname: string): boolean {
  return group.children.some((c) => pathname === c.to || pathname.startsWith(c.to + '/'))
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const { pathname } = useLocation()

  return (
    <aside
      className={cn(
        'flex h-full shrink-0 flex-col border-r border-border bg-surface transition-[width] duration-200',
        collapsed ? 'w-sidebar-collapsed' : 'w-sidebar',
      )}
    >
      {/* Brand + collapse toggle */}
      <div className={cn('flex h-topbar items-center', collapsed ? 'justify-center' : 'justify-between px-4')}>
        <Logo withWordmark={!collapsed} />
        {!collapsed && (
          <button
            onClick={onToggle}
            aria-label="Collapse sidebar"
            className="rounded-control p-1 text-fg-subtle hover:bg-surface-sunken hover:text-fg"
          >
            <ChevronsLeft size={18} />
          </button>
        )}
      </div>

      <nav className="flex-1 overflow-y-auto px-3 pb-4">
        {collapsed ? (
          <CollapsedNav pathname={pathname} />
        ) : (
          <ExpandedNav entries={NAV} pathname={pathname} />
        )}
      </nav>

      {collapsed && (
        <div className="flex justify-center border-t border-border py-3">
          <button
            onClick={onToggle}
            aria-label="Expand sidebar"
            className="rounded-control p-1.5 text-fg-subtle hover:bg-surface-sunken hover:text-fg"
          >
            <ChevronsRight size={18} />
          </button>
        </div>
      )}
    </aside>
  )
}

/* ---------------- Expanded ---------------- */

function ExpandedNav({ entries, pathname }: { entries: NavEntry[]; pathname: string }) {
  return (
    <div className="flex flex-col gap-0.5 pt-1">
      {entries.map((entry, i) => {
        if (entry.kind === 'divider') return <hr key={`d${i}`} className="my-2 border-border" />
        if (entry.kind === 'leaf') return <LeafLink key={entry.to} entry={entry} />
        return <GroupItem key={entry.label} group={entry} pathname={pathname} />
      })}
    </div>
  )
}

function LeafLink({ entry }: { entry: Extract<NavEntry, { kind: 'leaf' }> }) {
  const Icon = entry.icon
  return (
    <NavLink
      to={entry.to}
      className={({ isActive }) =>
        cn(
          'flex items-center gap-3 rounded-control px-3 py-2 text-base font-medium transition-colors',
          isActive ? 'bg-brand-50 text-brand-600' : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
        )
      }
    >
      {Icon && <Icon size={18} className="shrink-0" />}
      <span className="flex-1 truncate">{entry.label}</span>
      {entry.badge && (
        <Badge tone={entry.badge.tone} size="sm">
          {entry.badge.text}
        </Badge>
      )}
    </NavLink>
  )
}

function GroupItem({ group, pathname }: { group: NavGroup; pathname: string }) {
  const Icon = group.icon
  const [open, setOpen] = useState(() => groupHasActive(group, pathname))

  return (
    <div>
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center gap-3 rounded-control px-3 py-2 text-base font-medium text-fg-muted transition-colors hover:bg-surface-sunken hover:text-fg"
      >
        <Icon size={18} className="shrink-0" />
        <span className="flex-1 truncate text-left">{group.label}</span>
        <ChevronDown size={16} className={cn('shrink-0 transition-transform', open && 'rotate-180')} />
      </button>
      {open && (
        <div className="mb-1 mt-0.5 flex flex-col gap-0.5 pl-3">
          {group.children.map((child) => (
            <NavLink
              key={child.to}
              to={child.to}
              className={({ isActive }) =>
                cn(
                  'flex items-center gap-3 rounded-control py-1.5 pl-3 pr-3 text-base transition-colors',
                  isActive ? 'font-medium text-brand-600' : 'text-fg-muted hover:text-fg',
                )
              }
            >
              {({ isActive }) => (
                <>
                  <span
                    className={cn(
                      'h-[0.6rem] w-[0.6rem] shrink-0 rounded-full border-2 transition-colors',
                      isActive ? 'border-brand-600 bg-brand-600' : 'border-neutral-300',
                    )}
                  />
                  <span className="truncate">{child.label}</span>
                </>
              )}
            </NavLink>
          ))}
        </div>
      )}
    </div>
  )
}

/* ---------------- Collapsed rail ---------------- */

function CollapsedNav({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-col items-center gap-1 pt-1">
      {NAV.map((entry, i) => {
        if (entry.kind === 'divider') return <hr key={`d${i}`} className="my-2 w-7 border-border" />
        if (entry.kind === 'leaf') {
          const Icon = entry.icon!
          const active = pathname === entry.to
          return (
            <Tooltip key={entry.to} content={entry.label}>
              <NavLink
                to={entry.to}
                className={cn(
                  'relative flex h-10 w-10 items-center justify-center rounded-control transition-colors',
                  active ? 'bg-brand-50 text-brand-600' : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
                )}
              >
                <Icon size={20} />
                {entry.badge && (
                  <span className="absolute -right-0.5 -top-0.5 h-2 w-2 rounded-full bg-danger-500 ring-2 ring-surface" />
                )}
              </NavLink>
            </Tooltip>
          )
        }
        // group → show group icon, navigates to first child
        const Icon = entry.icon
        const active = groupHasActive(entry, pathname)
        return (
          <Tooltip key={entry.label} content={entry.label}>
            <NavLink
              to={entry.children[0].to}
              className={cn(
                'flex h-10 w-10 items-center justify-center rounded-control transition-colors',
                active ? 'bg-brand-50 text-brand-600' : 'text-fg-muted hover:bg-surface-sunken hover:text-fg',
              )}
            >
              <Icon size={20} />
            </NavLink>
          </Tooltip>
        )
      })}
    </div>
  )
}
