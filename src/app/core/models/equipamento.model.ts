export interface Equipamento {
  id: string;
  clienteId: string;
  clienteNome?: string;
  descricao: string;
  marca?: string | null;
  modelo?: string | null;
  numeroSerie?: string | null;
  dataCompra?: string | null;
  observacoes?: string | null;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type EquipamentoPayload = Omit<Equipamento, 'id' | 'clienteNome' | 'criadoEm' | 'atualizadoEm'>;

