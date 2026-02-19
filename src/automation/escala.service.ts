import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class EscalaService {
    constructor(private prisma: PrismaService) {}

    // Busca todos para a tela de Mapeamento
    async findAll() {
        return this.prisma.escalaMapping.findMany({
            orderBy: { empresa: 'asc' }
        });
    }

    // Busca apenas os que têm mapa configurado E estão ativos (para a Execução)
    async findActive() {
        return this.prisma.escalaMapping.findMany({
            where: {
                ativa: true,
                NOT: { origem: "" } // Só leva para a execução se tiver origem
            },
            orderBy: { empresa: 'asc' }
        });
    }

    // CRIAÇÃO: Focada em cadastrar a Empresa primeiro
    async create(data: { empresa: string; origem?: string; destino?: string }) {
        return this.prisma.escalaMapping.create({
            data: {
                empresa: data.empresa,
                origem: data.origem || "",   // Se não enviar, fica vazio para editar depois
                destino: data.destino || "", // Se não enviar, fica vazio
                ativa: true,
            },
        });
    }

    // ATUALIZAÇÃO: Onde você vai inserir o VITALIS -> HSM depois
    async update(id: string, data: { origem?: string; destino?: string; empresa?: string; ativa?: boolean }) {
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

    async delete(id: string) {
        return this.prisma.escalaMapping.delete({ where: { id } });
    }
}