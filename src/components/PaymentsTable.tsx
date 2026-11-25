import type { Payment } from '@/types'
import { PaymentRow } from './PaymentRow'
import { SkeletonRows } from './SkeletonRows'

/**
 * Real <table> for screen readers; rows are spaced apart with border-spacing.
 * Header and body share one <colgroup> so the columns always line up.
 */
interface PaymentsTableProps {
  payments: Payment[]
  skeletonRows?: number // > 0 while the current page is still loading
}

export function PaymentsTable({ payments, skeletonRows = 0 }: PaymentsTableProps) {
  return (
    <div className="overflow-x-auto">
      <table
        aria-busy={skeletonRows > 0}
        className="w-full min-w-[720px] border-separate border-spacing-y-2.5 text-[15px]"
      >
        <caption className="sr-only">Payments</caption>
        <colgroup>
          <col className="w-14" />
          <col className="w-48" />
          <col />
          <col className="w-40" />
        </colgroup>
        <thead>
          <tr className="text-left text-[13px] font-semibold text-muted-foreground">
            <th scope="col" className="pl-5">
              <span className="sr-only">Status</span>
            </th>
            <th scope="col">Effective Date</th>
            <th scope="col">Bank Account Id</th>
            <th scope="col" className="pr-5 text-right">
              Amount
            </th>
          </tr>
        </thead>
        <tbody>
          {payments.map((payment) => (
            <PaymentRow key={payment.paymentId} payment={payment} />
          ))}
          <SkeletonRows count={skeletonRows} />
        </tbody>
      </table>
    </div>
  )
}
