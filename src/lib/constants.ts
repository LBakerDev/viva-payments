import type { PaymentDate } from '@/types'

export const API_BASE = import.meta.env.VITE_API_BASE
export const API_TOKEN = import.meta.env.VITE_API_TOKEN
export const USE_MOCK = import.meta.env.VITE_USE_MOCK === 'true'

export const PAYMENT_DATES: PaymentDate[] = ['2024-06-14', '2024-06-28']
export const PAGE_SIZE = 10
export const START_TOKEN = 'START'
export const END_TOKEN = 'END'
