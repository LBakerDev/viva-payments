import { CircleCheck } from 'lucide-react'
import { formatAmount, formatDate } from '@/lib/format'
import type { Payment } from '@/types'

/**
 * One payment, styled per the Figma: gray rounded row, check icon, signed amount.
 * The check is decorative: the API has no status field yet.
 * TODO: drive the icon from a real status once the API provides one.
 */
export function PaymentRow({ payment }: { payment: Payment }) {
  return (
    <tr title={`Payment ${payment.paymentId}`} className="[&>td]:bg-row">
      <td className="h-14 rounded-l-[10px] pl-5">
        <CircleCheck aria-hidden="true" strokeWidth={1.75} className="size-[22px] text-success" />
      </td>
      <td>{formatDate(payment.effectiveDate)}</td>
      <td className="max-w-0 truncate pr-4">{payment.bankAccountId}</td>
      <td className="rounded-r-[10px] pr-5 text-right font-bold tabular-nums">
        {formatAmount(payment.amount)}
      </td>
    </tr>
  )
}
