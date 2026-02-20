export type StatusName = "Active" | "Inactive" | "Deleted"

export interface Process {
  Process_ID: number
  Process_Name: string
  Process_Description?: string
}

export interface ProcessLink {
  Process_Activity_ID: number
  Process_ID: number
  Process_Name: string
  Room_ID: number
  Room_Name: string
  Process_Order?: number
  Status_Name: StatusName
}

export interface Activity {
  Activity_ID: number
  Activity_Name: string
  Activity_Description?: string
  Status_ID: number
  Status_Name: StatusName
  ProcessLinks: ProcessLink[]
}

export interface SimilarActivity {
  Activity_ID: number
  Activity_Name: string
  Activity_Description?: string
  similarity: number
}

export type EditTab = "details" | "processes"
