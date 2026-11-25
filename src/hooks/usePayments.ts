import { useCallback, useEffect, useEffectEvent, useReducer, useRef, useState } from 'react'
import { createInitialState, paymentsReducer } from '@/state/paymentsReducer'
import type { PaymentDate } from '@/types'
import { runChain } from './paymentsChain'

export function usePayments(date: PaymentDate) {
  const [state, dispatch] = useReducer(paymentsReducer, undefined, createInitialState)
  const [loadKey, setLoadKey] = useState(0) // refresh/retry bump this to re-run the effect
  const controllerRef = useRef<AbortController | null>(null)

  // useEffectEvent (React 19.2+): reads the latest state without being an effect
  // dependency. Otherwise the chain would restart after every payment.
  const startChain = useEffectEvent((signal: AbortSignal) => {
    const { status, nextToken } = state[date]
    if (status === 'success') return // cached
    void runChain(date, nextToken, signal, dispatch) // start, or resume after abort/error
  })

  useEffect(() => {
    const controller = new AbortController()
    controllerRef.current = controller
    startChain(controller.signal)

    // Date switch, refresh, unmount and StrictMode's double-run all land here
    return () => {
      controller.abort()
      dispatch({ type: 'FETCH_ABORTED', date })
    }
  }, [date, loadKey])

  /** Re-pull the active date from START. */
  const refresh = useCallback(() => {
    controllerRef.current?.abort() // stop the old chain before clearing its rows
    dispatch({ type: 'FETCH_START', date, reset: true })
    setLoadKey((k) => k + 1)
  }, [date])

  /** Resume the active date from its last good token. */
  const retry = useCallback(() => setLoadKey((k) => k + 1), [])

  const { payments, status, error, updatedAt } = state[date]
  return {
    payments,
    status,
    error,
    updatedAt,
    isFetching: status === 'loading' || status === 'idle', // idle = one render before the effect starts
    refresh,
    retry,
  }
}
