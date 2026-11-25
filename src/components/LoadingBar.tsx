import { cn } from '@/lib/utils'

/**
 * Thin progress bar at the top of the card while the chain is loading.
 * Animates continuously (indeterminate) because the total isn't known until 'END'.
 * Stays in the layout when inactive so nothing shifts.
 */
export function LoadingBar({ active }: { active: boolean }) {
  return (
    <div
      aria-hidden="true"
      className={cn('mb-3 h-1 overflow-hidden rounded-full', active ? 'bg-primary/15' : 'invisible')}
    >
      <div className="h-full w-2/5 rounded-full bg-primary motion-safe:animate-indeterminate" />
    </div>
  )
}
