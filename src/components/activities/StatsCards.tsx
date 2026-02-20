import { Card, CardContent } from "@/components/ui/card"
import { ActivityIcon, AlertCircle, CheckCircle2 } from "lucide-react"

interface StatsCardsProps {
  totalActive: number
  totalInactive: number
  totalProcesses: number
}

interface StatCardProps {
  label: string
  value: number
  icon: React.ReactNode
  iconBg: string
  borderColor: string
}

function StatCard({ label, value, icon, iconBg, borderColor }: StatCardProps) {
  return (
    <Card className={`border-l-4 ${borderColor}`}>
      <CardContent className="pt-5 pb-4">
        <div className="flex items-center justify-between">
          <div className="space-y-1">
            <p className="text-sm font-medium text-muted-foreground">{label}</p>
            <p className="text-3xl font-bold tracking-tight">{value}</p>
          </div>
          <div className={`h-11 w-11 rounded-lg flex items-center justify-center ${iconBg}`}>
            {icon}
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export function StatsCards({ totalActive, totalInactive, totalProcesses }: StatsCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      <StatCard
        label="Active Activities"
        value={totalActive}
        icon={<CheckCircle2 className="h-5 w-5 text-emerald-600" />}
        iconBg="bg-emerald-50"
        borderColor="border-l-emerald-500"
      />
      <StatCard
        label="Inactive Activities"
        value={totalInactive}
        icon={<AlertCircle className="h-5 w-5 text-amber-500" />}
        iconBg="bg-amber-50"
        borderColor="border-l-amber-400"
      />
      <StatCard
        label="Processes"
        value={totalProcesses}
        icon={<ActivityIcon className="h-5 w-5 text-indigo-600" />}
        iconBg="bg-indigo-50"
        borderColor="border-l-indigo-500"
      />
    </div>
  )
}
