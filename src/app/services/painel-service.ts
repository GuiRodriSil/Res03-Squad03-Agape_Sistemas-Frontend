import api from "../../config/api";

export interface FiltroPainelDTO {
  dataInicio?: string;
  dataFim?: string;
  veiculoId?: number;
}

export const getVeiculos = async () => {
  const { data } = await api.get("/painel/veiculos");
  return data;
};

export const getResumo = async (params: FiltroPainelDTO) => {
  const { data } = await api.get("/painel/resumo", { params });
  return data;
};

export const getConsumo = async (params: FiltroPainelDTO) => {
  const { data } = await api.get("/painel/consumo-combustivel", { params });
  return data;
};

export const getQuilometragem = async (params: FiltroPainelDTO) => {
  const { data } = await api.get("/painel/quilometragem", { params });
  return data;
};

export const getStatus = async (params: FiltroPainelDTO) => {
  const { data } = await api.get("/painel/status-veiculo", { params });
  console.log("DADOS REAIS VINDO DO JAVA:", data);
  return data;
};

export const getPostos = async (params: FiltroPainelDTO) => {
  const { data } = await api.get('/painel/postos-melhor-preco', { params });
  return data; 
};

export const getIndicadores = async (params: FiltroPainelDTO) => {
  const { data } = await api.get("/dashboard/indicadores", { params });
  return data;
};

export async function getRelatorios(filtros: { dataInicio: string; dataFim: string; veiculoId?: number }) {
  // Removido o "/api" do começo para não duplicar com a baseURL do seu Axios
  const response = await api.get('/painel/dashboard/pdf', { 
    params: filtros,
    responseType: 'blob' 
  })
  return response.data

};