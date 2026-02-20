import type { Activity, SimilarActivity } from "./types"

export function simulateSimilaritySearch(
  name: string,
  activities: Activity[]
): SimilarActivity[] {
  if (name.length < 4) return []
  const lower = name.toLowerCase()
  const words = lower.split(" ").filter((w) => w.length > 3)

  return activities
    .filter((a) => a.Status_Name !== "Deleted")
    .map((a) => {
      const aLower = a.Activity_Name?.toLowerCase() ?? ""
      let score = 0
      words.forEach((word) => {
        if (aLower.includes(word)) score += 0.3
      })
      if (aLower.includes(lower)) score += 0.5
      return { ...a, similarity: Math.min(score, 1) }
    })
    .filter((a) => a.similarity > 0.25)
    .sort((a, b) => b.similarity - a.similarity)
    .slice(0, 4)
}

/** Returns a Tailwind class string for a given process name. */
export function getProcessColor(processName: string): string {
  const name = processName.toLowerCase()
  if (name.includes("dewinter") || name.includes("de-winter")) {
    return "bg-green-50 text-green-700 border-green-200"
  }
  if (name.includes("winter")) {
    return "bg-blue-50 text-blue-700 border-blue-200"
  }
  return "bg-purple-50 text-purple-700 border-purple-200"
}

export function filterActivities(
  activities: Activity[],
  {
    searchQuery,
    processFilter,
    statusFilter,
  }: {
    searchQuery: string
    processFilter: string
    statusFilter: string
  }
): Activity[] {
  return activities.filter((a) => {
    if (a.Status_Name === "Deleted") return false
    if (statusFilter === "active" && a.Status_Name !== "Active") return false
    if (statusFilter === "inactive" && a.Status_Name !== "Inactive") return false

    if (processFilter !== "all") {
      const pid = parseInt(processFilter)
      const hasProcess = a.ProcessLinks.some(
        (l) => l.Process_ID === pid && l.Status_Name === "Active"
      )
      if (!hasProcess) return false
    }

    if (searchQuery) {
      const q = searchQuery.toLowerCase()
      return (
        a.Activity_Name?.toLowerCase().includes(q) ||
        a.Activity_Description?.toLowerCase().includes(q) ||
        a.ProcessLinks.some((l) => l.Process_Name.toLowerCase().includes(q))
      )
    }

    return true
  })
}
