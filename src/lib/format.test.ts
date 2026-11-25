import { describe, expect, it } from 'vitest'
import { formatAmount, formatDate } from './format'

describe('formatDate', () => {
  it('formats YYYY-MM-DD without a timezone shift', () => {
    expect(formatDate('2024-06-14')).toBe('Jun 14, 2024')
    expect(formatDate('2024-06-28')).toBe('Jun 28, 2024')
  })
})

describe('formatAmount', () => {
  it('formats dollars with two decimals', () => {
    expect(formatAmount(99.76)).toBe('$99.76') // real API values
    expect(formatAmount(68.1)).toBe('$68.10')
    expect(formatAmount(5000)).toBe('$5,000.00')
  })

  it('shows a minus sign for negatives', () => {
    expect(formatAmount(-45.5)).toBe('-$45.50')
  })
})
