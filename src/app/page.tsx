import { prisma } from "@/lib/prisma"
import { ActivitiesClient } from "@/components/activities/ActivitiesClient"

export default async function ActivitiesPage() {
  const [activities, processes] = await Promise.all([
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

  return <ActivitiesClient initialActivities={activities} processes={processes} />
}
