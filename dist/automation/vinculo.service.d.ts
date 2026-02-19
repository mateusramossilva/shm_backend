import { PrismaService } from '../prisma/prisma.service';
export declare class VinculoService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        ativa: boolean;
        sigla: string;
        nome: string;
    }[]>;
    findActive(): Promise<{
        id: string;
        ativa: boolean;
        sigla: string;
        nome: string;
    }[]>;
    create(data: any): Promise<{
        id: string;
        ativa: boolean;
        sigla: string;
        nome: string;
    }>;
    update(id: string, data: {
        sigla?: string;
        nome?: string;
        ativa?: boolean;
    }): Promise<{
        id: string;
        ativa: boolean;
        sigla: string;
        nome: string;
    }>;
    delete(id: string): Promise<{
        id: string;
        ativa: boolean;
        sigla: string;
        nome: string;
    }>;
}
