import { Badge } from "@/components/ui/badge"
import { cn } from "@/lib/utils"
import { getProcessColor } from "./activity-utils"
import type { ProcessLink } from "./types"

interface ProcessBadgesProps {
  links: ProcessLink[]
  maxVisible?: number
}

export function ProcessBadges({ links, maxVisible = 2 }: ProcessBadgesProps) {
  const active = links.filter((l) => l.Status_Code.Status_Name === "Active")

  if (active.length === 0) {
    return <span className="text-muted-foreground text-sm">—</span>
  }

  const visible = active.slice(0, maxVisible)
  const overflow = active.length - maxVisible
  const overflowNames = active.slice(maxVisible).map((l) => l.Process.Process_Name).join(", ")

  return (
    <div className="flex flex-wrap gap-1.5">
      {visible.map((link) => (
        <Badge
          key={link.Process_Activity_ID}
          variant="outline"
          className={cn("text-xs font-medium cursor-default", getProcessColor(link.Process.Process_Name))}
          title={link.Room.Room_Name ? `${link.Process.Process_Name} · ${link.Room.Room_Name}` : link.Process.Process_Name}
        >
          {link.Process.Process_Name}
        </Badge>
      ))}
      {overflow > 0 && (
        <Badge
          variant="outline"
          className="text-xs text-muted-foreground border-dashed cursor-default"
          title={overflowNames}
        >
          +{overflow} more
        </Badge>
      )}
    </div>
  )
}
