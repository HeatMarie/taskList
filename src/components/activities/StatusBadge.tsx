import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import type { StatusName } from "./types"

interface StatusBadgeProps {
  status: StatusName
  className?: string
}

export function StatusBadge({ status, className }: StatusBadgeProps) {
  return (
    <Badge
      variant="outline"
      className={cn(
        "text-xs font-medium",
        status === "Active" && "bg-emerald-50 text-emerald-700 border-emerald-200",
        status === "Inactive" && "bg-amber-50 text-amber-700 border-amber-200",
        status === "Deleted" && "bg-red-50 text-red-600 border-red-200",
        className
      )}
    >
      {status}
    </Badge>
  )
}
