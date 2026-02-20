import { Button } from "@/components/ui/button"
import { ClipboardList, Plus } from "lucide-react"

interface EmptyStateProps {
  hasFilters: boolean
  onAdd: () => void
}

export function EmptyState({ hasFilters, onAdd }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center py-16 text-center">
      <div className="h-16 w-16 rounded-full bg-muted flex items-center justify-center mb-4">
        <ClipboardList className="h-8 w-8 text-muted-foreground" />
      </div>
      <h3 className="text-base font-semibold mb-1.5">
        {hasFilters ? "No matching activities" : "No activities yet"}
      </h3>
      <p className="text-sm text-muted-foreground max-w-xs mb-6">
        {hasFilters
          ? "Try adjusting your search terms or clearing the active filters."
          : "Get started by adding your first activity to the system."}
      </p>
      {!hasFilters && (
        <Button onClick={onAdd}>
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      )}
    </div>
  )
}
