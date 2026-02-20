"use client"

import { useState } from "react"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Link2Off, Plus } from "lucide-react"
import { cn } from "@/lib/utils"
import { getProcessColor } from "./activity-utils"
import type { Activity, Process, ProcessLink } from "./types"

interface ProcessAssociationsProps {
  activity: Activity
  processes: Process[]
  onRemove: (processActivityId: number, activityId: number) => void
  onAdd: (activityId: number, processId: number) => void
}

export function ProcessAssociations({
  activity,
  processes,
  onRemove,
  onAdd,
}: ProcessAssociationsProps) {
  const [addProcessId, setAddProcessId] = useState("")

  const activeLinks = activity.Process_Activities.filter((l) => l.Status_Code.Status_Name === "Active")
  const linkedProcessIds = new Set(activeLinks.map((l) => l.Process_ID))
  const availableProcesses = processes.filter((p) => !linkedProcessIds.has(p.Process_ID))

  const handleAdd = () => {
    if (!addProcessId || addProcessId === "none") return
    onAdd(activity.Activity_ID, parseInt(addProcessId))
    setAddProcessId("")
  }

  return (
    <div className="space-y-3">
      {activeLinks.length === 0 ? (
        <div className="text-center py-4 text-sm text-muted-foreground rounded-md border bg-muted/30">
          Not linked to any process yet.
        </div>
      ) : (
        <div className="space-y-2">
          {activeLinks.map((link) => (
            <ProcessLinkRow
              key={link.Process_Activity_ID}
              link={link}
              onRemove={() => onRemove(link.Process_Activity_ID, activity.Activity_ID)}
            />
          ))}
        </div>
      )}

      {availableProcesses.length > 0 && (
        <div className="flex gap-2 pt-1">
          <Select value={addProcessId} onValueChange={setAddProcessId}>
            <SelectTrigger className="flex-1">
              <SelectValue placeholder="Add to a process..." />
            </SelectTrigger>
            <SelectContent>
              {availableProcesses.map((p) => (
                <SelectItem key={p.Process_ID} value={String(p.Process_ID)}>
                  {p.Process_Name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button
            variant="outline"
            size="icon"
            onClick={handleAdd}
            disabled={!addProcessId || addProcessId === "none"}
            title="Add to selected process"
          >
            <Plus className="h-4 w-4" />
          </Button>
        </div>
      )}
    </div>
  )
}

function ProcessLinkRow({
  link,
  onRemove,
}: {
  link: ProcessLink
  onRemove: () => void
}) {
  return (
    <div className="flex items-center justify-between rounded-md border px-3 py-2.5 bg-muted/30">
      <div className="flex items-center gap-2 min-w-0">
        <Badge
          variant="outline"
          className={cn("text-xs font-medium shrink-0", getProcessColor(link.Process.Process_Name))}
        >
          {link.Process.Process_Name}
        </Badge>
        {link.Room.Room_Name && (
          <span className="text-xs text-muted-foreground truncate">
            {link.Room.Room_Name}
            {link.Process_Order != null && ` · Step ${link.Process_Order}`}
          </span>
        )}
      </div>
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 ml-2 text-muted-foreground hover:text-red-600 shrink-0"
        onClick={onRemove}
        title="Remove from this process"
      >
        <Link2Off className="h-3.5 w-3.5" />
      </Button>
    </div>
  )
}
