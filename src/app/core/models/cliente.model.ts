export interface Cliente {
  id: string;
  nome: string;
  documento?: string | null;
  email?: string | null;
  telefone?: string | null;
  whatsapp?: string | null;
  endereco?: string | null;
  observacoes?: string | null;
  ativo: boolean;
  criadoEm?: string;
  atualizadoEm?: string;
}

export type ClientePayload = Omit<Cliente, 'id' | 'criadoEm' | 'atualizadoEm'>;

