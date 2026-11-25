import type { ReactNode } from 'react'

/** White top bar: logo + page title on the left, page controls on the right. */
export function Header({ children }: { children: ReactNode }) {
  return (
    <header className="border-b bg-card">
      <div className="flex flex-wrap items-center justify-between gap-4 px-6 py-3 sm:px-8">
        <div className="flex items-center gap-4">
          <img src="/viva-logo.svg" alt="VIVA Finance" className="h-10 w-auto" />
          <div aria-hidden="true" className="h-7 w-px bg-border" />
          <h1 className="text-lg font-bold">Payments</h1>
        </div>
        <div className="flex flex-wrap items-center gap-3">{children}</div>
      </div>
    </header>
  )
}
