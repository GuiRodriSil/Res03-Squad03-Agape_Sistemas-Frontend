// src/app/services/painel-mock-service.ts

import {
  buildConsumoMensal,
  buildKmMensal,
  buildPostos,
  buildResumo,
  mockStatusFrota,
  mockVeiculos,
  type ConsumoMensal,
  type KmMensal,
  type PostoPreco,
  type ResumoIndicadores,
  type StatusFrota,
  type Veiculo,
} from '@/app/mock/painel-mock'

const delay = (ms = 300) => new Promise((r) => setTimeout(r, ms))

// Recebe period e dateFrom/dateTo — usa period quando disponível,
// senão calcula a partir das datas para não perder a seed correta
function resolvePeriod(period?: string, dataInicio?: string, dataFim?: string): string {
  if (period && period !== 'all') return period
  if (!dataInicio || !dataFim) return 'all'
  const diff =
    (new Date(dataFim).getTime() - new Date(dataInicio).getTime()) / 86400000
  if (diff <= 45) return '30d'
  if (diff <= 75) return '60d'
  return '90d'
}

function toVeiculoId(raw?: number): number | 'all' {
  return raw == null ? 'all' : raw
}

export async function getVeiculos(): Promise<Veiculo[]> {
  await delay()
  return mockVeiculos
}

export async function getResumo(params?: {
  veiculoId?: number
  period?: string
  dataInicio?: string
  dataFim?: string
}): Promise<ResumoIndicadores> {
  await delay()
  const vid    = toVeiculoId(params?.veiculoId)
  const period = resolvePeriod(params?.period, params?.dataInicio, params?.dataFim)
  return buildResumo(vid, period)
}

export async function getConsumo(
  veiculoId?: number,
  period?: string,
  dataInicio?: string,
  dataFim?: string,
): Promise<ConsumoMensal[]> {
  await delay()
  return buildConsumoMensal(toVeiculoId(veiculoId), resolvePeriod(period, dataInicio, dataFim))
}

export async function getPostos(
  veiculoId?: number,
  period?: string,
  dataInicio?: string,
  dataFim?: string,
): Promise<PostoPreco[]> {
  await delay()
  return buildPostos(toVeiculoId(veiculoId), resolvePeriod(period, dataInicio, dataFim))
}

export async function getQuilometragem(
  veiculoId?: number,
  period?: string,
  dataInicio?: string,
  dataFim?: string,
): Promise<KmMensal[]> {
  await delay()
  return buildKmMensal(toVeiculoId(veiculoId), resolvePeriod(period, dataInicio, dataFim))
}

export async function getStatus(_veiculoId?: number): Promise<StatusFrota> {
  await delay()
  return mockStatusFrota
}
