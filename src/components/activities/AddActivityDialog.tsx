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
import { Check, Info, Loader2 } from "lucide-react"
import { cn } from "@/lib/utils"
import { simulateSimilaritySearch } from "./activity-utils"
import { SimilarityResults } from "./SimilarityResults"
import type { Activity, Process, SimilarActivity } from "./types"

interface AddActivityDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  activities: Activity[]
  processes: Process[]
  onAdd: (data: {
    name: string
    description: string
    processLinks: Array<{ processId: number; roomId: number }>
  }) => void
}

type Step = "search" | "form"

function StepIndicator({ current }: { current: Step }) {
  const step1Done = current === "form"
  return (
    <div className="flex items-center gap-0 mb-2">
      <div className="flex items-center gap-2">
        <div
          className={cn(
            "h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ring-2 transition-all",
            step1Done
              ? "bg-emerald-500 text-white ring-emerald-500"
              : "bg-primary text-primary-foreground ring-primary"
          )}
        >
          {step1Done ? <Check className="h-3.5 w-3.5" /> : "1"}
        </div>
        <span
          className={cn(
            "text-xs font-medium",
            current === "search" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Name
        </span>
      </div>

      <div
        className={cn(
          "flex-1 h-px mx-3 transition-colors",
          step1Done ? "bg-emerald-400" : "bg-border"
        )}
      />

      <div className="flex items-center gap-2">
        <div
          className={cn(
            "h-6 w-6 rounded-full flex items-center justify-center text-xs font-semibold ring-2 transition-all",
            current === "form"
              ? "bg-primary text-primary-foreground ring-primary"
              : "bg-muted text-muted-foreground ring-border"
          )}
        >
          2
        </div>
        <span
          className={cn(
            "text-xs font-medium",
            current === "form" ? "text-foreground" : "text-muted-foreground"
          )}
        >
          Details
        </span>
      </div>
    </div>
  )
}

export function AddActivityDialog({
  open,
  onOpenChange,
  activities,
  processes,
  onAdd,
}: AddActivityDialogProps) {
  const [step, setStep] = useState<Step>("search")
  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [similarActivities, setSimilarActivities] = useState<SimilarActivity[]>([])
  const [isSearching, setIsSearching] = useState(false)
  const [searchDone, setSearchDone] = useState(false)
  const [selectedProcessId, setSelectedProcessId] = useState("")

  // Debounced similarity search
  useEffect(() => {
    if (name.length < 4) {
      setSimilarActivities([])
      setSearchDone(false)
      return
    }
    setIsSearching(true)
    const timer = setTimeout(() => {
      const results = simulateSimilaritySearch(name, activities)
      setSimilarActivities(results)
      setIsSearching(false)
      setSearchDone(true)
    }, 500)
    return () => clearTimeout(timer)
  }, [name, activities])

  const reset = () => {
    setStep("search")
    setName("")
    setDescription("")
    setSimilarActivities([])
    setSearchDone(false)
    setSelectedProcessId("")
  }

  const handleClose = () => {
    onOpenChange(false)
    setTimeout(reset, 300)
  }

  const handleSubmit = () => {
    const links =
      selectedProcessId && selectedProcessId !== "none"
        ? [{ processId: parseInt(selectedProcessId), roomId: 1 }]
        : []
    onAdd({ name, description, processLinks: links })
    handleClose()
  }

  const handleSelectExisting = (activity: SimilarActivity) => {
    // In a real app: close this dialog and open edit dialog for the existing activity
    alert(`Would open edit dialog for: ${activity.Activity_Name}`)
  }

  return (
    <Dialog open={open} onOpenChange={handleClose}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle>Add New Activity</DialogTitle>
          <DialogDescription>
            Activities are reusable steps that can be assigned to multiple processes.
          </DialogDescription>
        </DialogHeader>

        <StepIndicator current={step} />

        <div className="grid gap-4 py-1">
          {/* Step 1: Name */}
          <div className="grid gap-2">
            <Label htmlFor="activity-name">
              Activity Name <span className="text-red-500">*</span>
            </Label>
            <div className="relative">
              <Input
                id="activity-name"
                value={name}
                onChange={(e) => {
                  setName(e.target.value)
                  if (step === "form") setStep("search")
                }}
                placeholder="e.g., Drain all water supply lines"
                autoFocus
              />
              {isSearching && (
                <Loader2 className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 animate-spin text-muted-foreground" />
              )}
            </div>
          </div>

          {/* Similarity results */}
          {searchDone && step === "search" && (
            <SimilarityResults
              results={similarActivities}
              onSelectExisting={handleSelectExisting}
              onProceedNew={() => setStep("form")}
            />
          )}

          {/* Auto-proceed button when no similarities */}
          {searchDone && step === "search" && similarActivities.length === 0 && (
            <Button onClick={() => setStep("form")}>Continue to Details</Button>
          )}

          {/* Step 2: Details form */}
          {step === "form" && (
            <>
              <div className="grid gap-2">
                <Label htmlFor="activity-desc">
                  Description{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Textarea
                  id="activity-desc"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Additional context, instructions, or notes..."
                  rows={3}
                />
              </div>

              <div className="grid gap-2">
                <Label>
                  Assign to Process{" "}
                  <span className="text-muted-foreground font-normal">(optional)</span>
                </Label>
                <Select value={selectedProcessId} onValueChange={setSelectedProcessId}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a process..." />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">No process assignment</SelectItem>
                    {processes.map((p) => (
                      <SelectItem key={p.Process_ID} value={String(p.Process_ID)}>
                        {p.Process_Name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <p className="text-xs text-muted-foreground flex items-center gap-1.5">
                  <Info className="h-3 w-3 flex-shrink-0" />
                  Process assignments can be changed at any time after creation.
                </p>
              </div>
            </>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={handleClose}>
            Cancel
          </Button>
          {step === "form" && (
            <Button onClick={handleSubmit} disabled={!name.trim()}>
              Create Activity
            </Button>
          )}
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}
