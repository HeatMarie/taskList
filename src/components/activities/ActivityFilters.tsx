"use client"

import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Search, X } from "lucide-react"
import type { Process } from "./types"

interface ActivityFiltersProps {
  searchQuery: string
  processFilter: string
  statusFilter: string
  processes: Process[]
  onSearchChange: (value: string) => void
  onProcessChange: (value: string) => void
  onStatusChange: (value: string) => void
  onClear: () => void
}

export function ActivityFilters({
  searchQuery,
  processFilter,
  statusFilter,
  processes,
  onSearchChange,
  onProcessChange,
  onStatusChange,
  onClear,
}: ActivityFiltersProps) {
  const hasActiveFilters =
    !!searchQuery || processFilter !== "all" || statusFilter !== "active"

  return (
    <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3">
      {/* Search */}
      <div className="relative w-full max-w-sm">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground pointer-events-none" />
        <Input
          placeholder="Search activities..."
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          className="pl-9 pr-9"
        />
        {searchQuery && (
          <button
            onClick={() => onSearchChange("")}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-muted-foreground hover:text-foreground transition-colors"
            aria-label="Clear search"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        )}
      </div>

      {/* Filters + clear */}
      <div className="flex flex-wrap items-center gap-2">
        <Select value={processFilter} onValueChange={onProcessChange}>
          <SelectTrigger className="w-[175px]">
            <SelectValue placeholder="All Processes" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Processes</SelectItem>
            {processes.map((p) => (
              <SelectItem key={p.Process_ID} value={String(p.Process_ID)}>
                {p.Process_Name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        <Select value={statusFilter} onValueChange={onStatusChange}>
          <SelectTrigger className="w-[138px]">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Statuses</SelectItem>
            <SelectItem value="active">Active</SelectItem>
            <SelectItem value="inactive">Inactive</SelectItem>
          </SelectContent>
        </Select>

        {hasActiveFilters && (
          <Button
            variant="ghost"
            size="sm"
            onClick={onClear}
            className="text-muted-foreground hover:text-foreground"
          >
            <X className="h-3.5 w-3.5 mr-1" />
            Clear
          </Button>
        )}
      </div>
    </div>
  )
}
