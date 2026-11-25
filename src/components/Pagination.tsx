import { ChevronLeft, ChevronRight } from 'lucide-react'
import { Button } from '@/components/ui/button'

interface PaginationProps {
  page: number // 0-based
  pageCount: number
  isFinal: boolean // false while loading: the count shows "N+"
  summary: string // "Showing 1–10 of 68 · Updated 9:41 PM"
  announcement: string // screen-reader message, changes only on start/finish
  onPageChange: (page: number) => void
}

/**
 * Prev/next with "Page X of Y" rather than numbered buttons: the number of
 * payments in production is unknown, and 50 page buttons wouldn't scale.
 */
export function Pagination({ page, pageCount, isFinal, summary, announcement, onPageChange }: PaginationProps) {
  return (
    <nav aria-label="Pagination" className="flex flex-wrap items-center justify-between gap-3 pt-2">
      <p className="text-[13px] text-muted-foreground">{summary}</p>
      <span aria-live="polite" className="sr-only">
        {announcement}
      </span>

      <div className="flex items-center gap-2">
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label="Previous page"
          disabled={page === 0}
          onClick={() => onPageChange(page - 1)}
        >
          <ChevronLeft aria-hidden="true" />
        </Button>
        <span className="min-w-28 text-center text-sm font-semibold tabular-nums">
          Page {page + 1} of {pageCount}
          {isFinal ? '' : '+'}
        </span>
        <Button
          type="button"
          variant="outline"
          size="icon-lg"
          aria-label="Next page"
          disabled={page >= pageCount - 1}
          onClick={() => onPageChange(page + 1)}
        >
          <ChevronRight aria-hidden="true" />
        </Button>
      </div>
    </nav>
  )
}
