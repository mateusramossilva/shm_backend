// --- MAPAS DAS CONTAS CORRENTES (ATUALIZADO) ---

export const MAPA_BANCOS: Record<string, number> = {
    // Nomes que vêm do Excel/Sistema -> ID Real na Omie (nCodCC)
    'BANCO DO BRASIL': 1799886099,
    'CAIXINHA': 1794424427,
    'POUPANÇA B.B': 1799887187,
    'BANCO INTER': 1799887547,
    'BANCO DO BRASIL APLICACAO': 1893198921,
    'XP INVESTIMENTOS': 2105517550,
    'OMIE.CASH': 2114507949
};

export const MAPA_CATEGORIAS: Record<string, string> = {
    // Categorias de Despesa
    'PRESTAÇÃO DE SERVIÇOS MÉDICOS': '2.01.04', // Usando "Compra de Serviços" (Genérico)
    'SERVIÇOS MÉDICOS': '2.01.04',
    'ASSISTÊNCIA MÉDICA': '2.03.10',            // Outra opção válida se for benefício
    'COMPRA DE SERVIÇOS': '2.01.04'
};

/**
 * Busca o ID do banco. Se não achar, usa o BANCO DO BRASIL como padrão.
 */
export function obterIdBanco(nome: string): number {
    const busca = String(nome || '').toUpperCase().trim();
    // Fallback atualizado para o ID correto do Banco do Brasil: 1799886099
    return MAPA_BANCOS[busca] || 1799886099;
}

/**
 * Busca a Categoria. Se não achar, usa COMPRA DE SERVIÇOS como padrão.
 */
export function obterCodigoCategoria(nome: string): string {
    const busca = String(nome || '').toUpperCase().trim();
    return MAPA_CATEGORIAS[busca] || '2.01.04';
}