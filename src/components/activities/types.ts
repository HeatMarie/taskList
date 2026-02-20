import type { Prisma } from "@prisma/client"
export type { Process } from "@prisma/client"

export type StatusName = "Active" | "Inactive" | "Deleted"

export type Activity = Prisma.ActivityGetPayload<{
  include: {
    Status_Code: true
    Process_Activities: {
      include: {
        Process: true
        Room: true
        Status_Code: true
      }
    }
  }
}>

// A single Process_Activity row with its nested includes
export type ProcessLink = Activity["Process_Activities"][number]

export type SimilarActivity = Activity & { similarity: number }

export type EditTab = "details" | "processes"
