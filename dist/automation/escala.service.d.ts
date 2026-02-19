import { PrismaService } from '../prisma/prisma.service';
export declare class EscalaService {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        empresa: string;
        origem: string;
        destino: string;
        ativa: boolean;
    }[]>;
    findActive(): Promise<{
        id: string;
        empresa: string;
        origem: string;
        destino: string;
        ativa: boolean;
    }[]>;
    create(data: {
        empresa: string;
        origem?: string;
        destino?: string;
    }): Promise<{
        id: string;
        empresa: string;
        origem: string;
        destino: string;
        ativa: boolean;
    }>;
    update(id: string, data: {
        origem?: string;
        destino?: string;
        empresa?: string;
        ativa?: boolean;
    }): Promise<{
        id: string;
        empresa: string;
        origem: string;
        destino: string;
        ativa: boolean;
    }>;
    delete(id: string): Promise<{
        id: string;
        empresa: string;
        origem: string;
        destino: string;
        ativa: boolean;
    }>;
}
