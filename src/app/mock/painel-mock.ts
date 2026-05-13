// src/app/mock/painel-mock.ts
// Remover quando o backend estiver pronto — trocar por chamadas reais em painel-service.ts

export type Veiculo = {
  id: number
  placa: string
  modelo: string
  marca: string
  situacao: 'Ativo' | 'Em Manutenção' | 'Inativo'
  tipo: 'Frota Empresa' | 'Frota Terceirizada'
}

export type ResumoIndicadores = {
  custoMedioPorKm: number      // tb_abs_abastecimento: sum(abs_valor_alcada) / sum(abs_km)
  quilometragemTotal: number   // tb_via_viagem: sum(via_km_retorno)
  viagensRealizadas: number    // tb_via_viagem: count(via_codigo) where via_situacao = 'Concluida'
}

export type ConsumoMensal = {
  mes: string
  custoTotal: number           // tb_abs_abastecimento: sum(abs_valor_alcada) agrupado por mes
}

export type PostoPreco = {
  nome: string
  precoMedio: number           // tb_abs_abastecimento: avg(abs_valor_alcada / abs_quantidade)
}

export type KmMensal = {
  mes: string
  kmEmpresa: number            // tb_via_viagem join tb_vel_veiculo where vel_tipo = 'Empresa'
  kmTerceirizado: number       // tb_via_viagem join tb_vel_veiculo where vel_tipo = 'Terceirizado'
}

export type StatusFrota = {
  operando: number             // tb_vel_veiculo where vel_situacao = 'Ativo'
  manutencao: number           // tb_man_manutencao where man_situacao = 'Em Andamento'
  parados: number              // tb_vel_veiculo where vel_situacao = 'Inativo'
}

// ─── Dados estáticos (veículos e status) ──────────────────────────────────────

export const mockVeiculos: Veiculo[] = [
  { id: 1, placa: 'ABC-1234', modelo: 'Actros',        marca: 'Mercedes-Benz', situacao: 'Ativo',          tipo: 'Frota Empresa'       },
  { id: 2, placa: 'DEF-5678', modelo: 'FH 540',        marca: 'Volvo',         situacao: 'Ativo',          tipo: 'Frota Empresa'       },
  { id: 3, placa: 'GHI-9012', modelo: 'Constellation', marca: 'Volkswagen',    situacao: 'Em Manutenção',  tipo: 'Frota Empresa'       },
  { id: 4, placa: 'JKL-3456', modelo: 'TGX',           marca: 'MAN',           situacao: 'Ativo',          tipo: 'Frota Terceirizada'  },
  { id: 5, placa: 'MNO-7890', modelo: 'Stralis',        marca: 'Iveco',         situacao: 'Inativo',        tipo: 'Frota Terceirizada'  },
  { id: 6, placa: 'PQR-1122', modelo: 'Atego',          marca: 'Mercedes-Benz', situacao: 'Ativo',          tipo: 'Frota Empresa'       },
]

export const mockStatusFrota: StatusFrota = {
  operando: 4,    // 4 veículos com vel_situacao = 'Ativo'
  manutencao: 1,  // 1 veículo com man_situacao = 'Em Andamento'
  parados: 1,     // 1 veículo com vel_situacao = 'Inativo'
}

// ─── Geração determinística de dados por veiculoId + period ──────────────────
// Mesma combinação de filtros → sempre os mesmos valores (sem aleatoriedade real).
// Trocar toda esta seção por chamadas de API quando o backend estiver pronto.

/** LCG (Linear Congruential Generator) determinístico. */
function makeRand(seed: number) {
  let s = seed >>> 0
  return () => {
    s = Math.imul(1664525, s) + 1013904223
    return (s >>> 0) / 4294967295
  }
}

/** Converte uma string em semente numérica. */
function toSeed(str: string): number {
  let h = 2166136261
  for (let i = 0; i < str.length; i++) {
    h ^= str.charCodeAt(i)
    h = Math.imul(h, 16777619)
  }
  return h >>> 0
}

/** Retorna quantos meses o período representa. */
function periodToMonths(period: string): number {
  if (period === '30d') return 3
  if (period === '60d') return 5
  if (period === '90d') return 7
  return 7  // fallback / 'all'
}

const ALL_MESES = ['Set', 'Out', 'Nov', 'Dez', 'Jan', 'Fev', 'Mar']
const POSTOS    = ['Shell', 'Ipiranga', 'BR', 'Ale']

// ---- ConsumoMensal ----
export function buildConsumoMensal(veiculoId: number | 'all', period: string): ConsumoMensal[] {
  const rand  = makeRand(toSeed(`consumo-${veiculoId}-${period}`))
  const meses = ALL_MESES.slice(0, periodToMonths(period))
  // Veículos individuais têm volume menor que a frota toda
  const base  = veiculoId === 'all' ? 15000 : 3000
  const range = veiculoId === 'all' ? 12000 : 4000
  return meses.map((mes) => ({
    mes,
    custoTotal: Math.round(base + rand() * range),
  }))
}

// ---- PostoPreco ----
export function buildPostos(veiculoId: number | 'all', period: string): PostoPreco[] {
  const rand = makeRand(toSeed(`postos-${veiculoId}-${period}`))
  return POSTOS.map((nome) => ({
    nome,
    precoMedio: parseFloat((5.5 + rand() * 1.5).toFixed(2)),
  })).sort((a, b) => a.precoMedio - b.precoMedio)
}

// ---- KmMensal ----
export function buildKmMensal(veiculoId: number | 'all', period: string): KmMensal[] {
  const rand  = makeRand(toSeed(`km-${veiculoId}-${period}`))
  const meses = ALL_MESES.slice(0, periodToMonths(period))
  const baseE = veiculoId === 'all' ? 4000 : 800
  const baseT = veiculoId === 'all' ? 1500 : 300
  return meses.map((mes) => ({
    mes,
    kmEmpresa:       Math.round(baseE + rand() * baseE),
    kmTerceirizado:  Math.round(baseT + rand() * baseT),
  }))
}

// ---- ResumoIndicadores ----
export function buildResumo(veiculoId: number | 'all', period: string): ResumoIndicadores {
  const consumo = buildConsumoMensal(veiculoId, period)
  const km      = buildKmMensal(veiculoId, period)

  const totalCusto = consumo.reduce((s, c) => s + c.custoTotal, 0)
  const totalKm    = km.reduce((s, k) => s + k.kmEmpresa + k.kmTerceirizado, 0)
  const viagens    = km.reduce((s, k) => s + Math.round((k.kmEmpresa + k.kmTerceirizado) / 180), 0)

  return {
    custoMedioPorKm:     totalKm > 0 ? parseFloat((totalCusto / totalKm).toFixed(2)) : 0,
    quilometragemTotal:  totalKm,
    viagensRealizadas:   viagens,
  }
}
