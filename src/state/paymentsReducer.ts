import { START_TOKEN } from '@/lib/constants'
import type { DateState, Payment, PaymentDate, PaymentsState } from '@/types'

export type PaymentsAction =
  | { type: 'FETCH_START'; date: PaymentDate; reset: boolean }
  | { type: 'PAYMENT_RECEIVED'; date: PaymentDate; payment: Payment; nextToken: string }
  | { type: 'FETCH_SUCCESS'; date: PaymentDate; at: number }
  | { type: 'FETCH_ERROR'; date: PaymentDate; error: string }
  | { type: 'FETCH_ABORTED'; date: PaymentDate }

export const emptyDateState = (): DateState => ({
  payments: [],
  seenIds: {},
  status: 'idle',
  nextToken: START_TOKEN,
})

export const createInitialState = (): PaymentsState => ({
  '2024-06-14': emptyDateState(),
  '2024-06-28': emptyDateState(),
})

/**
 * Records what happened to each date's fetch chain. Pure: no fetching,
 * no clocks (the hook passes `at`), so every transition is unit-testable.
 */
export function paymentsReducer(state: PaymentsState, action: PaymentsAction): PaymentsState {
  const current = state[action.date]
  const update = (next: DateState): PaymentsState => ({ ...state, [action.date]: next })

  switch (action.type) {
    case 'FETCH_START':
      // reset = Refresh: start over from START. Otherwise resume from nextToken.
      return update(
        action.reset
          ? { ...emptyDateState(), status: 'loading' }
          : { ...current, status: 'loading', error: undefined },
      )

    case 'PAYMENT_RECEIVED': {
      // Ignore stray results from a chain that's no longer running
      if (current.status !== 'loading') return state

      const { payment, nextToken } = action
      // Dedupe by paymentId only: different payments can share amount + account
      if (current.seenIds[payment.paymentId]) {
        return update({ ...current, nextToken })
      }
      return update({
        ...current,
        payments: [...current.payments, payment],
        seenIds: { ...current.seenIds, [payment.paymentId]: true },
        nextToken,
      })
    }

    case 'FETCH_SUCCESS':
      if (current.status !== 'loading') return state
      return update({ ...current, status: 'success', updatedAt: action.at })

    case 'FETCH_ERROR':
      if (current.status !== 'loading') return state
      // Keep rows + nextToken so Retry resumes where it stopped
      return update({ ...current, status: 'error', error: action.error })

    case 'FETCH_ABORTED':
      // Date switch / unmount: keep progress, mark as not running.
      // Coming back to this date resumes from nextToken.
      if (current.status !== 'loading') return state
      return update({ ...current, status: 'idle' })
  }
}
