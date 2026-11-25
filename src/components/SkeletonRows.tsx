import { Skeleton } from '@/components/ui/skeleton'

/** Placeholder rows shaped like PaymentRow, shown while a page is loading. */
export function SkeletonRows({ count }: { count: number }) {
  return (
    <>
      {Array.from({ length: count }, (_, i) => (
        <tr key={i} aria-hidden="true" className="[&>td]:bg-row">
          <td className="h-14 rounded-l-[10px] pl-5">
            <Skeleton className="size-[22px] rounded-full bg-border motion-reduce:animate-none" />
          </td>
          <td>
            <Skeleton className="h-3 w-28 bg-border motion-reduce:animate-none" />
          </td>
          <td className="pr-4">
            <Skeleton className="h-3 w-3/4 bg-border motion-reduce:animate-none" />
          </td>
          <td className="rounded-r-[10px] pr-5">
            <Skeleton className="ml-auto h-3 w-20 bg-border motion-reduce:animate-none" />
          </td>
        </tr>
      ))}
    </>
  )
}
