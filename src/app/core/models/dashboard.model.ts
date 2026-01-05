export interface DashboardKPIs {
    totalClientes: number;
    ordensEmAndamento: number;
    ordensConcluidasMes: number;
    receitaTotalMes: number;
}

export interface StatusCount {
    status: string;
    count: number;
}

export interface ReceitaMensal {
    mes: number;
    ano: number;
    receita: number;
}

export interface TopCliente {
    id: string;
    nome: string;
    totalOrdens: number;
    valorTotal: number;
}
