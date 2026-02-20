"use client"

import { useState, useEffect } from "react"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { ProcessAssociations } from "./ProcessAssociations"
import type { Activity, EditTab, Process, StatusName } from "./types"

interface EditActivityDialogProps {
  activity: Activity | null
  open: boolean
  onOpenChange: (open: boolean) => void
  processes: Process[]
  initialTab?: EditTab
  onSave: (id: number, data: Partial<Activity>) => void
  onRemoveFromProcess: (processActivityId: number, activityId: number) => void
  onAddToProcess: (activityId: number, processId: number) => void
}

const STATUS_OPTIONS: { id: number; name: StatusName }[] = [
  { id: 1, name: "Active" },
  { id: 2, name: "Inactive" },
]

export function EditActivityDialog({
  activity,
  open,
  onOpenChange,
  processes,
  initialTab = "details",
  onSave,
  onRemoveFromProcess,
  onAddToProcess,
}: EditActivityDialogProps) {
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [statusId, setStatusId] = useState<number>(1)
  const [activeTab, setActiveTab] = useState<EditTab>(initialTab)

  useEffect(() => {
    if (activity) {
      setName(activity.Activity_Name ?? "")
      setDescription(activity.Activity_Description ?? "")
      setStatusId(activity.Status_ID)
    }
  }, [activity])

  useEffect(() => {
    setActiveTab(initialTab)
  }, [initialTab, open])

  if (!activity) return null

  const activeProcessLinks = activity.ProcessLinks.filter((l) => l.Status_Name === "Active")

  const isDirty =
    name !== activity.Activity_Name ||
    description !== (activity.Activity_Description ?? "") ||
    statusId !== activity.Status_ID

  const handleSave = () => {
    onSave(activity.Activity_ID, {
      Activity_Name: name,
      Activity_Description: description || undefined,
      Status_ID: statusId,
    })
    onOpenChange(false)
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Edit Activity</DialogTitle>
          <DialogDescription>
            Update details or manage process assignments.
          </DialogDescription>
        </DialogHeader>

        <Tabs
          value={activeTab}
          onValueChange={(v) => setActiveTab(v as EditTab)}
          className="mt-1"
        >
          <TabsList className="w-full">
            <TabsTrigger value="details" className="flex-1">
              Details
            </TabsTrigger>
            <TabsTrigger value="processes" className="flex-1">
              Processes
              {activeProcessLinks.length > 0 && (
                <span className="ml-1.5 h-4 min-w-[1rem] rounded-full bg-primary/10 text-primary text-[10px] font-semibold inline-flex items-center justify-center px-1">
                  {activeProcessLinks.length}
                </span>
              )}
            </TabsTrigger>
          </TabsList>

          {/* Details Tab */}
          <TabsContent value="details" className="mt-4 space-y-4">
            <div className="grid gap-2">
              <Label htmlFor="edit-name">
                Activity Name <span className="text-red-500">*</span>
              </Label>
              <Input
                id="edit-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Activity name..."
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="edit-desc">
                Description{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </Label>
              <Textarea
                id="edit-desc"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Additional instructions or notes..."
                rows={3}
              />
            </div>

            <div className="grid gap-2">
              <Label>Status</Label>
              <Select
                value={String(statusId)}
                onValueChange={(v) => setStatusId(parseInt(v))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {STATUS_OPTIONS.map((s) => (
                    <SelectItem key={s.id} value={String(s.id)}>
                      {s.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          {/* Processes Tab */}
          <TabsContent value="processes" className="mt-4">
            <ProcessAssociations
              activity={activity}
              processes={processes}
              onRemove={onRemoveFromProcess}
              onAdd={onAddToProcess}
            />
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            {activeTab === "processes" || !isDirty ? "Close" : "Cancel"}
          </Button>
          {activeTab === "details" && isDirty && (
            <Button onClick={handleSave} disabled={!name.trim()}>
              Save Changes
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
