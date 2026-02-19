"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const omie_process_service_1 = require("./omie-process.service");
const omie_service_1 = require("./omie.service");
const prisma_service_1 = require("../prisma/prisma.service");
const omie_mapas_1 = require("./omie-mapas");
let AutomationController = class AutomationController {
    constructor(omieProcessService, omieService, prisma) {
        this.omieProcessService = omieProcessService;
        this.omieService = omieService;
        this.prisma = prisma;
    }
    async processar(files, body, res) {
        try {
            const buffer = await this.omieProcessService.executarInjecao(files.omie[0].buffer, files.doctor[0].buffer, body.datas);
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=shm_final.xlsx'
            });
            res.end(buffer);
        }
        catch (e) {
            res.status(500).json({ message: e.message });
        }
    }
    async prepararDados(body) {
        const todosClientes = await this.omieService.listarTodosClientes();
        const mapaClientes = new Map();
        todosClientes.forEach(cli => {
            const cpf = String(cli.cnpj_cpf || '').replace(/\D/g, '');
            if (cpf)
                mapaClientes.set(cpf, cli.codigo_cliente_omie);
        });
        const prontos = [], ignorados = [];
        body.contas.forEach((conta, index) => {
            let cpf = String(conta.cod_cliente || '').replace(/\D/g, '');
            if (cpf.length > 0 && cpf.length < 11)
                cpf = cpf.padStart(11, '0');
            const idOmie = mapaClientes.get(cpf);
            if (!idOmie) {
                ignorados.push({ nome: conta.medico_nome, cpf: cpf });
                return;
            }
            prontos.push({
                omiePayload: {
                    codigo_cliente_fornecedor: idOmie,
                    data_vencimento: this.formatarData(conta.data_vencimento),
                    valor_documento: Number(conta.valor),
                    codigo_categoria: (0, omie_mapas_1.obterCodigoCategoria)(conta.categoria),
                    id_conta_corrente: (0, omie_mapas_1.obterIdBanco)(conta.banco),
                    observacao: `Médico: ${conta.medico_nome}`,
                    data_previsao: this.formatarData(conta.data_vencimento),
                    codigo_lancamento_integracao: `SHM-${Date.now()}-${index}`
                },
                medico_nome: conta.medico_nome,
                cpf: cpf
            });
        });
        return { prontos, ignorados };
    }
    async incluir(data) {
        try {
            return await this.omieService.incluirContaIndividual(data.omiePayload);
        }
        catch (e) {
            throw new common_1.BadRequestException(e.message);
        }
    }
    async listarEmpresas() {
        const registered = await this.prisma.company.findMany({ orderBy: { id: 'asc' } });
        const usedInScales = await this.prisma.escalaMapping.findMany({
            select: { empresa: true },
            distinct: ['empresa']
        });
        const nomesUnicos = new Set([
            ...registered.map(c => c.name || c.nome),
            ...usedInScales.map(e => e.empresa).filter(Boolean)
        ]);
        return Array.from(nomesUnicos).map(nome => ({ name: nome }));
    }
    async criarEmpresa(data) {
        return await this.prisma.company.create({ data: data });
    }
    async deletarEmpresa(name) {
        try {
            await this.prisma.company.deleteMany({
                where: { OR: [{ name: name }, { nome: name }] }
            });
        }
        catch (e) { }
        return { ok: true };
    }
    async listar(tipo, empresa) {
        if (tipo === 'escalas') {
            if (!empresa)
                return [];
            return await this.prisma.escalaMapping.findMany({
                where: { empresa: empresa },
                orderBy: { origem: 'asc' }
            });
        }
        if (tipo === 'vinculos') {
            return await this.prisma.vinculoMapping.findMany({ orderBy: { sigla: 'asc' } });
        }
    }
    async criar(tipo, data) {
        if (tipo === 'escalas') {
            return await this.prisma.escalaMapping.create({ data: { ...data, ativa: true } });
        }
        if (tipo === 'vinculos') {
            const { empresa, ...dataClean } = data;
            return await this.prisma.vinculoMapping.create({ data: { ...dataClean, ativa: true } });
        }
    }
    async toggle(tipo, id, body) {
        if (tipo === 'escala')
            return await this.prisma.escalaMapping.update({ where: { id }, data: { ativa: body.ativa } });
        if (tipo === 'vinculo')
            return await this.prisma.vinculoMapping.update({ where: { id }, data: { ativa: body.ativa } });
    }
    async update(tipo, id, data) {
        const { id: _, ...updateData } = data;
        if (tipo === 'escala')
            return await this.prisma.escalaMapping.update({ where: { id }, data: updateData });
        if (tipo === 'vinculo') {
            const { empresa, ...finalData } = updateData;
            return await this.prisma.vinculoMapping.update({ where: { id }, data: finalData });
        }
    }
    async deletar(tipo, id) {
        if (tipo === 'escalas')
            return await this.prisma.escalaMapping.delete({ where: { id } });
        if (tipo === 'vinculos')
            return await this.prisma.vinculoMapping.delete({ where: { id } });
    }
    formatarData(d) {
        if (!d || d.includes('/'))
            return d;
        const [ano, mes, dia] = d.split('-');
        return `${dia}/${mes}/${ano}`;
    }
};
exports.AutomationController = AutomationController;
__decorate([
    (0, common_1.Post)('processar'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([{ name: 'omie', maxCount: 1 }, { name: 'doctor', maxCount: 1 }])),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)()),
    __param(2, (0, common_1.Res)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Object, Object]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "processar", null);
__decorate([
    (0, common_1.Post)('preparar-dados'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "prepararDados", null);
__decorate([
    (0, common_1.Post)('incluir-individual'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "incluir", null);
__decorate([
    (0, common_1.Get)('companies'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "listarEmpresas", null);
__decorate([
    (0, common_1.Post)('companies'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "criarEmpresa", null);
__decorate([
    (0, common_1.Delete)('companies/:name'),
    __param(0, (0, common_1.Param)('name')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "deletarEmpresa", null);
__decorate([
    (0, common_1.Get)(':tipo'),
    __param(0, (0, common_1.Param)('tipo')),
    __param(1, (0, common_1.Query)('empresa')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "listar", null);
__decorate([
    (0, common_1.Post)(':tipo'),
    __param(0, (0, common_1.Param)('tipo')),
    __param(1, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Object]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "criar", null);
__decorate([
    (0, common_1.Patch)('toggle/:tipo/:id'),
    __param(0, (0, common_1.Param)('tipo')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "toggle", null);
__decorate([
    (0, common_1.Patch)('update/:tipo/:id'),
    __param(0, (0, common_1.Param)('tipo')),
    __param(1, (0, common_1.Param)('id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String, Object]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "update", null);
__decorate([
    (0, common_1.Delete)(':tipo/:id'),
    __param(0, (0, common_1.Param)('tipo')),
    __param(1, (0, common_1.Param)('id')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, String]),
    __metadata("design:returntype", Promise)
], AutomationController.prototype, "deletar", null);
exports.AutomationController = AutomationController = __decorate([
    (0, common_1.Controller)('automation'),
    __metadata("design:paramtypes", [omie_process_service_1.OmieProcessService,
        omie_service_1.OmieService,
        prisma_service_1.PrismaService])
], AutomationController);
//# sourceMappingURL=automation.controller.js.map