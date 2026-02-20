"use client"

import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { TableCell, TableRow } from "@/components/ui/table"
import { AlertCircle, CheckCircle2, Edit, Link2, MoreVertical, Trash2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { ProcessBadges } from "./ProcessBadges"
import type { Activity } from "./types"

interface ActivityTableRowProps {
  activity: Activity
  onEdit: (activity: Activity) => void
  onManageProcesses: (activity: Activity) => void
  onToggleStatus: (activity: Activity) => void
  onDelete: (activity: Activity) => void
}

export function ActivityTableRow({
  activity,
  onEdit,
  onManageProcesses,
  onToggleStatus,
  onDelete,
}: ActivityTableRowProps) {
  const isActive = activity.Status_Name === "Active"

  return (
    <TableRow className={cn(!isActive && "opacity-60")}>
      {/* Name */}
      <TableCell>
        <div className="flex items-start gap-2">
          {isActive ? (
            <CheckCircle2 className="h-4 w-4 text-emerald-500 mt-0.5 flex-shrink-0" />
          ) : (
            <AlertCircle className="h-4 w-4 text-amber-400 mt-0.5 flex-shrink-0" />
          )}
          <div>
            <p className="font-medium leading-snug">{activity.Activity_Name}</p>
            {/* Description visible on mobile (column is hidden) */}
            {activity.Activity_Description && (
              <p className="text-xs text-muted-foreground mt-0.5 md:hidden line-clamp-1">
                {activity.Activity_Description}
              </p>
            )}
          </div>
        </div>
      </TableCell>

      {/* Description — hidden on mobile */}
      <TableCell className="hidden md:table-cell">
        {activity.Activity_Description ? (
          <p className="text-sm text-muted-foreground line-clamp-2 max-w-[280px]">
            {activity.Activity_Description}
          </p>
        ) : (
          <span className="text-muted-foreground select-none">—</span>
        )}
      </TableCell>

      {/* Processes */}
      <TableCell>
        <ProcessBadges links={activity.ProcessLinks} />
      </TableCell>

      {/* Active toggle */}
      <TableCell className="text-center">
        <Switch
          checked={isActive}
          onCheckedChange={() => onToggleStatus(activity)}
          className="data-[state=checked]:bg-emerald-500"
          aria-label={`${isActive ? "Deactivate" : "Activate"} ${activity.Activity_Name}`}
        />
      </TableCell>

      {/* Actions */}
      <TableCell className="text-right">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 data-[state=open]:bg-muted"
            >
              <MoreVertical className="h-4 w-4" />
              <span className="sr-only">Open actions for {activity.Activity_Name}</span>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            <DropdownMenuItem onClick={() => onEdit(activity)}>
              <Edit className="h-4 w-4 mr-2" />
              Edit Details
            </DropdownMenuItem>
            <DropdownMenuItem onClick={() => onManageProcesses(activity)}>
              <Link2 className="h-4 w-4 mr-2" />
              Manage Processes
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              className="text-red-600 focus:text-red-600"
              onClick={() => onDelete(activity)}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </TableCell>
    </TableRow>
  )
}
