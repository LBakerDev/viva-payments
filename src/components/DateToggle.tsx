import { Button } from '@/components/ui/button'
import { PAYMENT_DATES } from '@/lib/constants'
import { formatDate } from '@/lib/format'
import { cn } from '@/lib/utils'
import type { PaymentDate } from '@/types'

interface DateToggleProps {
  value: PaymentDate
  onChange: (date: PaymentDate) => void
}

/** Two-option toggle. Buttons (not a date picker) because only these dates are valid. */
export function DateToggle({ value, onChange }: DateToggleProps) {
  return (
    <div role="group" aria-label="Payment date" className="flex gap-1 rounded-[10px] bg-secondary p-1">
      {PAYMENT_DATES.map((date) => {
        const selected = date === value
        return (
          <Button
            key={date}
            type="button"
            size="lg"
            variant={selected ? 'default' : 'ghost'}
            aria-pressed={selected}
            onClick={() => onChange(date)}
            className={cn('font-semibold', !selected && 'hover:bg-card')}
          >
            {formatDate(date)}
          </Button>
        )
      })}
    </div>
  )
}
