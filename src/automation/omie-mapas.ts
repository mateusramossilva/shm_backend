// --- MAPAS DA CONTA DE TESTE (GEORGE) ---

export const MAPA_BANCOS: Record<string, number> = {
    // Nomes que vêm do Excel -> ID Real na Omie
    'BANCO DO BRASIL': 6732801542,
    'SANTANDER': 6732375397,
    'BRADESCO': 6732375398,
    'CAIXINHA': 6732375396,
    'OMIE.CASH': 6732375400
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
    return MAPA_BANCOS[busca] || 6732801542;
}

/**
 * Busca a Categoria. Se não achar, usa COMPRA DE SERVIÇOS como padrão.
 */
export function obterCodigoCategoria(nome: string): string {
    const busca = String(nome || '').toUpperCase().trim();
    return MAPA_CATEGORIAS[busca] || '2.01.04';
}