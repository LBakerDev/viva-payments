import { Button } from '@/components/ui/button'
import { Skeleton } from '@/components/ui/skeleton'

// Step 1 smoke test: logo, brand font, primary color, skeleton, row color.
// Replaced in step 6 with the real layout.
export default function App() {
  return (
    <div className="min-h-svh p-8">
      <img src="/viva-logo.png" alt="VIVA Finance" className="h-10" />
      <h1 className="mt-4 text-lg font-bold">Payments</h1>
      <div className="mt-4 flex gap-2">
        <Button>Jun 14, 2024</Button>
        <Button variant="outline">Refresh</Button>
      </div>
      <Skeleton className="mt-4 h-14 w-full rounded-[10px]" />
      <div className="mt-2 h-14 rounded-[10px] bg-row" />
    </div>
  )
}
