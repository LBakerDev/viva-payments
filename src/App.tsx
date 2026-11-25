import { useState } from 'react'
import { DateToggle } from '@/components/DateToggle'
import { ErrorBanner } from '@/components/ErrorBanner'
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Pagination'
import { PaymentsTable } from '@/components/PaymentsTable'
import { RefreshButton } from '@/components/RefreshButton'
import { usePayments } from '@/hooks/usePayments'
import { PAGE_SIZE, PAYMENT_DATES } from '@/lib/constants'
import { formatDate, formatTime } from '@/lib/format'
import { getPageView } from '@/lib/pagination'
import type { PaymentDate } from '@/types'

export default function App() {
  const [date, setDate] = useState<PaymentDate>(PAYMENT_DATES[0])
  const [page, setPage] = useState(0)
  const [refreshing, setRefreshing] = useState(false) // spin the icon only for Refresh-triggered loads
  const { payments, status, error, updatedAt, isFetching, refresh, retry } = usePayments(date)

  const view = getPageView({ total: payments.length, page, pageSize: PAGE_SIZE, isFetching })
  const rows = view.ready ? payments.slice(view.start, view.end) : []

  const summary = isFetching
    ? `Loading payments… ${payments.length} so far`
    : payments.length > 0
      ? `Showing ${view.start + 1}–${view.end} of ${payments.length}` +
        (status === 'success' && updatedAt ? ` · Updated ${formatTime(updatedAt)}` : '')
      : ''
  const announcement = isFetching
    ? 'Loading payments'
    : status === 'error'
      ? 'Loading stopped with an error'
      : `${payments.length} payments loaded`
  const emptyMessage =
    status === 'success' && payments.length === 0 ? `No payments for ${formatDate(date)}` : undefined

  const selectDate = (next: PaymentDate) => {
    setDate(next)
    setPage(0)
    setRefreshing(false)
  }
  const handleRefresh = () => {
    refresh()
    setPage(0)
    setRefreshing(true)
  }

  return (
    <div className="min-h-svh">
      <Header>
        <DateToggle value={date} onChange={selectDate} />
        <RefreshButton onClick={handleRefresh} spinning={refreshing && isFetching} />
      </Header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <section aria-label="Payments table" className="rounded-xl border bg-card p-4 sm:p-6">
          {status === 'error' && error && (
            <ErrorBanner message={error} loadedCount={payments.length} onRetry={retry} />
          )}
          <PaymentsTable
            payments={rows}
            skeletonRows={view.ready ? 0 : PAGE_SIZE}
            emptyMessage={emptyMessage}
          />
          <Pagination
            page={view.page}
            pageCount={view.pageCount}
            isFinal={status === 'success'}
            summary={summary}
            announcement={announcement}
            onPageChange={setPage}
          />
        </section>
      </main>
    </div>
  )
}
