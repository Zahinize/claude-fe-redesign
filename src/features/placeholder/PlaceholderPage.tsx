import { useLocation } from 'react-router-dom'
import { Construction } from 'lucide-react'
import { PageContainer, PageHeader } from '@/components/layout/Page'
import { Card } from '@/components/ui/Card'
import { EmptyState } from '@/components/ui/EmptyState'
import { NAV } from '@/data/navConfig'

/** Resolve a friendly title for any non-built nav destination. */
function titleFor(pathname: string): string {
  for (const entry of NAV) {
    if (entry.kind === 'leaf' && entry.to === pathname) return entry.label
    if (entry.kind === 'group') {
      const child = entry.children.find((c) => c.to === pathname)
      if (child) return child.label
    }
  }
  const seg = pathname.split('/').filter(Boolean).pop() ?? 'Page'
  return seg.charAt(0).toUpperCase() + seg.slice(1)
}

export function PlaceholderPage() {
  const { pathname } = useLocation()
  const title = titleFor(pathname)
  return (
    <PageContainer>
      <PageHeader title={title} description="Part of the Governata data governance platform." />
      <Card className="mt-5">
        <EmptyState
          icon={Construction}
          title={`${title} is not part of this prototype`}
          description="This build focuses on the Consent Management module. The surrounding navigation is included to show how Consent Management fits within the wider governance platform."
        />
      </Card>
    </PageContainer>
  )
}
