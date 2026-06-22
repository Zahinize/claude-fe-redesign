import { Loader2 } from 'lucide-react'
import { cn } from '@/lib/cn'

export function Spinner({ size = 20, className }: { size?: number; className?: string }) {
  return <Loader2 size={size} className={cn('animate-spin text-fg-muted', className)} />
}

export function LoadingBlock({ label = 'Loading…' }: { label?: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-6 py-20 text-fg-muted">
      <Spinner size={26} />
      <span className="text-base">{label}</span>
    </div>
  )
}
