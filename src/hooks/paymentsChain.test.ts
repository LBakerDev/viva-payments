import { beforeEach, describe, expect, it, vi } from 'vitest'
import { ApiError } from '@/api/errors'
import { fetchPayment } from '@/api/payments'
import type { PaymentsAction } from '@/state/paymentsReducer'
import { runChain } from './paymentsChain'

vi.mock('@/api/payments', () => ({ fetchPayment: vi.fn() }))
const fetchMock = vi.mocked(fetchPayment)

const D = '2024-06-14' as const
const res = (id: string, next: string) => ({
  data: { paymentId: id, bankAccountId: 'acct', effectiveDate: D, amount: 1, paginationToken: next },
  request_id: 'r',
})
const types = (dispatch: ReturnType<typeof vi.fn>) =>
  dispatch.mock.calls.map(([a]) => (a as PaymentsAction).type)

describe('runChain', () => {
  beforeEach(() => {
    fetchMock.mockReset()
  })

  it('walks the chain, keeps the END payment, then succeeds', async () => {
    fetchMock.mockResolvedValueOnce(res('a', 'b')).mockResolvedValueOnce(res('b', 'END'))
    const dispatch = vi.fn()
    await runChain(D, 'START', new AbortController().signal, dispatch)

    expect(types(dispatch)).toEqual(['FETCH_START', 'PAYMENT_RECEIVED', 'PAYMENT_RECEIVED', 'FETCH_SUCCESS'])
    expect(fetchMock).toHaveBeenNthCalledWith(2, D, 'b', expect.any(AbortSignal))
    expect(dispatch.mock.calls[1][0].payment).not.toHaveProperty('paginationToken')
  })

  it('resumes from the token it is given', async () => {
    fetchMock.mockResolvedValueOnce(res('c', 'END'))
    await runChain(D, 'c', new AbortController().signal, vi.fn())
    expect(fetchMock).toHaveBeenCalledWith(D, 'c', expect.any(AbortSignal))
  })

  it('dispatches nothing more once aborted mid-chain (the date-switch race)', async () => {
    const controller = new AbortController()
    fetchMock.mockImplementationOnce(async () => {
      controller.abort() // user switches date while this request is in flight
      return res('a', 'b')
    })
    const dispatch = vi.fn()
    await runChain(D, 'START', controller.signal, dispatch)

    expect(types(dispatch)).toEqual(['FETCH_START'])
    expect(fetchMock).toHaveBeenCalledTimes(1)
  })

  it('reports errors with a helpful message', async () => {
    fetchMock.mockRejectedValueOnce(new ApiError(403, 'x'))
    const dispatch = vi.fn()
    await runChain(D, 'START', new AbortController().signal, dispatch)

    expect(dispatch.mock.calls.at(-1)?.[0]).toMatchObject({
      type: 'FETCH_ERROR',
      error: expect.stringContaining('VPN'),
    })
  })
})
