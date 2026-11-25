import { useState } from 'react'
import { DateToggle } from '@/components/DateToggle'
import { Header } from '@/components/Header'
import { PaymentsTable } from '@/components/PaymentsTable'
import { RefreshButton } from '@/components/RefreshButton'
import { PAYMENT_DATES } from '@/lib/constants'
import type { Payment, PaymentDate } from '@/types'

// Step 6: placeholder rows (values from the real API) so the layout can be
// built without loading states. Step 7 replaces this with usePayments(date).
const SAMPLE: Omit<Payment, 'effectiveDate'>[] = [
  { paymentId: '94173760-0e67-44cb-b187-d84c56ce221d', bankAccountId: '1a719f22-8fcb-483a-a6fd-6b34bbc531af', amount: 99.76 },
  { paymentId: '9dcc58fe-6a7d-4c94-8e0b-97da26396c7b', bankAccountId: '7885451d-e00a-43e4-9d64-a309f2edc055', amount: 68.1 },
  { paymentId: '0cedf29d-5f4b-4955-8e3e-e78bc3178de6', bankAccountId: '1a719f22-8fcb-483a-a6fd-6b34bbc531af', amount: 99.76 },
  { paymentId: '6b9ca30c-253b-43b1-bc3e-f2eff2c85434', bankAccountId: '32f53706-4d2e-4d60-8a8a-b212493f2f1f', amount: 69.26 },
]

export default function App() {
  const [date, setDate] = useState<PaymentDate>(PAYMENT_DATES[0])
  const payments = SAMPLE.map((p) => ({ ...p, effectiveDate: date }))

  return (
    <div className="min-h-svh">
      <Header>
        <DateToggle value={date} onChange={setDate} />
        <RefreshButton onClick={() => console.info('refresh: wired up in step 7')} />
      </Header>

      <main className="mx-auto max-w-5xl px-4 py-8 sm:px-6">
        <section aria-label="Payments table" className="rounded-xl border bg-card p-4 sm:p-6">
          <PaymentsTable payments={payments} />
        </section>
      </main>
    </div>
  )
}
