// src/views/pages/Dashboard.tsx
import { useEffect, useState } from 'react'
import { Bar, Line, Pie } from 'react-chartjs-2'

import {
  dashboardMetrics as staticMetrics,
  initialDashboardFilters,
  lineChartOptions,
  periodOptions,
  pieOptions,
  stackedBarOptions,
  verticalBarOptions,
  type DashboardFiltersState,
} from '@/app/config/dashboard'
import {
  getConsumo,
  getQuilometragem,
  getResumo,
  getStatus,
  getVeiculos,
  getRelatorios, // Importando a função atualizada do seu painel-service
} from '@/app/services/painel-service'
import { DashboardFilterBar } from '@/views/components/dashboard/dashboard-filter-bar'
import { DashboardMetricCard } from '@/views/components/dashboard/dashboard-metric-card'
import { DashboardShellCard } from '@/views/components/dashboard/dashboard-shell-card'

interface VeiculoFiltroDTO { id: number; nome: string }
interface ConsumoMensalDTO { mes: string; valorConsumo: number }
interface QuilometragemDTO { mes: string; kmEmpresa: number; kmTerceirizados: number }
interface StatusFrotaDTO { operando: number; manutencao: number; parados: number; percentualDisponibilidade: number }
interface ResumoPainelDTO { custoMedioPorKm: number; kmTotal: number; viagensRealizadas: number }

const palette = {
  primary: '#1e293b',
  medium: '#3b82f6',
  light: '#93c5fd',
}

export default function Dashboard() {
  const [filters, setFilters] = useState<DashboardFiltersState>(initialDashboardFilters)

  const [vehicleOptions, setVehicleOptions] = useState([{ value: 'all', label: 'Todos os veículos' }])

  const [resumo, setResumo] = useState<ResumoPainelDTO>({ custoMedioPorKm: 0, kmTotal: 0, viagensRealizadas: 0 })
  const [consumo, setConsumo] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] })
  const [postos, setPostos] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] })
  const [km, setKm] = useState<{ labels: string[]; empresa: number[]; terceirizado: number[] }>({ labels: [], empresa: [], terceirizado: [] })
  const [status, setStatus] = useState<StatusFrotaDTO>({ operando: 0, manutencao: 0, parados: 0, percentualDisponibilidade: 0 })
  const [loading, setLoading] = useState(true)

  const [chartKey, setChartKey] = useState(0)

  useEffect(() => {
    getVeiculos().then((veiculos: VeiculoFiltroDTO[]) => {
      setVehicleOptions([
        { value: 'all', label: 'Todos os veículos' },
        ...veiculos.map((v) => ({ value: String(v.id), label: v.nome })),
      ])
    })
  }, [])

  useEffect(() => {
    setLoading(true)

    const veiculoId = filters.vehicle === 'all' ? undefined : Number(filters.vehicle)
    const { dateFrom, dateTo } = filters

    Promise.all([
      getResumo({ veiculoId, dataInicio: dateFrom || undefined, dataFim: dateTo || undefined }),
      getConsumo(veiculoId),
      getQuilometragem(veiculoId),
      getStatus(veiculoId),
    ]).then(([resumoData, consumoData, kmData, statusData]: [
      ResumoPainelDTO,
      ConsumoMensalDTO[],
      QuilometragemDTO[],
      StatusFrotaDTO,
    ]) => {
      setResumo(resumoData)
      setConsumo({
        labels: consumoData.map((c) => c.mes),
        data: consumoData.map((c) => c.valorConsumo),
      })
      setPostos({ labels: [], data: [] }) // endpoint não existe no backend
      setKm({
        labels: kmData.map((k) => k.mes),
        empresa: kmData.map((k) => k.kmEmpresa),
        terceirizado: kmData.map((k) => k.kmTerceirizados),
      })
      setStatus(statusData)
      setLoading(false)
      setChartKey((k) => k + 1)
    })
  }, [filters.vehicle, filters.period, filters.dateFrom, filters.dateTo])

  const metrics = [
    {
      label: staticMetrics[0].label,
      value: loading ? '...' : `R$ ${resumo.custoMedioPorKm.toFixed(2).replace('.', ',')}`,
    },
    {
      label: staticMetrics[1].label,
      value: loading ? '...' : `${resumo.kmTotal.toLocaleString('pt-BR')} KM`,
    },
    {
      label: staticMetrics[2].label,
      value: loading ? '...' : String(resumo.viagensRealizadas),
    },
  ]

  const handleDateChange = (field: 'dateFrom' | 'dateTo', value: string) => {
    setFilters((current) => ({ ...current, [field]: value }))
  }

  const handlePeriodChange = (value: string) => {
    const today = new Date()
    const fmt = (d: Date) => d.toISOString().slice(0, 10)
    const daysMap: Record<string, number> = { '30d': 30, '60d': 60, '90d': 90 }
    const days = daysMap[value]
    if (days) {
      const from = new Date(today)
      from.setDate(today.getDate() - days)
      setFilters((c) => ({ ...c, period: value, dateFrom: fmt(from), dateTo: fmt(today) }))
    } else {
      setFilters((c) => ({ ...c, period: value }))
    }
  }

  // FUNÇÃO DE DOWNLOAD DE RELATÓRIO PDF
  const handleGenerateReport = async () => {
    try {
      const blob = await getRelatorios()

      // Converte a resposta binária em uma URL utilizável pelo navegador
      const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
      const link = document.createElement('a')
      link.href = url
      
      // Define o nome do arquivo baixado
      link.setAttribute('download', `certidao_${new Date().toISOString().slice(0, 10)}.pdf`)
      
      document.body.appendChild(link)
      link.click()
      
      // Remove o elemento da tela e limpa a memória cache do blob
      link.parentNode?.removeChild(link)
      window.URL.revokeObjectURL(url)
    } catch (error) {
      console.error('Erro ao baixar relatório:', error)
      window.alert('Ocorreu um erro ao gerar a certidão PDF.')
    }
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="mx-auto flex max-w-7xl flex-col space-y-6 p-6">
        <header className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div className="space-y-1">
            <h1 className="text-lg font-semibold text-slate-900">Gestão de Frota</h1>
            <p className="text-xs text-slate-400">Acompanhe indicadores e desempenho operacional da frota</p>
          </div>

          <DashboardFilterBar
            filters={filters}
            periods={periodOptions}
            vehicles={vehicleOptions}
            onPeriodChange={handlePeriodChange}
            onVehicleChange={(value) => setFilters((c) => ({ ...c, vehicle: value }))}
            onDateChange={handleDateChange}
            onGenerateReport={handleGenerateReport} // Vinculado à função de download
          />
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {metrics.map((metric) => (
            <DashboardMetricCard key={metric.label} metric={metric} />
          ))}
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DashboardShellCard
            title="Evolução do Consumo de Combustível"
            subtitle="Custo total mensal (R$)"
          >
            <div className="h-[260px] w-full">
              <Line
                key={`consumo-${chartKey}`}
                data={{
                  labels: consumo.labels,
                  datasets: [{
                    data: consumo.data,
                    borderColor: palette.primary,
                    backgroundColor: 'rgba(30, 41, 59, 0.08)',
                    fill: false,
                    tension: 0.4,
                    pointRadius: 0,
                    pointHoverRadius: 3,
                    borderWidth: 3,
                  }],
                }}
                options={lineChartOptions}
              />
            </div>
          </DashboardShellCard>

          <DashboardShellCard
            title="Postos com Melhor Preço"
            subtitle="Preço médio por litro (R$)"
          >
            <div className="h-[260px] w-full">
              <Bar
                key={`postos-${chartKey}`}
                data={{
                  labels: postos.labels,
                  datasets: [{
                    data: postos.data,
                    backgroundColor: palette.primary,
                    borderRadius: 1,
                    borderSkipped: false,
                    barThickness: 52,
                  }],
                }}
                options={verticalBarOptions}
              />
            </div>
          </DashboardShellCard>
        </section>

        <section className="grid grid-cols-1 gap-4 xl:grid-cols-2">
          <DashboardShellCard
            title="Quilometragem Percorrida"
            subtitle="Consolidado mensal por tipo de frota (KM)"
          >
            <div className="h-[260px] w-full">
              <Bar
                key={`km-${chartKey}`}
                data={{
                  labels: km.labels,
                  datasets: [
                    {
                      label: 'Frota Empresa',
                      data: km.empresa,
                      backgroundColor: palette.primary,
                      borderRadius: { topLeft: 0, topRight: 0, bottomLeft: 1, bottomRight: 1 },
                      borderSkipped: false,
                      barThickness: 38,
                      stack: 'fleet',
                    },
                    {
                      label: 'Frota Terceirizada',
                      data: km.terceirizado,
                      backgroundColor: palette.medium,
                      borderRadius: { topLeft: 1, topRight: 1, bottomLeft: 0, bottomRight: 0 },
                      borderSkipped: false,
                      barThickness: 38,
                      stack: 'fleet',
                    },
                  ],
                }}
                options={stackedBarOptions}
              />
            </div>
          </DashboardShellCard>

          <DashboardShellCard
            title="Status dos Veículos"
            subtitle="Distribuição atual da frota"
          >
            <div className="flex h-full flex-col items-center justify-center px-4 pt-2 pb-5 text-center">
              <div className="h-[220px] w-full max-w-[260px]">
                <Pie
                  key={`status-${chartKey}`}
                  data={{
                    labels: ['Operando', 'Manutenção', 'Parados'],
                    datasets: [{
                      data: [status.operando, status.manutencao, status.parados],
                      backgroundColor: [palette.primary, palette.medium, palette.light],
                      borderWidth: 0,
                      hoverOffset: 6,
                    }],
                  }}
                  options={pieOptions}
                />
              </div>
              <div className="mt-3 space-y-1">
                <p className="text-sm font-medium text-slate-700">
                  {status.operando > 0
                    ? `Frota operando com ${Math.round(status.percentualDisponibilidade)}% de disponibilidade`
                    : 'Sem dados de frota'}
                </p>
                <p className="text-xs text-slate-400">Status atual da frota de veículos</p>
              </div>
            </div>
          </DashboardShellCard>
        </section>
      </div>
    </div>
  )
}