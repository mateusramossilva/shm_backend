"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.MAPA_CATEGORIAS = exports.MAPA_BANCOS = void 0;
exports.obterIdBanco = obterIdBanco;
exports.obterCodigoCategoria = obterCodigoCategoria;
exports.MAPA_BANCOS = {
    'BANCO DO BRASIL': 6732801542,
    'SANTANDER': 6732375397,
    'BRADESCO': 6732375398,
    'CAIXINHA': 6732375396,
    'OMIE.CASH': 6732375400
};
exports.MAPA_CATEGORIAS = {
    'PRESTAÇÃO DE SERVIÇOS MÉDICOS': '2.01.04',
    'SERVIÇOS MÉDICOS': '2.01.04',
    'ASSISTÊNCIA MÉDICA': '2.03.10',
    'COMPRA DE SERVIÇOS': '2.01.04'
};
function obterIdBanco(nome) {
    const busca = String(nome || '').toUpperCase().trim();
    return exports.MAPA_BANCOS[busca] || 6732801542;
}
function obterCodigoCategoria(nome) {
    const busca = String(nome || '').toUpperCase().trim();
    return exports.MAPA_CATEGORIAS[busca] || '2.01.04';
}
//# sourceMappingURL=omie-mapas.js.map