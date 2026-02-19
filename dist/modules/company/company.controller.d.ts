import { PrismaService } from '../../prisma/prisma.service';
export declare class CompanyController {
    private prisma;
    constructor(prisma: PrismaService);
    findAll(): Promise<{
        id: string;
        nome: string;
    }[]>;
    findOne(id: string): Promise<{
        id: string;
        nome: string;
    }>;
    create(data: {
        nome: string;
    }): Promise<{
        id: string;
        nome: string;
    }>;
    update(id: string, data: {
        nome: string;
    }): Promise<{
        id: string;
        nome: string;
    }>;
    remove(id: string): Promise<{
        id: string;
        nome: string;
    }>;
}
