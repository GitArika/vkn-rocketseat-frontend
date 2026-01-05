export type StatusOrdem =
  | 'RECEBIDO'
  | 'DIAGNOSTICO'
  | 'AGUARDANDO_PECAS'
  | 'EM_REPARO'
  | 'PRONTO'
  | 'ENTREGUE';

export interface OrdemServico {
  id: string;
  clienteId: string;
  clienteNome?: string;
  equipamentoId: string;
  equipamentoDescricao?: string;
  responsavelId?: string | null;
  responsavelNome?: string | null;
  status: StatusOrdem;
  descricaoProblema: string;
  descricaoServico?: string | null;
  valorMaoObra?: number | null;
  valorPecas?: number | null;
  valorTotal?: number | null;
  previsaoEntrega?: string | null;
  dataConclusao?: string | null;
  observacoes?: string | null;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type OrdemServicoPayload = Omit<OrdemServico, 'id' | 'clienteNome' | 'equipamentoDescricao' | 'responsavelNome' | 'valorTotal' | 'criadoEm' | 'atualizadoEm'>;

