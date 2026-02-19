// ==========================================
// 1. MAPA DAS CONTAS CORRENTES (BANCOS)
// ==========================================
export const MAPA_BANCOS: Record<string, number> = {
    'BANCO DO BRASIL': 1799886099,
    'CAIXINHA': 1794424427,
    'POUPANÇA B.B': 1799887187,
    'BANCO INTER': 1799887547,
    'BANCO DO BRASIL APLICACAO': 1893198921,
    'XP INVESTIMENTOS': 2105517550,
    'OMIE.CASH': 2114507949
};

/**
 * Busca o ID do banco. Se não achar, usa o BANCO DO BRASIL como padrão.
 */
export function obterIdBanco(nome: string): number {
    const busca = String(nome || '').toUpperCase().trim();
    return MAPA_BANCOS[busca] || 1799886099;
}

// ==========================================
// 2. MAPA DE CATEGORIAS (FINANCEIRO OMIE)
// ==========================================
export const MAPA_CATEGORIAS: Record<string, string> = {
    // Categorias reais mapeadas
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
 * Busca a Categoria. Se não achar ou estiver 'CODIGO_AQUI', usa 'Prestação de Serviços Médicos' (2.03.94)
 */
export function obterCodigoCategoria(nome: string): string {
    const busca = String(nome || '').toUpperCase().trim();
    const codigoEncontrado = MAPA_CATEGORIAS[busca];

    if (codigoEncontrado && codigoEncontrado !== 'CODIGO_AQUI') {
        return codigoEncontrado;
    }

    return '2.03.94';
}