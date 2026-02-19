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
Object.defineProperty(exports, "__esModule", { value: true });
exports.VinculoService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let VinculoService = class VinculoService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.vinculoMapping.findMany({
            orderBy: { sigla: 'asc' }
        });
    }
    async findActive() {
        return this.prisma.vinculoMapping.findMany({
            where: { ativa: true },
            orderBy: { sigla: 'asc' }
        });
    }
    async create(data) {
        return this.prisma.vinculoMapping.create({
            data: {
                ...data,
                ativa: data.ativa !== undefined ? data.ativa : true
            }
        });
    }
    async update(id, data) {
        return this.prisma.vinculoMapping.update({
            where: { id },
            data: {
                ...(data.sigla && { sigla: data.sigla }),
                ...(data.nome && { nome: data.nome }),
                ...(data.ativa !== undefined && { ativa: data.ativa }),
            },
        });
    }
    async delete(id) {
        return this.prisma.vinculoMapping.delete({ where: { id } });
    }
};
exports.VinculoService = VinculoService;
exports.VinculoService = VinculoService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], VinculoService);
//# sourceMappingURL=vinculo.service.js.map