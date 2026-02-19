import { Response } from 'express';
import { OmieProcessService } from './omie-process.service';
import { OmieService } from './omie.service';
import { PrismaService } from '../prisma/prisma.service';
export declare class AutomationController {
    private readonly omieProcessService;
    private readonly omieService;
    private readonly prisma;
    constructor(omieProcessService: OmieProcessService, omieService: OmieService, prisma: PrismaService);
    processar(files: any, body: any, res: Response): Promise<void>;
    prepararDados(body: {
        contas: any[];
    }): Promise<{
        prontos: any[];
        ignorados: any[];
    }>;
    incluir(data: any): Promise<any>;
    listarEmpresas(): Promise<{
        name: any;
    }[]>;
    criarEmpresa(data: any): Promise<{
        id: string;
        nome: string;
    }>;
    deletarEmpresa(name: string): Promise<{
        ok: boolean;
    }>;
    listar(tipo: string, empresa: string): Promise<{
        id: string;
        empresa: string;
        origem: string;
        destino: string;
        ativa: boolean;
    }[] | {
        id: string;
        nome: string;
        ativa: boolean;
        sigla: string;
    }[]>;
    criar(tipo: string, data: any): Promise<{
        id: string;
        empresa: string;
        origem: string;
        destino: string;
        ativa: boolean;
    } | {
        id: string;
        nome: string;
        ativa: boolean;
        sigla: string;
    }>;
    toggle(tipo: string, id: string, body: {
        ativa: boolean;
    }): Promise<{
        id: string;
        empresa: string;
        origem: string;
        destino: string;
        ativa: boolean;
    } | {
        id: string;
        nome: string;
        ativa: boolean;
        sigla: string;
    }>;
    update(tipo: string, id: string, data: any): Promise<{
        id: string;
        empresa: string;
        origem: string;
        destino: string;
        ativa: boolean;
    } | {
        id: string;
        nome: string;
        ativa: boolean;
        sigla: string;
    }>;
    deletar(tipo: string, id: string): Promise<{
        id: string;
        empresa: string;
        origem: string;
        destino: string;
        ativa: boolean;
    } | {
        id: string;
        nome: string;
        ativa: boolean;
        sigla: string;
    }>;
    private formatarData;
}
