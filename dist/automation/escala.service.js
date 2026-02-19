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
exports.EscalaService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
let EscalaService = class EscalaService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async findAll() {
        return this.prisma.escalaMapping.findMany({
            orderBy: { empresa: 'asc' }
        });
    }
    async findActive() {
        return this.prisma.escalaMapping.findMany({
            where: {
                ativa: true,
                NOT: { origem: "" }
            },
            orderBy: { empresa: 'asc' }
        });
    }
    async create(data) {
        return this.prisma.escalaMapping.create({
            data: {
                empresa: data.empresa,
                origem: data.origem || "",
                destino: data.destino || "",
                ativa: true,
            },
        });
    }
    async update(id, data) {
        return this.prisma.escalaMapping.update({
            where: { id },
            data: {
                ...(data.origem !== undefined && { origem: data.origem }),
                ...(data.destino !== undefined && { destino: data.destino }),
                ...(data.empresa !== undefined && { empresa: data.empresa }),
                ...(data.ativa !== undefined && { ativa: data.ativa }),
            },
        });
    }
    async delete(id) {
        return this.prisma.escalaMapping.delete({ where: { id } });
    }
};
exports.EscalaService = EscalaService;
exports.EscalaService = EscalaService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], EscalaService);
//# sourceMappingURL=escala.service.js.map