// src/views/components/dashboard/dashboard-filter-bar.tsx
import type { DashboardFiltersState, DashboardOption } from '@/app/config/dashboard'
import { Button } from '@/views/components/ui/button'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/views/components/ui/select'
import { DateRangePicker } from '@/views/components/dashboard/date-range-picker'

type DashboardFilterBarProps = {
  filters: DashboardFiltersState
  periods: DashboardOption[]
  vehicles: DashboardOption[]
  onPeriodChange: (value: string) => void
  onVehicleChange: (value: string) => void
  onDateChange: (field: 'dateFrom' | 'dateTo', value: string) => void
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
  return (
    <div className="flex flex-col gap-2 sm:flex-row sm:flex-wrap sm:items-center sm:justify-end overflow-visible min-w-0">
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
          className="h-9 min-w-[148px] max-w-[148px] rounded-lg border-gray-200 bg-white text-xs text-slate-500 overflow-hidden text-ellipsis"
        >
          <SelectValue placeholder="Selecione o periodo" />
        </SelectTrigger>
        <SelectContent position="popper">
          {periods.map((item, index) => (
            <SelectItem key={`${item.value}-${index}`} value={item.value}>
              {item.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>

      <Select value={filters.vehicle} onValueChange={onVehicleChange}>
        <SelectTrigger
          size="default"
          className="h-9 min-w-[170px] max-w-[170px] rounded-lg border-gray-200 bg-white text-xs text-slate-500 overflow-hidden text-ellipsis"
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

      <DateRangePicker
        dateFrom={filters.dateFrom}
        dateTo={filters.dateTo}
        onChange={onDateChange}
      />
    </div>
  )
}