export type PaymentDate = '2024-06-14' | '2024-06-28'

export interface Payment {
  paymentId: string
  effectiveDate: string // YYYY-MM-DD
  amount: number // dollars
  bankAccountId: string
}

// Response field is `paginationToken`; the request param is `continuationToken`.
// The token is the next payment's paymentId, or 'END' on the last payment
// (which is still a real payment).
export interface PaymentResponse {
  data: Payment & { paginationToken: string }
  request_id: string
}

export type LoadStatus = 'idle' | 'loading' | 'success' | 'error'

export interface DateState {
  payments: Payment[]
  seenIds: Record<string, true> // dedupe by paymentId only
  status: LoadStatus
  nextToken: string // 'START' | uuid | 'END'; lets Retry resume
  error?: string
  updatedAt?: number
}

export type PaymentsState = Record<PaymentDate, DateState>
