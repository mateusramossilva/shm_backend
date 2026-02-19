"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmieService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const omie_secrets_1 = require("./omie-secrets");
let OmieService = class OmieService {
    constructor() {
        this.appKey = omie_secrets_1.OMIE_CONFIG.APP_KEY;
        this.appSecret = omie_secrets_1.OMIE_CONFIG.APP_SECRET;
        this.baseUrl = omie_secrets_1.OMIE_CONFIG.BASE_URL;
    }
    async listarTodosClientes() {
        try {
            let pagina = 1, totalPaginas = 1, todos = [];
            while (pagina <= totalPaginas) {
                const res = await axios_1.default.post(`${this.baseUrl}/geral/clientes/`, {
                    call: 'ListarClientes', app_key: this.appKey, app_secret: this.appSecret,
                    param: [{ pagina, registros_por_pagina: 500, apenas_importado_api: 'N' }]
                });
                const lista = res.data.clientes_cadastro || res.data.clientes_cadastro_res || [];
                todos.push(...lista);
                totalPaginas = res.data.total_de_paginas || 1;
                pagina++;
            }
            return todos;
        }
        catch (e) {
            return [];
        }
    }
    async incluirContaIndividual(conta) {
        try {
            const res = await axios_1.default.post(`${this.baseUrl}/financas/contapagar/`, {
                call: 'IncluirContaPagar',
                app_key: this.appKey,
                app_secret: this.appSecret,
                param: [conta]
            });
            if (res.data.faultString)
                throw new Error(res.data.faultString);
            return res.data;
        }
        catch (e) {
            const erro = e.response?.data?.faultstring || e.message;
            throw new Error(erro);
        }
    }
};
exports.OmieService = OmieService;
exports.OmieService = OmieService = __decorate([
    (0, common_1.Injectable)()
], OmieService);
//# sourceMappingURL=omie.service.js.map