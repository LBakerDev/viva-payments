interface PageViewInput {
  total: number // payments loaded so far
  page: number // requested page (0-based)
  pageSize: number
  isFetching: boolean
}

/**
 * Which slice of payments to show, and whether that page is ready.
 *
 * While the chain is still loading, a page is only shown once it's FULL,
 * so rows never trickle in one by one. The page still filling up shows a
 * skeleton, and the page count reads "N+" because the total isn't known yet.
 */
export function getPageView({ total, page, pageSize, isFetching }: PageViewInput) {
  const fullPages = Math.floor(total / pageSize)
  const pageCount = isFetching ? fullPages + 1 : Math.max(1, Math.ceil(total / pageSize))
  const current = Math.min(Math.max(page, 0), pageCount - 1)
  const start = current * pageSize

  return {
    page: current,
    pageCount,
    start,
    end: Math.min(start + pageSize, total),
    ready: !isFetching || current < fullPages,
  }
}
