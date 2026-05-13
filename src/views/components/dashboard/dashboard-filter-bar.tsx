import type { ChangeEvent } from "react"

import type { DashboardFiltersState, DashboardOption } from "@/app/config/dashboard"
import { Button } from "@/views/components/ui/button"
import { Input } from "@/views/components/ui/input"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/views/components/ui/select"

type DashboardFilterBarProps = {
  filters: DashboardFiltersState
  periods: DashboardOption[]
  vehicles: DashboardOption[]
  onPeriodChange: (value: string) => void
  onVehicleChange: (value: string) => void
  onDateChange: (field: "dateFrom" | "dateTo", value: string) => void
  onGenerateReport: () => void
}

export function DashboardFilterBar({
  filters,
  periods,
  vehicles,
  onPeriodChange,
  onVehicleChange,
  onDateChange,
  onGenerateReport,
}: DashboardFilterBarProps) {
  const handleDateChange =
    (field: "dateFrom" | "dateTo") => (event: ChangeEvent<HTMLInputElement>) => {
      onDateChange(field, event.target.value)
    }

  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end">
      <Button
        size="lg"
        className="h-9 rounded-xl bg-[#1e293b] px-4 text-xs font-medium text-white hover:bg-[#1e293b]/95"
        onClick={onGenerateReport}
      >
        Gerar Relatorio
      </Button>

      <Select value={filters.period} onValueChange={onPeriodChange}>
        <SelectTrigger
          size="default"
          className="h-9 min-w-[148px] rounded-lg border-gray-200 bg-white text-xs text-slate-500"
        >
          <SelectValue placeholder="Selecione o periodo" />
        </SelectTrigger>
        <SelectContent>
          {periods.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.vehicle} onValueChange={onVehicleChange}>
        <SelectTrigger
          size="default"
          className="h-9 min-w-[170px] rounded-lg border-gray-200 bg-white text-xs text-slate-500"
        >
          <SelectValue placeholder="Selecione o veiculo" />
        </SelectTrigger>
        <SelectContent>
          {vehicles.map((item) => (
            <SelectItem key={item.value} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <div className="grid h-9 grid-cols-2 gap-2 rounded-lg border border-gray-200 bg-white p-1 sm:min-w-[248px]">
        <Input
          type="date"
          value={filters.dateFrom}
          onChange={handleDateChange("dateFrom")}
          className="h-7 border-0 px-2 text-xs text-slate-500 shadow-none focus-visible:ring-0"
        />
        <Input
          type="date"
          value={filters.dateTo}
          onChange={handleDateChange("dateTo")}
          className="h-7 border-0 px-2 text-xs text-slate-500 shadow-none focus-visible:ring-0"
        />
      </div>
    </div>
  )
}
