import type { DashboardMetric } from "@/app/config/dashboard"
import { Card, CardContent } from "@/views/components/ui/card"

type DashboardMetricCardProps = {
  metric: DashboardMetric
}

export function DashboardMetricCard({ metric }: DashboardMetricCardProps) {
  return (
    <Card className="gap-0 rounded-lg border border-gray-200 bg-white py-0 shadow-sm">
      <CardContent className="space-y-3 px-4 py-4">
        <p className="text-xs text-slate-400">{metric.label}</p>
        <p className="text-2xl font-bold tracking-tight text-slate-900">{metric.value}</p>
        <div className="h-px w-full rounded-none bg-gray-200" />
      </CardContent>
    </Card>
  )
}
