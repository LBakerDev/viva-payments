import { afterEach, describe, expect, it, vi } from 'vitest'
import { ApiError, isAbortError } from './errors'
import { fetchPaymentMock } from './mockPayments'
import { fetchPaymentLive } from './payments'
import type { PaymentDate } from '@/types'

async function walk(date: PaymentDate) {
  const payments = []
  let token = 'START'
  while (token !== 'END') {
    const res = await fetchPaymentMock(date, token)
    payments.push(res.data)
    token = res.data.paginationToken
  }
  return payments
}

describe('fetchPaymentMock', () => {
  it('walks the chain like the real API (13 and 68 payments, END on the last)', async () => {
    vi.useFakeTimers()
    const jun14 = walk('2024-06-14')
    await vi.runAllTimersAsync()
    const rows = await jun14
    expect(rows).toHaveLength(13)
    expect(rows.at(-1)?.paginationToken).toBe('END')
    // token = next payment's id
    expect(rows[0].paginationToken).toBe(rows[1].paymentId)

    const jun28 = walk('2024-06-28')
    await vi.runAllTimersAsync()
    expect(await jun28).toHaveLength(68)
    vi.useRealTimers()
  })

  it('rejects with AbortError when aborted', async () => {
    const controller = new AbortController()
    const pending = fetchPaymentMock('2024-06-14', 'START', controller.signal)
    controller.abort()
    await expect(pending).rejects.toSatisfy(isAbortError)
  })
})

describe('fetchPaymentLive', () => {
  afterEach(() => {
    vi.unstubAllGlobals()
    vi.unstubAllEnvs()
  })

  it('sends the bearer token and continuationToken param', async () => {
    vi.stubEnv('VITE_API_BASE', 'https://api.test/v1')
    vi.stubEnv('VITE_API_TOKEN', 'test-token')
    const fetchMock = vi.fn().mockResolvedValue(
      new Response(JSON.stringify({ data: { paginationToken: 'END' }, request_id: 'r1' })),
    )
    vi.stubGlobal('fetch', fetchMock)

    await fetchPaymentLive('2024-06-14', 'START')

    const [url, init] = fetchMock.mock.calls[0]
    expect(url).toBe('https://api.test/v1/payments?date=2024-06-14&continuationToken=START')
    expect(init.headers).toEqual({ Authorization: 'Bearer test-token' })
  })

  it('throws ApiError with the status on a non-OK response', async () => {
    vi.stubEnv('VITE_API_BASE', 'https://api.test/v1')
    vi.stubEnv('VITE_API_TOKEN', 'test-token')
    vi.stubGlobal('fetch', vi.fn().mockResolvedValue(new Response('{}', { status: 403 })))

    const err = await fetchPaymentLive('2024-06-14', 'START').catch((e) => e)
    expect(err).toBeInstanceOf(ApiError)
    expect(err.status).toBe(403)
  })
})
