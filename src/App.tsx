import { useState } from 'react'
import { DateToggle } from '@/components/DateToggle'
import { Header } from '@/components/Header'
import { Pagination } from '@/components/Pagination'
import { PaymentsTable } from '@/components/PaymentsTable'
import { RefreshButton } from '@/components/RefreshButton'
import { usePayments } from '@/hooks/usePayments'
import { PAGE_SIZE, PAYMENT_DATES } from '@/lib/constants'
import { formatTime } from '@/lib/format'
import { getPageView } from '@/lib/pagination'
import type { PaymentDate } from '@/types'

export default function App() {
  const [date, setDate] = useState<PaymentDate>(PAYMENT_DATES[0])
  const [page, setPage] = useState(0)
  const { payments, updatedAt, isFetching, refresh } = usePayments(date)

  const view = getPageView({ total: payments.length, page, pageSize: PAGE_SIZE, isFetching })
  const rows = view.ready ? payments.slice(view.start, view.end) : []

  const summary = isFetching
    ? `Loading payments… ${payments.length} so far`
    : payments.length > 0
      ? `Showing ${view.start + 1}–${view.end} of ${payments.length}` +
        (updatedAt ? ` · Updated ${formatTime(updatedAt)}` : '')
      : ''
  const announcement = isFetching ? 'Loading payments' : `${payments.length} payments loaded`

  const selectDate = (next: PaymentDate) => {
    setDate(next)
    setPage(0)
  }
  const handleRefresh = () => {
    refresh()
    setPage(0)
  }

  return (
    <div className="min-h-svh">
      <Header>
        <DateToggle value={date} onChange={selectDate} />
        <RefreshButton onClick={handleRefresh} />
      </Header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <section aria-label="Payments table" className="rounded-xl border bg-card p-4 sm:p-6">
          <PaymentsTable payments={rows} skeletonRows={view.ready ? 0 : PAGE_SIZE} />
          <Pagination
            page={view.page}
            pageCount={view.pageCount}
            isFinal={!isFetching}
            summary={summary}
            announcement={announcement}
            onPageChange={setPage}
          />
        </section>
      </main>
    </div>
  )
}
