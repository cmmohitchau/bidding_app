import { Skeleton } from "@/components/ui/skeleton"

export function SkeletonCard() {
  return (
    <div className="flex flex-col space-y-3">
      <Skeleton className="h-4/5 max-w-lg w-full rounded-xl" />
      <div className="space-y-2">
        <Skeleton className="h-1/10 max-w-lg w-full  rounded-md" />
        <Skeleton className="h-1/10 max-w-lg w-full rounded-md" />
      </div>
    </div>
  )
}
