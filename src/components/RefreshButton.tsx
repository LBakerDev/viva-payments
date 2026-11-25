import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

interface RefreshButtonProps {
  onClick: () => void
  spinning?: boolean // true while payments are loading
}

export function RefreshButton({ onClick, spinning = false }: RefreshButtonProps) {
  return (
    <Button type="button" size="lg" variant="outline" onClick={onClick} className="h-12 font-semibold">
      <RefreshCw aria-hidden="true" className={cn('text-success', spinning && 'motion-safe:animate-spin')} />
      Refresh
    </Button>
  )
}
