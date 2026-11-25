import { describe, expect, it } from 'vitest'
import { getPageView } from './pagination'

const view = (total: number, page: number, isFetching: boolean) =>
  getPageView({ total, page, pageSize: 10, isFetching })

describe('getPageView', () => {
  it('shows a skeleton until the first page is full', () => {
    expect(view(7, 0, true)).toMatchObject({ pageCount: 1, ready: false })
  })

  it('reveals full pages while the rest keep loading', () => {
    expect(view(13, 0, true)).toMatchObject({ pageCount: 2, ready: true, start: 0, end: 10 })
    expect(view(13, 1, true)).toMatchObject({ ready: false }) // still filling
  })

  it('shows the partial last page once loading is done', () => {
    expect(view(13, 1, false)).toMatchObject({ pageCount: 2, ready: true, start: 10, end: 13 })
  })

  it('clamps a page that is out of range', () => {
    expect(view(13, 5, false)).toMatchObject({ page: 1 })
    expect(view(13, -1, false)).toMatchObject({ page: 0 })
  })

  it('handles an empty result', () => {
    expect(view(0, 0, false)).toMatchObject({ pageCount: 1, ready: true, start: 0, end: 0 })
  })
})
