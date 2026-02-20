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

// Shared placeholder Status_Code for optimistic inserts
const ACTIVE_STATUS_CODE = {
  Status_ID: 1,
  Status_Name: "Active",
  Status_Description: null,
  Is_Active: true,
  Created_Datetime: null,
  Updated_Datetime: null,
  Created_By: 0,
  Updated_By: null,
} as const

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

  const totalActive = activities.filter((a) => a.Status_Code.Status_Name === "Active").length
  const totalInactive = activities.filter((a) => a.Status_Code.Status_Name === "Inactive").length
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
      Activity_Description: description || null,
      Status_ID: 1,
      Created_Datetime: null,
      Updated_Datetime: null,
      Created_By: 0,
      Updated_By: null,
      Status_Code: ACTIVE_STATUS_CODE,
      Process_Activities: process
        ? [
            {
              Process_Activity_ID: Date.now() + 1,
              Process_ID: process.Process_ID,
              Room_ID: 1,
              Activity_ID: Date.now(),
              Status_ID: 1,
              Created_Datetime: null,
              Updated_Datetime: null,
              Created_By: 0,
              Updated_By: null,
              Process_Order: null,
              Process: {
                Process_ID: process.Process_ID,
                Process_Name: process.Process_Name,
                Process_Description: process.Process_Description ?? null,
                Status_ID: process.Status_ID,
                Created_Datetime: null,
                Updated_Datetime: null,
                Created_By: 0,
                Updated_By: null,
              },
              Room: {
                Room_ID: 1,
                Room_Name: "TBD",
                Room_Description: null,
                Room_Area: null,
                Status_ID: 1,
                Created_Datetime: null,
                Updated_Datetime: null,
                Created_By: 0,
                Updated_By: null,
              },
              Status_Code: ACTIVE_STATUS_CODE,
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
          newStatusId === 1 ? "Active" : newStatusId === 2 ? "Inactive" : a.Status_Code.Status_Name as StatusName
        return {
          ...a,
          Activity_Name: data.Activity_Name ?? a.Activity_Name,
          Activity_Description: data.Activity_Description ?? a.Activity_Description,
          Status_ID: newStatusId,
          Status_Code: { ...a.Status_Code, Status_Name: newStatusName },
        }
      })
    )
  }

  const handleSoftDelete = (activity: Activity) => {
    setActivities((prev) =>
      prev.map((a) =>
        a.Activity_ID === activity.Activity_ID
          ? { ...a, Status_ID: 3, Status_Code: { ...a.Status_Code, Status_Name: "Deleted" } }
          : a
      )
    )
    setDeleteTarget(null)
  }

  const handleRemoveFromProcess = (processActivityId: number, activityId: number) => {
    const updateLinks = (links: ProcessLink[]) =>
      links.map((l) =>
        l.Process_Activity_ID === processActivityId
          ? { ...l, Status_Code: { ...l.Status_Code, Status_Name: "Deleted" } }
          : l
      )

    setActivities((prev) =>
      prev.map((a) =>
        a.Activity_ID === activityId ? { ...a, Process_Activities: updateLinks(a.Process_Activities) } : a
      )
    )
    setEditActivity((prev) =>
      prev?.Activity_ID === activityId
        ? { ...prev, Process_Activities: updateLinks(prev.Process_Activities) }
        : prev
    )
  }

  const handleAddToProcess = (activityId: number, processId: number) => {
    const process = processes.find((p) => p.Process_ID === processId)
    if (!process) return

    const newLink: ProcessLink = {
      Process_Activity_ID: Date.now(),
      Process_ID: processId,
      Room_ID: 1,
      Activity_ID: activityId,
      Status_ID: 1,
      Created_Datetime: null,
      Updated_Datetime: null,
      Created_By: 0,
      Updated_By: null,
      Process_Order: null,
      Process: {
        Process_ID: processId,
        Process_Name: process.Process_Name,
        Process_Description: process.Process_Description ?? null,
        Status_ID: process.Status_ID,
        Created_Datetime: null,
        Updated_Datetime: null,
        Created_By: 0,
        Updated_By: null,
      },
      Room: {
        Room_ID: 1,
        Room_Name: "TBD",
        Room_Description: null,
        Room_Area: null,
        Status_ID: 1,
        Created_Datetime: null,
        Updated_Datetime: null,
        Created_By: 0,
        Updated_By: null,
      },
      Status_Code: ACTIVE_STATUS_CODE,
    }

    setActivities((prev) =>
      prev.map((a) =>
        a.Activity_ID === activityId
          ? { ...a, Process_Activities: [...a.Process_Activities, newLink] }
          : a
      )
    )
    setEditActivity((prev) =>
      prev?.Activity_ID === activityId
        ? { ...prev, Process_Activities: [...prev.Process_Activities, newLink] }
        : prev
    )
  }

  const handleToggleStatus = (activity: Activity) => {
    const newStatus: StatusName = activity.Status_Code.Status_Name === "Active" ? "Inactive" : "Active"
    const newId = newStatus === "Active" ? 1 : 2
    setActivities((prev) =>
      prev.map((a) =>
        a.Activity_ID === activity.Activity_ID
          ? { ...a, Status_ID: newId, Status_Code: { ...a.Status_Code, Status_Name: newStatus } }
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
