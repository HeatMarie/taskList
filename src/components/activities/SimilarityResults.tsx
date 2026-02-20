import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"
import { AlertCircle, CheckCircle2 } from "lucide-react"
import { cn } from "@/lib/utils"
import type { SimilarActivity } from "./types"

interface SimilarityResultsProps {
  results: SimilarActivity[]
  onSelectExisting: (activity: SimilarActivity) => void
  onProceedNew: () => void
}

export function SimilarityResults({
  results,
  onSelectExisting,
  onProceedNew,
}: SimilarityResultsProps) {
  if (results.length === 0) {
    return (
      <div className="rounded-lg border border-emerald-200 bg-emerald-50 px-3 py-2.5 flex items-center gap-2.5">
        <CheckCircle2 className="h-4 w-4 text-emerald-600 flex-shrink-0" />
        <p className="text-sm text-emerald-700 font-medium">
          No similar activities found — safe to create a new one.
        </p>
      </div>
    )
  }

  return (
    <div className="rounded-lg border border-amber-200 bg-amber-50/60 p-3 space-y-2.5">
      <div className="flex items-center gap-2 text-amber-700">
        <AlertCircle className="h-4 w-4 flex-shrink-0" />
        <p className="text-sm font-medium">
          Similar activities found — is one of these what you need?
        </p>
      </div>

      <div className="space-y-1.5">
        {results.map((a) => {
          const pct = Math.round(a.similarity * 100)
          return (
            <button
              key={a.Activity_ID}
              className="w-full text-left rounded-md border bg-background px-3 py-2.5 hover:bg-accent transition-colors group"
              onClick={() => onSelectExisting(a)}
            >
              <div className="flex items-start justify-between gap-3">
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium leading-snug group-hover:text-primary transition-colors truncate">
                    {a.Activity_Name}
                  </p>
                  {a.Activity_Description && (
                    <p className="text-xs text-muted-foreground mt-0.5 line-clamp-1">
                      {a.Activity_Description}
                    </p>
                  )}
                </div>
                <div className="flex-shrink-0 text-right min-w-[3rem]">
                  <span
                    className={cn(
                      "text-xs font-semibold",
                      pct >= 70 ? "text-amber-600" : "text-muted-foreground"
                    )}
                  >
                    {pct}%
                  </span>
                  <div className="w-12 h-1.5 rounded-full bg-muted mt-1 overflow-hidden">
                    <div
                      className={cn(
                        "h-full rounded-full transition-all",
                        pct >= 70 ? "bg-amber-400" : "bg-amber-300"
                      )}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              </div>
            </button>
          )
        })}
      </div>

      <Separator className="bg-amber-200" />

      <Button variant="outline" size="sm" className="w-full" onClick={onProceedNew}>
        None of these — create a new activity
      </Button>
    </div>
  )
}
