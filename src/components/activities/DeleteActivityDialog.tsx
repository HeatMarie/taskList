import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog"
import type { Activity } from "./types"

interface DeleteActivityDialogProps {
  activity: Activity | null
  onOpenChange: (open: boolean) => void
  onConfirm: (activity: Activity) => void
}

export function DeleteActivityDialog({
  activity,
  onOpenChange,
  onConfirm,
}: DeleteActivityDialogProps) {
  return (
    <AlertDialog
      open={!!activity}
      onOpenChange={(open) => {
        if (!open) onOpenChange(false)
      }}
    >
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Delete Activity?</AlertDialogTitle>
          <AlertDialogDescription>
            <span className="font-semibold text-foreground">
              &ldquo;{activity?.Activity_Name}&rdquo;
            </span>{" "}
            will be soft-deleted and hidden from all views. Historical logs will not be
            affected. Contact your database administrator to restore it if needed.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel>Cancel</AlertDialogCancel>
          <AlertDialogAction
            className="bg-red-600 hover:bg-red-700 focus-visible:ring-red-600"
            onClick={() => activity && onConfirm(activity)}
          >
            Delete Activity
          </AlertDialogAction>
        </AlertDialogFooter>
      </AlertDialogContent>
    </AlertDialog>
  )
}
