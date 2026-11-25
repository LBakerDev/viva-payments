import { CircleAlert } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface ErrorBannerProps {
  message: string
  loadedCount: number
  onRetry: () => void
}

/** Shown above the table when the chain stops early. Retry resumes from the last good token. */
export function ErrorBanner({ message, loadedCount, onRetry }: ErrorBannerProps) {
  const title =
    loadedCount > 0
      ? `Couldn’t load all payments. Showing the ${loadedCount} loaded so far.`
      : 'Couldn’t load payments.'

  return (
    <div
      role="alert"
      className="mb-2 flex flex-wrap items-center justify-between gap-3 rounded-[10px] border border-destructive/25 bg-destructive/5 px-4 py-3"
    >
      <div className="flex gap-3">
        <CircleAlert aria-hidden="true" className="mt-0.5 size-5 shrink-0 text-destructive" />
        <div>
          <p className="text-sm font-semibold text-destructive">{title}</p>
          <p className="text-[13px] text-muted-foreground">{message}</p>
        </div>
      </div>
      <Button type="button" variant="outline" onClick={onRetry} className="font-semibold">
        Retry
      </Button>
    </div>
  )
}
