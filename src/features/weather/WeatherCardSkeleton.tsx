
import { Skeleton } from '@/components/ui/skeleton'

/** Loading skeleton for weather cards */
export function WeatherCardSkeleton() {
  return (
    <div className="space-y-3 animate-pulse transition-all duration-700 ease-in-out">
      <div className="flex items-center gap-2">
        <Skeleton className="h-5 w-5 rounded-full bg-muted/70 dark:bg-muted/40" />
        <Skeleton className="h-4 w-24 bg-muted/70 dark:bg-muted/40" />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <Skeleton className="h-10 rounded-md bg-muted/70 dark:bg-muted/40" />
        <Skeleton className="h-10 rounded-md bg-muted/70 dark:bg-muted/40" />
        <Skeleton className="h-10 rounded-md bg-muted/70 dark:bg-muted/40" />
        <Skeleton className="h-10 rounded-md bg-muted/70 dark:bg-muted/40" />
      </div>
    </div>
  )
}