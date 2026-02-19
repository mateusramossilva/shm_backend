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
    // === CATEGORIAS FINANCEIRAS REAIS DA OMIE ===
    '200220- PRESTAÇÃO DE SERVIÇOS MÉDICOS': '2.03.94',
    'PRESTAÇÃO DE SERVIÇOS MÉDICOS': '2.03.94',
    'SERVIÇOS MÉDICOS': '2.03.94',
    '200204-DISTRIBUIÇÃO DE LUCROS': '2.03.04',
    'ASSISTÊNCIA MÉDICA': '2.03.03',
    'SALÁRIO': '2.03.14',
    'ALUGUEL': '2.04.01',
    'ENERGIA ELÉTRICA': '2.04.04',
    'TELEFONIA': '2.04.05',
    '200801 - PROSPECÇÃO DE CLIENTES': '2.11.99',
    '200802-ATESTADO DE CAPACIDADE TÉCNICA': '2.11.98',
    'COMPRA DE SERVIÇOS': '2.01.04',
};

/**
 * Busca a Categoria. Se não achar, usa 'Prestação de Serviços Médicos' como padrão.
 */
export function obterCodigoCategoria(nome: string): string {
    const busca = String(nome || '').toUpperCase().trim();
    // Fallback atualizado para o código real: 2.03.94
    return MAPA_CATEGORIAS[busca] || '2.03.94';
}
