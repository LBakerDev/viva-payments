import { USE_MOCK } from '@/lib/constants'
import type { PaymentDate, PaymentResponse } from '@/types'
import { ApiError } from './errors'
import { fetchPaymentMock } from './mockPayments'

/**
 * Fetch ONE payment. The caller loops on `data.paginationToken` until 'END'.
 *
 * Naming quirk in the API: the request param is `continuationToken`,
 * but the response field is `paginationToken`.
 */
export async function fetchPaymentLive(
  date: PaymentDate,
  token: string,
  signal?: AbortSignal,
): Promise<PaymentResponse> {
  const base = import.meta.env.VITE_API_BASE
  const apiToken = import.meta.env.VITE_API_TOKEN
  if (!base || !apiToken) {
    throw new Error('Missing VITE_API_BASE or VITE_API_TOKEN. Copy .env.example to .env.')
  }

  const params = new URLSearchParams({ date, continuationToken: token })
  const res = await fetch(`${base}/payments?${params}`, {
    headers: { Authorization: `Bearer ${apiToken}` },
    signal,
  })

  if (!res.ok) {
    // 403 here is often a VPN/IP block rather than a bad token (see README)
    throw new ApiError(res.status, `Payments request failed (${res.status})`)
  }
  return (await res.json()) as PaymentResponse
}

export const fetchPayment = USE_MOCK ? fetchPaymentMock : fetchPaymentLive
