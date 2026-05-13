import api from "../../config/api";

export const getVeiculos = async () => {
  const { data } = await api.get("/painel/veiculos");
  return data;
};

export const getResumo = async (params?: {
  veiculoId?: number;
  dataInicio?: string;
  dataFim?: string;
}) => {
  const { data } = await api.get("/painel/resumo", { params });
  return data;
};

export const getConsumo = async (veiculoId?: number) => {
  const { data } = await api.get("/painel/consumo-combustivel", {
    params: { veiculoId },
  });
  return data;
};

export const getQuilometragem = async (veiculoId?: number) => {
  const { data } = await api.get("/painel/quilometragem", {
    params: { veiculoId },
  });
  return data;
};

export const getStatus = async (veiculoId?: number) => {
  const { data } = await api.get("/painel/status-veiculo", {
    params: { veiculoId },
  });
  return data;
};