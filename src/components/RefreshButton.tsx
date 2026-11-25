import { RefreshCw } from 'lucide-react'
import { Button } from '@/components/ui/button'

export function RefreshButton({ onClick }: { onClick: () => void }) {
  return (
    <Button type="button" size="lg" variant="outline" onClick={onClick} className="h-12 font-semibold">
      <RefreshCw aria-hidden="true" className="text-success" />
      Refresh
    </Button>
  )
}
