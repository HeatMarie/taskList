import { prisma } from "@/lib/prisma"
import { ActivitiesClient } from "@/components/activities/ActivitiesClient"
import type { Activity, Process, StatusName } from "@/components/activities/types"

export default async function ActivitiesPage() {
  const [prismaActivities, prismaProcesses] = await Promise.all([
    prisma.activity.findMany({
      include: {
        Status_Code: true,
        Process_Activities: {
          include: {
            Process: true,
            Room: true,
            Status_Code: true,
          },
        },
      },
      orderBy: { Activity_ID: "asc" },
    }),
    prisma.process.findMany({
      orderBy: { Process_ID: "asc" },
    }),
  ])

  const activities: Activity[] = prismaActivities.map((a) => ({
    Activity_ID: a.Activity_ID,
    Activity_Name: a.Activity_Name ?? "",
    Activity_Description: a.Activity_Description ?? undefined,
    Status_ID: a.Status_ID,
    Status_Name: a.Status_Code.Status_Name as StatusName,
    ProcessLinks: a.Process_Activities.map((pa) => ({
      Process_Activity_ID: pa.Process_Activity_ID,
      Process_ID: pa.Process_ID,
      Process_Name: pa.Process.Process_Name,
      Room_ID: pa.Room_ID,
      Room_Name: pa.Room.Room_Name,
      Process_Order: pa.Process_Order ?? undefined,
      Status_Name: pa.Status_Code.Status_Name as StatusName,
    })),
  }))

  const processes: Process[] = prismaProcesses.map((p) => ({
    Process_ID: p.Process_ID,
    Process_Name: p.Process_Name,
    Process_Description: p.Process_Description ?? undefined,
  }))

  return <ActivitiesClient initialActivities={activities} processes={processes} />
}
