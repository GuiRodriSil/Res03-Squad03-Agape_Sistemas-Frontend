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
  type DashboardOption,
} from '@/app/config/dashboard'
import {
  getConsumo,
  getQuilometragem,
  getStatus,
  getVeiculos,
  getRelatorios,
  getIndicadores,
  getPostos,
} from '@/app/services/painel-service'
import { DashboardFilterBar } from '@/views/components/dashboard/dashboard-filter-bar'
import { DashboardMetricCard } from '@/views/components/dashboard/dashboard-metric-card'
import { DashboardShellCard } from '@/views/components/dashboard/dashboard-shell-card'

interface VeiculoFiltroDTO { id: number; nome: string }
interface StatusFrotaDTO { operando: number; manutencao: number; parados: number; percentualDisponibilidade: number }
interface ResumoPainelDTO { custoMedioPorKm: number; kmTotal: number; viagensRealizadas: number }

const palette = {
  primary: '#1e293b',
  medium: '#3b82f6',
  light: '#93c5fd',
}

export default function Dashboard() {
  const [filters, setFilters] = useState<DashboardFiltersState>(initialDashboardFilters)

  const [vehicleOptions, setVehicleOptions] = useState<DashboardOption[]>([])

  const [resumo, setResumo] = useState<ResumoPainelDTO>({ custoMedioPorKm: 0, kmTotal: 0, viagensRealizadas: 0 })
  const [consumo, setConsumo] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] })
  const [postos, setPostos] = useState<{ labels: string[]; data: number[] }>({ labels: [], data: [] })
  const [km, setKm] = useState<{ labels: string[]; empresa: number[]; terceirizado: number[] }>({ labels: [], empresa: [], terceirizado: [] })
  const [status, setStatus] = useState<StatusFrotaDTO>({ operando: 0, manutencao: 0, parados: 0, percentualDisponibilidade: 0 })
  const [loading, setLoading] = useState(true)

  const [chartKey, setChartKey] = useState(0)

  useEffect(() => {
    getVeiculos().then((veiculos: VeiculoFiltroDTO[]) => {
      const veiculosUnicos = Array.from(
        new Map(veiculos.map((v) => [v.id, v])).values()
      );

      setVehicleOptions([
        { value: 'all', label: 'Todos os veículos' },
        ...veiculosUnicos.map((v) => ({ value: String(v.id), label: v.nome })),
      ]);
    }).catch(err => console.error("Erro ao carregar veículos do filtro:", err))
  }, [])

    useEffect(() => {
    setLoading(true)

    const veiculoId = filters.vehicle !== '' && filters.vehicle !== 'all' ? Number(filters.vehicle) : undefined
    const { dateFrom, dateTo } = filters

    const hoje = new Date()
    const trintaDiasAtras = new Date()
    trintaDiasAtras.setDate(hoje.getDate() - 30)
    const fmt = (d: Date) => d.toISOString().slice(0, 10)

    const dataInicio = dateFrom || fmt(trintaDiasAtras)
    const dataFim = dateTo || fmt(hoje)

    // Buscamos TUDO em paralelo
    Promise.allSettled([
      getIndicadores({ dataInicio, dataFim, veiculoId }),
      getConsumo({ dataInicio, dataFim, veiculoId }),
      getQuilometragem({ dataInicio, dataFim, veiculoId }),
      getStatus({ dataInicio, dataFim, veiculoId }),
      getPostos({ dataInicio, dataFim, veiculoId }) 
    ]).then(([indRes, consRes, kmRes, statRes, postosRes]) => {
      
      // 1. Indicadores (Cards de cima)
      if (indRes.status === 'fulfilled') {
        console.log("DADOS QUE VIERAM DA API:", indRes.value);
        setResumo({
          custoMedioPorKm: indRes.value.custoMedioKm || 0, 
          kmTotal: indRes.value.kmTotal || 0,
          viagensRealizadas: indRes.value.totalViagens || 0, 
        });
      } else {
        console.error("Erro na rota Indicadores (Cards):", indRes.reason);
      }

      // 2. Gráfico de Consumo
      if (consRes.status === 'fulfilled') {
        setConsumo({
          labels: consRes.value.map((c: any) => c.mes),
          data: consRes.value.map((c: any) => c.valorConsumo),
        });
      } else {
        console.error("Erro na rota Consumo:", consRes.reason);
      }

      // 3. Gráfico de Quilometragem
      if (kmRes.status === 'fulfilled') {
        setKm({
          labels: kmRes.value.map((k: any) => k.mes),
          empresa: kmRes.value.map((k: any) => k.kmEmpresa),
          terceirizado: kmRes.value.map((k: any) => k.kmTerceirizados),
        });
      } else {
        console.error("Erro na rota Quilometragem:", kmRes.reason);
      }

      // 4. Gráfico de Pizza (Status)
      if (statRes.status === 'fulfilled') {
        setStatus(statRes.value);
      } else {
        console.error("Erro na rota Status:", statRes.reason);
      }

      // 5. Gráfico de Postos
      if (postosRes.status === 'fulfilled') {
        setPostos({
          labels: postosRes.value.map((p: any) => p.nomePosto), 
          data: postosRes.value.map((p: any) => p.precoMedio),  
        });
      } else {
        console.error("Erro na rota Postos:", postosRes.reason);
      }

      setLoading(false);
      setChartKey((k) => k + 1);
    });

  }, [filters.vehicle, filters.period, filters.dateFrom, filters.dateTo])
  
  const metrics = [
    {
      label: staticMetrics[0].label,
      value: loading || !resumo ? '...' : `R$ ${ (resumo.custoMedioPorKm || 0).toFixed(2).replace('.', ',') }`,
    },
    {
      label: staticMetrics[1].label,
      value: loading || !resumo ? '...' : `${(resumo.kmTotal || 0).toLocaleString('pt-BR')} KM`,
    },
    {
      label: staticMetrics[2].label,
      value: loading || !resumo ? '...' : String(resumo.viagensRealizadas || 0),
    },
];

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

  // Download do PDF Corrigido passando os filtros ativos
const handleGenerateReport = async () => {
  try {
    // 1. Captura os mesmos filtros que os gráficos utilizam
    const veiculoId = filters.vehicle !== '' && filters.vehicle !== 'all' ? Number(filters.vehicle) : undefined
    const { dateFrom, dateTo } = filters

    const hoje = new Date()
    const trintaDiasAtras = new Date()
    trintaDiasAtras.setDate(hoje.getDate() - 30)
    const fmt = (d: Date) => d.toISOString().slice(0, 10)

    const dataInicio = dateFrom || fmt(trintaDiasAtras)
    const dataFim = dateTo || fmt(hoje)

    // 2. Passa o objeto com os filtros para a rota do relatório
    const blob = await getRelatorios({ dataInicio, dataFim, veiculoId })
    
    // 3. Faz o download do arquivo com o nome correto
    const url = window.URL.createObjectURL(new Blob([blob], { type: 'application/pdf' }))
    const link = document.createElement('a')
    link.href = url
    link.setAttribute('download', `relatorio_frota_${dataInicio}_a_${dataFim}.pdf`)
    document.body.appendChild(link)
    link.click()
    link.parentNode?.removeChild(link)
    window.URL.revokeObjectURL(url)
  } catch (error) {
    console.error('Erro ao baixar relatório:', error)
    window.alert('Ocorreu um erro ao gerar o relatório do dashboard.')
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
            onGenerateReport={handleGenerateReport}
          />
        </header>

        <section className="grid grid-cols-1 gap-4 md:grid-cols-3">
        {metrics.map((metric, index) => (
          <DashboardMetricCard key={`metric-${index}-${metric.label}`} metric={metric} />
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
                  {status.operando > 0 || status.manutencao > 0 || status.parados > 0
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