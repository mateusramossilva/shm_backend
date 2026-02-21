import {
    Controller, Post, Get, Patch, Delete, Body, Param, Query,
    UploadedFiles, UseInterceptors, Res, BadRequestException
} from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { Response } from 'express';
// Importando os serviços
import { OmieProcessService } from './omie-process.service';
import { OmieService } from './omie.service';
import { PrismaService } from '../prisma/prisma.service';
// Importando mapas
import { obterIdBanco, obterCodigoCategoria, obterIdProjeto } from './omie-mapas';

@Controller('automation')
export class AutomationController {
    constructor(
        private readonly omieProcessService: OmieProcessService,
        private readonly omieService: OmieService,
        private readonly prisma: PrismaService
    ) {}

    // 1. GERAÇÃO DO EXCEL
    @Post('processar')
    @UseInterceptors(FileFieldsInterceptor([{ name: 'omie', maxCount: 1 }, { name: 'doctor', maxCount: 1 }]))
    async processar(@UploadedFiles() files, @Body() body, @Res() res: Response) {
        try {
            const buffer = await this.omieProcessService.executarInjecao(
                files.omie[0].buffer,
                files.doctor[0].buffer,
                body.datas
            );
            res.set({
                'Content-Type': 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
                'Content-Disposition': 'attachment; filename=shm_final.xlsx'
            });
            res.end(buffer);
        } catch (e) {
            res.status(500).json({ message: e.message });
        }
    }

    // 2. PREPARAÇÃO PARA API OMIE
    @Post('preparar-dados')
    async prepararDados(@Body() body: { contas: any[] }) {
        const todosClientes = await this.omieService.listarTodosClientes();
        const mapaClientes = new Map();

        todosClientes.forEach(cli => {
            const cpf = String(cli.cnpj_cpf || '').replace(/\D/g, '');
            if (cpf) mapaClientes.set(cpf, cli.codigo_cliente_omie);
        });

        const prontos = [], ignorados = [];

        for (let index = 0; index < body.contas.length; index++) {
            const conta = body.contas[index];

            let cpf = String(conta.cod_cliente || '').replace(/\D/g, '');
            if (cpf.length > 0 && cpf.length < 11) cpf = cpf.padStart(11, '0');

            const idOmie = mapaClientes.get(cpf);

            if (!idOmie) {
                ignorados.push({ nome: "CPF não encontrado na Omie", cpf: cpf });
                continue;
            }

            // ====================================================================
            // LÓGICA DE MAPEAMENTO CORRETA (Baseada na leitura do seu site)
            // ====================================================================

            // O site envia a Categoria (Col D) dentro de conta.medico_nome
            const textoCategoriaExcel = String(conta.medico_nome || '').trim();

            // O site envia o Projeto (Col H) dentro de conta.categoria
            const textoProjetoExcel = String(conta.categoria || '').trim();

            // Pega os IDs nos mapas
            const codigoCategoriaFinal = obterCodigoCategoria(textoCategoriaExcel);
            let idProjetoFinal = obterIdProjeto(textoProjetoExcel);

            // Se o projeto for novo, cria na Omie
            if (idProjetoFinal === 0 && textoProjetoExcel !== '') {
                console.log(`[AUTOMAÇÃO] Criando novo projeto na Omie: ${textoProjetoExcel}`);
                idProjetoFinal = await this.omieService.incluirProjeto(textoProjetoExcel);
            }

            // Monta o envio pra Omie
            const payload: any = {
                codigo_cliente_fornecedor: idOmie,
                data_vencimento: this.formatarData(conta.data_vencimento),
                valor_documento: Number(conta.valor),
                codigo_categoria: codigoCategoriaFinal,
                id_conta_corrente: obterIdBanco(conta.banco),
                observacao: "",
                data_previsao: this.formatarData(conta.data_vencimento),
                codigo_lancamento_integracao: `SHM-${Date.now()}-${index}`
            };

            // Injeta o ID do projeto na raiz
            if (idProjetoFinal > 0) {
                payload.codigo_projeto = idProjetoFinal;
            }

            prontos.push({
                omiePayload: payload,
                medico_nome: textoProjetoExcel, // Mantemos isso aqui só pro seu console não bugar
                cpf: cpf
            });
        }

        return { prontos, ignorados };
    }

    @Post('incluir-individual')
    async incluir(@Body() data: any) {
        try {
            return await this.omieService.incluirContaIndividual(data.omiePayload);
        } catch (e: any) {
            throw new BadRequestException(e.message);
        }
    }

    // ==================================================================
    // ÁREA 2: GESTÃO DE ESCALAS/VÍNCULOS
    // ==================================================================

    @Get('companies')
    async listarEmpresas() {
        const registered = await this.prisma.company.findMany({ orderBy: { id: 'asc' } as any });
        const usedInScales = await this.prisma.escalaMapping.findMany({ select: { empresa: true }, distinct: ['empresa'] as any });
        const nomesUnicos = new Set([...registered.map(c => (c as any).name || (c as any).nome), ...usedInScales.map(e => e.empresa).filter(Boolean)]);
        return Array.from(nomesUnicos).map(nome => ({ name: nome }));
    }

    @Post('companies')
    async criarEmpresa(@Body() data: any) { return await this.prisma.company.create({ data: data as any }); }

    @Delete('companies/:name')
    async deletarEmpresa(@Param('name') name: string) {
        try { await this.prisma.company.deleteMany({ where: { OR: [{ name: name } as any, { nome: name } as any] } as any }); } catch (e) {}
        return { ok: true };
    }

    @Get(':tipo')
    async listar(@Param('tipo') tipo: string, @Query('empresa') empresa: string) {
        if (tipo === 'escalas') {
            if (!empresa) return [];
            return await this.prisma.escalaMapping.findMany({ where: { empresa: empresa } as any, orderBy: { origem: 'asc' } });
        }
        if (tipo === 'vinculos') return await this.prisma.vinculoMapping.findMany({ orderBy: { sigla: 'asc' } });
    }

    @Post(':tipo')
    async criar(@Param('tipo') tipo: string, @Body() data: any) {
        if (tipo === 'escalas') return await this.prisma.escalaMapping.create({ data: { ...data, ativa: true } });
        if (tipo === 'vinculos') { const { empresa, ...dataClean } = data; return await this.prisma.vinculoMapping.create({ data: { ...dataClean, ativa: true } }); }
    }

    @Patch('toggle/:tipo/:id')
    async toggle(@Param('tipo') tipo: string, @Param('id') id: string, @Body() body: { ativa: boolean }) {
        if (tipo === 'escala') return await this.prisma.escalaMapping.update({ where: { id }, data: { ativa: body.ativa } });
        if (tipo === 'vinculo') return await this.prisma.vinculoMapping.update({ where: { id }, data: { ativa: body.ativa } });
    }

    @Patch('update/:tipo/:id')
    async update(@Param('tipo') tipo: string, @Param('id') id: string, @Body() data: any) {
        const { id: _, ...updateData } = data;
        if (tipo === 'escala') return await this.prisma.escalaMapping.update({ where: { id }, data: updateData });
        if (tipo === 'vinculo') { const { empresa, ...finalData } = updateData; return await this.prisma.vinculoMapping.update({ where: { id }, data: finalData }); }
    }

    @Delete(':tipo/:id')
    async deletar(@Param('tipo') tipo: string, @Param('id') id: string) {
        if (tipo === 'escalas') return await this.prisma.escalaMapping.delete({ where: { id } });
        if (tipo === 'vinculos') return await this.prisma.vinculoMapping.delete({ where: { id } });
    }

    private formatarData(d: string) {
        if (!d || d.includes('/')) return d;
        const [ano, mes, dia] = d.split('-');
        return `${dia}/${mes}/${ano}`;
    }
}