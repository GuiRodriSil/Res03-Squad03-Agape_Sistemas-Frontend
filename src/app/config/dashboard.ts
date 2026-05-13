import {
  ArcElement,
  BarElement,
  CategoryScale,
  Chart as ChartJS,
  Filler,
  Legend,
  LinearScale,
  LineElement,
  PointElement,
  Tooltip,
  type ChartData,
  type ChartOptions,
} from "chart.js"

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  ArcElement,
  Tooltip,
  Legend,
  Filler
)

const dashboardPalette = {
  primary: "#1e293b",
  medium: "#3b82f6",
  light: "#93c5fd",
  tooltip: "#0f172a",
  axis: "#94a3b8",
  legend: "#64748b",
  grid: "#e5e7eb",
} as const

export type DashboardFiltersState = {
  period: string
  vehicle: string
  dateFrom: string
  dateTo: string
}

export type DashboardOption = {
  value: string
  label: string
}

export type DashboardMetric = {
  label: string
  value: string
}

export const initialDashboardFilters: DashboardFiltersState = {
  period: "30d",
  vehicle: "all",
  dateFrom: "2026-03-01",
  dateTo: "2026-03-30",
}

export const periodOptions: DashboardOption[] = [
  { value: "all", label: "Selecione o periodo" },
  { value: "30d", label: "Ultimos 30 dias" },
  { value: "60d", label: "Ultimos 60 dias" },
  { value: "90d", label: "Ultimos 90 dias" },
]

export const vehicleOptions: DashboardOption[] = [
  { value: "all", label: "Selecione o veiculo" },
  { value: "v1", label: "Truck 01" },
  { value: "v2", label: "Truck 02" },
  { value: "v3", label: "Truck 03" },
]

export const dashboardMetrics: DashboardMetric[] = [
  { label: "Custo medio por KM", value: "R$ 0,00" },
  { label: "Quilometragem total", value: "0 KM" },
  { label: "Viagens realizadas no mes", value: "0" },
]

export const lineChartOptions: ChartOptions<"line"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: dashboardPalette.tooltip,
      displayColors: false,
      padding: 10,
    },
  },
  scales: {
    x: {
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        color: dashboardPalette.axis,
        font: {
          size: 11,
        },
      },
    },
    y: {
      beginAtZero: true,
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        color: dashboardPalette.axis,
        font: {
          size: 11,
        },
      },
    },
  },
}

export const verticalBarOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: dashboardPalette.tooltip,
      padding: 10,
    },
  },
  scales: {
    x: {
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        color: dashboardPalette.axis,
        font: {
          size: 11,
        },
      },
    },
    y: {
      beginAtZero: true,
      border: {
        display: false,
      },
      grid: {
        color: dashboardPalette.grid,
      },
      ticks: {
        color: dashboardPalette.axis,
        font: {
          size: 11,
        },
      },
    },
  },
}

export const stackedBarOptions: ChartOptions<"bar"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: true,
      position: "bottom",
      labels: {
        boxWidth: 10,
        boxHeight: 10,
        color: dashboardPalette.legend,
        font: {
          size: 11,
        },
        padding: 18,
        usePointStyle: true,
        pointStyle: "rectRounded",
      },
    },
    tooltip: {
      backgroundColor: dashboardPalette.tooltip,
      padding: 10,
    },
  },
  scales: {
    x: {
      stacked: true,
      border: {
        display: false,
      },
      grid: {
        display: false,
      },
      ticks: {
        color: dashboardPalette.axis,
        font: {
          size: 11,
        },
      },
    },
    y: {
      stacked: true,
      beginAtZero: true,
      border: {
        display: false,
      },
      grid: {
        color: dashboardPalette.grid,
      },
      ticks: {
        color: dashboardPalette.axis,
        font: {
          size: 11,
        },
      },
    },
  },
}

export const pieOptions: ChartOptions<"pie"> = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      display: false,
    },
    tooltip: {
      backgroundColor: dashboardPalette.tooltip,
      padding: 10,
    },
  },
}

export const fuelConsumptionData: ChartData<"line"> = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun", "Jul"],
  datasets: [
    {
      data: [10, 22, 18, 34, 28, 36, 30],
      borderColor: dashboardPalette.primary,
      backgroundColor: "rgba(30, 41, 59, 0.08)",
      fill: false,
      tension: 0.4,
      pointRadius: 0,
      pointHoverRadius: 3,
      borderWidth: 3,
    },
  ],
}

export const fuelStationsData: ChartData<"bar"> = {
  labels: ["Shell", "Ipiranga", "BR", "Ale"],
  datasets: [
    {
      data: [2.79, 4.88, 7.95, 5.04],
      backgroundColor: dashboardPalette.primary,
      borderRadius: 1,
      borderSkipped: false,
      barThickness: 52,
      categoryPercentage: 0.88,
      barPercentage: 0.98,
    },
  ],
}

export const kilometrageData: ChartData<"bar"> = {
  labels: ["Jan", "Fev", "Mar", "Abr", "Mai", "Jun","jul"],
  datasets: [
    {
      label: "Frota Empresa",
      data: [180, 220, 210, 260, 240, 280,275],
      backgroundColor: dashboardPalette.primary,
      borderRadius: {
        topLeft: 0,
        topRight: 0,
        bottomLeft: 1,
        bottomRight: 1,
      },
      borderSkipped: false,
      barThickness: 38,
      stack: "fleet",
    },
    {
      label: "Frota Terceirizada",
      data: [80, 95, 90, 110, 105, 120,180],
      backgroundColor: dashboardPalette.medium,
      borderRadius: {
        topLeft: 1,
        topRight: 1,
        bottomLeft: 0,
        bottomRight: 0,
      },
      borderSkipped: false,
      barThickness: 38,
      stack: "fleet",
    },
  ],
}

export const vehicleStatusData: ChartData<"pie"> = {
  labels: ["Operando", "Manutencao", "Parados"],
  datasets: [
    {
      data: [85, 10, 5],
      backgroundColor: [dashboardPalette.primary, dashboardPalette.medium, dashboardPalette.light],
      borderWidth: 0,
      hoverOffset: 6,
    },
  ],
}

export const vehicleStatusSummary = {
  title: "Frota operando com 85% de disponibilidade",
  description: "Status atual da frota de veiculos",
}
