import type { Payment, PaymentDate, PaymentResponse } from '@/types'
import { ApiError } from './errors'

/**
 * Local stand-in for the payments API (VITE_USE_MOCK=true).
 * Mirrors the real API: one payment per call, `paginationToken` is the next
 * payment's id, and the last payment carries 'END'. Counts match the real
 * data (13 and 68). Data is seeded so it's identical on every reload.
 */

const COUNTS: Record<PaymentDate, number> = { '2024-06-14': 13, '2024-06-28': 68 }
const LATENCY_MS = 150

function seeded(seed: number) {
  let s = seed
  return () => {
    s = (s * 1664525 + 1013904223) % 4294967296
    return s / 4294967296
  }
}

function makePayments(date: PaymentDate): Payment[] {
  const rand = seeded(date === '2024-06-14' ? 14 : 28)
  const hex = (n: number) =>
    Array.from({ length: n }, () => Math.floor(rand() * 16).toString(16)).join('')
  const uuid = () => `${hex(8)}-${hex(4)}-4${hex(3)}-${hex(4)}-${hex(12)}`

  return Array.from({ length: COUNTS[date] }, () => ({
    paymentId: uuid(),
    bankAccountId: uuid(),
    effectiveDate: date,
    amount: Math.round((10 + rand() * 490) * 100) / 100,
  }))
}

const DATA: Record<PaymentDate, Payment[]> = {
  '2024-06-14': makePayments('2024-06-14'),
  '2024-06-28': makePayments('2024-06-28'),
}

const failRate = Number(import.meta.env.VITE_MOCK_FAIL_RATE ?? 0)

function delay(ms: number, signal?: AbortSignal) {
  return new Promise<void>((resolve, reject) => {
    const abort = () => reject(new DOMException('Aborted', 'AbortError'))
    if (signal?.aborted) return abort()
    const timer = setTimeout(resolve, ms)
    signal?.addEventListener('abort', () => (clearTimeout(timer), abort()), { once: true })
  })
}

export async function fetchPaymentMock(
  date: PaymentDate,
  token: string,
  signal?: AbortSignal,
): Promise<PaymentResponse> {
  await delay(LATENCY_MS, signal)

  // Optional: VITE_MOCK_FAIL_RATE=0.1 makes ~10% of calls fail, to exercise retry/error UI
  if (failRate > 0 && Math.random() < failRate) {
    throw new ApiError(503, 'Mock: simulated server error')
  }

  const list = DATA[date]
  const index = token === 'START' ? 0 : list.findIndex((p) => p.paymentId === token)
  if (!list || index < 0) throw new ApiError(400, `Mock: unknown token "${token}"`)

  const payment = list[index]
  const next = list[index + 1]
  return {
    data: { ...payment, paginationToken: next ? next.paymentId : 'END' },
    request_id: `mock-${date}-${index}`,
  }
}
