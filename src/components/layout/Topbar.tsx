import { useEffect, useRef, useState } from 'react'
import { Bell, ChevronDown, Menu } from 'lucide-react'
import { SearchInput } from '@/components/ui/SearchInput'
import { Avatar } from '@/components/ui/Avatar'
import { IconButton } from '@/components/ui/IconButton'
import { Popover, MenuItem } from '@/components/ui/Popover'
import { LogOut, Settings, UserCircle } from 'lucide-react'

interface TopbarProps {
  onMobileMenu?: () => void
}

const USER = { name: 'Lisa Hayden', email: 'Lisa@untitled.com' }

export function Topbar({ onMobileMenu }: TopbarProps) {
  const [query, setQuery] = useState('')
  const searchRef = useRef<HTMLInputElement | null>(null)

  // Alt+K focuses the global search (matches the shortcut hint).
  useEffect(() => {
    function onKey(e: KeyboardEvent) {
      if (e.altKey && (e.key === 'k' || e.key === 'K')) {
        e.preventDefault()
        const input = document.querySelector<HTMLInputElement>('[data-global-search] input')
        input?.focus()
      }
    }
    window.addEventListener('keydown', onKey)
    return () => window.removeEventListener('keydown', onKey)
  }, [])

  void query
  void searchRef

  return (
    <header className="flex h-topbar shrink-0 items-center justify-between gap-4 border-b border-border bg-surface px-4 shadow-topbar">
      <button
        onClick={onMobileMenu}
        aria-label="Open menu"
        className="rounded-control p-2 text-fg-muted hover:bg-surface-sunken lg:hidden"
      >
        <Menu size={20} />
      </button>

      <div className="flex flex-1 items-center justify-end gap-3 sm:justify-center">
        <div data-global-search className="w-full max-w-md">
          <SearchInput value={query} onValueChange={setQuery} placeholder="Search" shortcut="Alt+K" />
        </div>
      </div>

      <div className="flex items-center gap-2 sm:gap-3">
        <div className="relative">
          <IconButton icon={Bell} label="Notifications" variant="surface" size="lg" />
          <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-danger-500 px-1 text-2xs font-semibold text-white ring-2 ring-surface">
            4
          </span>
        </div>

        <Popover
          align="end"
          trigger={({ toggle, ref }) => (
            <button
              ref={ref}
              onClick={toggle}
              className="flex items-center gap-2 rounded-pill py-1 pl-1 pr-2 transition-colors hover:bg-surface-sunken"
            >
              <Avatar name={USER.name} size="md" />
              <span className="hidden flex-col items-start leading-tight sm:flex">
                <span className="text-sm font-semibold text-fg-strong">{USER.name}</span>
                <span className="text-2xs text-fg-muted">{USER.email}</span>
              </span>
              <ChevronDown size={15} className="hidden text-fg-subtle sm:block" />
            </button>
          )}
          panelClassName="min-w-[12rem]"
        >
          {() => (
            <>
              <div className="border-b border-border px-2.5 py-2">
                <p className="text-sm font-semibold text-fg-strong">{USER.name}</p>
                <p className="text-2xs text-fg-muted">{USER.email}</p>
              </div>
              <MenuItem icon={UserCircle}>Profile</MenuItem>
              <MenuItem icon={Settings}>Settings</MenuItem>
              <MenuItem icon={LogOut} tone="danger">
                Log out
              </MenuItem>
            </>
          )}
        </Popover>
      </div>
    </header>
  )
}
