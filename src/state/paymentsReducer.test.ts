import { describe, expect, it } from 'vitest'
import type { Payment, PaymentsState } from '@/types'
import { createInitialState, paymentsReducer, type PaymentsAction } from './paymentsReducer'

const D = '2024-06-14' as const
const payment = (id: string): Payment => ({
  paymentId: id,
  bankAccountId: `acct-${id}`,
  effectiveDate: D,
  amount: 99.76,
})
const run = (actions: PaymentsAction[], state: PaymentsState = createInitialState()) =>
  actions.reduce(paymentsReducer, state)

const start = { type: 'FETCH_START', date: D, reset: false } as const
const received = (id: string, nextToken: string) =>
  ({ type: 'PAYMENT_RECEIVED', date: D, payment: payment(id), nextToken }) as const

describe('paymentsReducer', () => {
  it('starts both dates idle at START', () => {
    const s = createInitialState()
    expect(s['2024-06-14']).toMatchObject({ status: 'idle', nextToken: 'START', payments: [] })
    expect(s['2024-06-28']).toMatchObject({ status: 'idle', nextToken: 'START', payments: [] })
  })

  it('appends payments and advances the token', () => {
    const s = run([start, received('a', 'b'), received('b', 'END')])
    expect(s[D].payments.map((p) => p.paymentId)).toEqual(['a', 'b'])
    expect(s[D].nextToken).toBe('END')
  })

  it('skips a duplicate paymentId but still advances the token', () => {
    const s = run([start, received('a', 'b'), received('a', 'c')])
    expect(s[D].payments).toHaveLength(1)
    expect(s[D].nextToken).toBe('c')
  })

  it('marks success with the given timestamp', () => {
    const s = run([start, received('a', 'END'), { type: 'FETCH_SUCCESS', date: D, at: 123 }])
    expect(s[D]).toMatchObject({ status: 'success', updatedAt: 123 })
  })

  it('keeps rows and nextToken on error, then resumes on retry', () => {
    const errored = run([start, received('a', 'b'), { type: 'FETCH_ERROR', date: D, error: '503' }])
    expect(errored[D]).toMatchObject({ status: 'error', error: '503', nextToken: 'b' })
    expect(errored[D].payments).toHaveLength(1)

    const retried = run([start], errored)
    expect(retried[D]).toMatchObject({ status: 'loading', nextToken: 'b', error: undefined })
    expect(retried[D].payments).toHaveLength(1)
  })

  it('refresh (reset) clears rows and goes back to START', () => {
    const s = run([start, received('a', 'b'), { type: 'FETCH_START', date: D, reset: true }])
    expect(s[D]).toMatchObject({ status: 'loading', nextToken: 'START', payments: [] })
  })

  it('abort keeps progress so the chain can resume later', () => {
    const s = run([start, received('a', 'b'), { type: 'FETCH_ABORTED', date: D }])
    expect(s[D]).toMatchObject({ status: 'idle', nextToken: 'b' })
    expect(s[D].payments).toHaveLength(1)
  })

  it('ignores stray payments when the date is not loading', () => {
    const s = run([start, received('a', 'END'), { type: 'FETCH_SUCCESS', date: D, at: 1 }, received('z', 'END')])
    expect(s[D].payments.map((p) => p.paymentId)).toEqual(['a'])
  })

  it('keeps dates independent and never mutates previous state', () => {
    const before = createInitialState()
    const snapshot = structuredClone(before)
    const after = run([start, received('a', 'END')], before)

    expect(before).toEqual(snapshot) // untouched
    expect(after['2024-06-28']).toBe(before['2024-06-28']) // other date same reference
  })
})
