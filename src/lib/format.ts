// timeZone UTC so "2024-06-14" never renders as Jun 13 in US timezones
const dayFmt = new Intl.DateTimeFormat('en-US', {
  month: 'short',
  day: 'numeric',
  year: 'numeric',
  timeZone: 'UTC',
})
export const formatDate = (iso: string) => dayFmt.format(new Date(`${iso}T00:00:00Z`))

const money = new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' })
export const formatAmount = (n: number) => money.format(n)

const timeFmt = new Intl.DateTimeFormat('en-US', { hour: 'numeric', minute: '2-digit' })
export const formatTime = (ms: number) => timeFmt.format(ms)
