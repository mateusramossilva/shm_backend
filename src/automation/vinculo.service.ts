import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class VinculoService {
    constructor(private prisma: PrismaService) {}

    // LISTA TODOS: Usado na tela de configuração para você ver ativos e inativos
    async findAll() {
        return this.prisma.vinculoMapping.findMany({
            orderBy: { sigla: 'asc' }
        });
    }

    // LISTA APENAS ATIVOS: Usado no motor do Omie e no rodapé da execução
    async findActive() {
        return this.prisma.vinculoMapping.findMany({
            where: { ativa: true },
            orderBy: { sigla: 'asc' }
        });
    }

    async create(data: any) {
        return this.prisma.vinculoMapping.create({
            data: {
                ...data,
                ativa: data.ativa !== undefined ? data.ativa : true
            }
        });
    }

    async update(id: string, data: { sigla?: string; nome?: string; ativa?: boolean }) {
        return this.prisma.vinculoMapping.update({
            where: { id },
            data: {
                // Aqui garantimos que ele só altere o que foi enviado
                ...(data.sigla && { sigla: data.sigla }),
                ...(data.nome && { nome: data.nome }),
                ...(data.ativa !== undefined && { ativa: data.ativa }),
            },
        });
    }

    async delete(id: string) {
        return this.prisma.vinculoMapping.delete({ where: { id } });
    }
}