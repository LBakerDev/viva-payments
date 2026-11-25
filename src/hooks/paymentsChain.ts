import { ApiError, isAbortError } from '@/api/errors'
import { fetchPayment } from '@/api/payments'
import { END_TOKEN } from '@/lib/constants'
import type { PaymentsAction } from '@/state/paymentsReducer'
import type { PaymentDate } from '@/types'

export function toErrorMessage(err: unknown): string {
  if (err instanceof ApiError && err.status === 403) {
    return 'Access denied by the payments API (403). If you’re on a VPN, try turning it off.'
  }
  if (err instanceof ApiError) return `The payments API returned an error (${err.status}).`
  // fetch rejects with TypeError when it can't connect or a CORS check fails
  if (err instanceof TypeError) return 'Couldn’t reach the payments API. If you’re on a VPN, try turning it off.'
  if (err instanceof Error) return err.message // e.g. missing .env config
  return 'Something went wrong.'
}

/**
 * Follow the token chain from `startToken` to 'END', dispatching each payment.
 * After `signal` aborts (date switch, refresh, unmount) nothing else is dispatched.
 *
 * TODO: retry transient failures (429/5xx) with backoff before surfacing an error.
 */
export async function runChain(
  date: PaymentDate,
  startToken: string,
  signal: AbortSignal,
  dispatch: (action: PaymentsAction) => void,
) {
  dispatch({ type: 'FETCH_START', date, reset: false })
  let token = startToken
  try {
    while (token !== END_TOKEN) {
      const { data } = await fetchPayment(date, token, signal)
      if (signal.aborted) return
      const { paginationToken, ...payment } = data // keep the token out of table data
      token = paginationToken
      // The END response is still a real payment, so it's added before the loop exits
      dispatch({ type: 'PAYMENT_RECEIVED', date, payment, nextToken: token })
    }
    dispatch({ type: 'FETCH_SUCCESS', date, at: Date.now() })
  } catch (err) {
    if (isAbortError(err) || signal.aborted) return
    dispatch({ type: 'FETCH_ERROR', date, error: toErrorMessage(err) })
  }
}
