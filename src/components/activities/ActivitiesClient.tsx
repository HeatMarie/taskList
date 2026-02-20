"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Plus } from "lucide-react"
import { filterActivities } from "@/components/activities/activity-utils"
import { StatsCards } from "@/components/activities/StatsCards"
import { ActivityFilters } from "@/components/activities/ActivityFilters"
import { ActivityTable } from "@/components/activities/ActivityTable"
import { AddActivityDialog } from "@/components/activities/AddActivityDialog"
import { EditActivityDialog } from "@/components/activities/EditActivityDialog"
import { DeleteActivityDialog } from "@/components/activities/DeleteActivityDialog"
import type { Activity, EditTab, Process, ProcessLink, StatusName } from "@/components/activities/types"

interface ActivitiesClientProps {
  initialActivities: Activity[]
  processes: Process[]
}

export function ActivitiesClient({ initialActivities, processes }: ActivitiesClientProps) {
  const [activities, setActivities] = useState<Activity[]>(initialActivities)

  // Filter state
  const [searchQuery, setSearchQuery] = useState("")
  const [processFilter, setProcessFilter] = useState("all")
  const [statusFilter, setStatusFilter] = useState("active")

  // Dialog state
  const [addDialogOpen, setAddDialogOpen] = useState(false)
  const [editActivity, setEditActivity] = useState<Activity | null>(null)
  const [editTab, setEditTab] = useState<EditTab>("details")
  const [deleteTarget, setDeleteTarget] = useState<Activity | null>(null)

  // ── Derived ──────────────────────────────────────────────────────────────────

  const filteredActivities = filterActivities(activities, {
    searchQuery,
    processFilter,
    statusFilter,
  })

  const totalActive = activities.filter((a) => a.Status_Name === "Active").length
  const totalInactive = activities.filter((a) => a.Status_Name === "Inactive").length
  const hasFilters = !!(searchQuery || processFilter !== "all" || statusFilter !== "active")

  // ── Dialog helpers ────────────────────────────────────────────────────────────

  const openEditDialog = (activity: Activity, tab: EditTab = "details") => {
    setEditActivity(activity)
    setEditTab(tab)
  }

  // ── Handlers ─────────────────────────────────────────────────────────────────

  const handleAdd = ({
    name,
    description,
    processLinks,
  }: {
    name: string
    description: string
    processLinks: Array<{ processId: number; roomId: number }>
  }) => {
    const process = processLinks[0]
      ? processes.find((p) => p.Process_ID === processLinks[0].processId)
      : undefined

    const newActivity: Activity = {
      Activity_ID: Date.now(),
      Activity_Name: name,
      Activity_Description: description || undefined,
      Status_ID: 1,
      Status_Name: "Active",
      ProcessLinks: process
        ? [
            {
              Process_Activity_ID: Date.now() + 1,
              Process_ID: process.Process_ID,
              Process_Name: process.Process_Name,
              Room_ID: 1,
              Room_Name: "TBD",
              Status_Name: "Active",
            },
          ]
        : [],
    }
    setActivities((prev) => [newActivity, ...prev])
  }

  const handleSave = (id: number, data: Partial<Activity>) => {
    setActivities((prev) =>
      prev.map((a) => {
        if (a.Activity_ID !== id) return a
        const newStatusId = data.Status_ID ?? a.Status_ID
        const newStatusName: StatusName =
          newStatusId === 1 ? "Active" : newStatusId === 2 ? "Inactive" : a.Status_Name
        return {
          ...a,
          Activity_Name: data.Activity_Name ?? a.Activity_Name,
          Activity_Description: data.Activity_Description,
          Status_ID: newStatusId,
          Status_Name: newStatusName,
        }
      })
    )
  }

  const handleSoftDelete = (activity: Activity) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.Activity_ID === activity.Activity_ID
          ? { ...a, Status_ID: 3, Status_Name: "Deleted" }
          : a
      )
    )
    setDeleteTarget(null)
  }

  const handleRemoveFromProcess = (processActivityId: number, activityId: number) => {
    const updateLinks = (links: ProcessLink[]) =>
      links.map((l) =>
        l.Process_Activity_ID === processActivityId
          ? { ...l, Status_Name: "Deleted" as StatusName }
          : l
      )

    setActivities((prev) =>
      prev.map((a) =>
        a.Activity_ID === activityId ? { ...a, ProcessLinks: updateLinks(a.ProcessLinks) } : a
      )
    )
    setEditActivity((prev) =>
      prev?.Activity_ID === activityId
        ? { ...prev, ProcessLinks: updateLinks(prev.ProcessLinks) }
        : prev
    )
  }

  const handleAddToProcess = (activityId: number, processId: number) => {
    const process = processes.find((p) => p.Process_ID === processId)
    if (!process) return

    const newLink: ProcessLink = {
      Process_Activity_ID: Date.now(),
      Process_ID: processId,
      Process_Name: process.Process_Name,
      Room_ID: 1,
      Room_Name: "TBD",
      Status_Name: "Active",
    }

    setActivities((prev) =>
      prev.map((a) =>
        a.Activity_ID === activityId
          ? { ...a, ProcessLinks: [...a.ProcessLinks, newLink] }
          : a
      )
    )
    setEditActivity((prev) =>
      prev?.Activity_ID === activityId
        ? { ...prev, ProcessLinks: [...prev.ProcessLinks, newLink] }
        : prev
    )
  }

  const handleToggleStatus = (activity: Activity) => {
    const newStatus: StatusName = activity.Status_Name === "Active" ? "Inactive" : "Active"
    const newId = newStatus === "Active" ? 1 : 2
    setActivities((prev) =>
      prev.map((a) =>
        a.Activity_ID === activity.Activity_ID
          ? { ...a, Status_ID: newId, Status_Name: newStatus }
          : a
      )
    )
  }

  // ── Render ────────────────────────────────────────────────────────────────────

  return (
    <div className="container max-w-6xl mx-auto px-4 py-8 space-y-6">
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Activities</h1>
          <p className="text-sm text-muted-foreground mt-0.5">
            Manage reusable activity templates and process assignments
          </p>
        </div>
        <Button onClick={() => setAddDialogOpen(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Activity
        </Button>
      </div>

      {/* Stats */}
      <StatsCards
        totalActive={totalActive}
        totalInactive={totalInactive}
        totalProcesses={processes.length}
      />

      {/* Table Card */}
      <Card>
        <CardHeader className="pb-3">
          <ActivityFilters
            searchQuery={searchQuery}
            processFilter={processFilter}
            statusFilter={statusFilter}
            processes={processes}
            onSearchChange={setSearchQuery}
            onProcessChange={setProcessFilter}
            onStatusChange={setStatusFilter}
            onClear={() => {
              setSearchQuery("")
              setProcessFilter("all")
              setStatusFilter("active")
            }}
          />
        </CardHeader>
        <CardContent>
          <ActivityTable
            activities={filteredActivities}
            hasFilters={hasFilters}
            onEdit={(a) => openEditDialog(a, "details")}
            onManageProcesses={(a) => openEditDialog(a, "processes")}
            onToggleStatus={handleToggleStatus}
            onDelete={setDeleteTarget}
            onAdd={() => setAddDialogOpen(true)}
          />
        </CardContent>
      </Card>

      {/* Dialogs */}
      <AddActivityDialog
        open={addDialogOpen}
        onOpenChange={setAddDialogOpen}
        activities={activities}
        processes={processes}
        onAdd={handleAdd}
      />

      <EditActivityDialog
        activity={editActivity}
        open={!!editActivity}
        onOpenChange={(open) => {
          if (!open) setEditActivity(null)
        }}
        processes={processes}
        initialTab={editTab}
        onSave={handleSave}
        onRemoveFromProcess={handleRemoveFromProcess}
        onAddToProcess={handleAddToProcess}
      />

      <DeleteActivityDialog
        activity={deleteTarget}
        onOpenChange={(open) => {
          if (!open) setDeleteTarget(null)
        }}
        onConfirm={handleSoftDelete}
      />
    </div>
  )
}
