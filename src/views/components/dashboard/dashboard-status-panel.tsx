import { Pie } from "react-chartjs-2"

import {
  pieOptions,
  vehicleStatusData,
  vehicleStatusSummary,
} from "@/app/config/dashboard"
import { Card, CardContent, CardHeader, CardTitle } from "@/views/components/ui/card"

export function DashboardStatusPanel() {
  return (
    <Card className="gap-0 rounded-lg border border-gray-200 bg-white py-0 shadow-sm">
      <CardHeader className="items-center px-4 pt-4 pb-0 text-center">
        <CardTitle className="text-sm font-semibold text-slate-800">Status dos Veiculos</CardTitle>
      </CardHeader>
      <CardContent className="flex h-full flex-col items-center justify-center px-4 pt-2 pb-5 text-center">
        <div className="h-[300px] w-full max-w-[320px]">
          <Pie data={vehicleStatusData} options={pieOptions} />
        </div>
        <div className="mt-2 space-y-1">
          <p className="text-sm font-medium text-slate-700">{vehicleStatusSummary.title}</p>
          <p className="text-xs text-slate-400">{vehicleStatusSummary.description}</p>
        </div>
      </CardContent>
    </Card>
  )
}
