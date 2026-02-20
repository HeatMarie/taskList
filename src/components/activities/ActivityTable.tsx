import {
  Table,
  TableBody,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table"
import { ActivityTableRow } from "./ActivityTableRow"
import { EmptyState } from "./EmptyState"
import type { Activity } from "./types"

interface ActivityTableProps {
  activities: Activity[]
  hasFilters: boolean
  onEdit: (activity: Activity) => void
  onManageProcesses: (activity: Activity) => void
  onToggleStatus: (activity: Activity) => void
  onDelete: (activity: Activity) => void
  onAdd: () => void
}

export function ActivityTable({
  activities,
  hasFilters,
  onEdit,
  onManageProcesses,
  onToggleStatus,
  onDelete,
  onAdd,
}: ActivityTableProps) {
  return (
    <>
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead className="w-[38%]">Activity</TableHead>
            <TableHead className="w-[27%] hidden md:table-cell">Description</TableHead>
            <TableHead>Processes</TableHead>
            <TableHead className="text-center w-[90px]">Active</TableHead>
            <TableHead className="w-[52px]" />
          </TableRow>
        </TableHeader>
        <TableBody>
          {activities.map((activity) => (
            <ActivityTableRow
              key={activity.Activity_ID}
              activity={activity}
              onEdit={onEdit}
              onManageProcesses={onManageProcesses}
              onToggleStatus={onToggleStatus}
              onDelete={onDelete}
            />
          ))}
        </TableBody>
      </Table>

      {activities.length === 0 && (
        <EmptyState hasFilters={hasFilters} onAdd={onAdd} />
      )}

      {activities.length > 0 && (
        <p className="text-xs text-muted-foreground mt-3 px-1">
          {activities.length} activit{activities.length === 1 ? "y" : "ies"}
        </p>
      )}
    </>
  )
}
