import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import * as XLSX from 'xlsx';

@Injectable()
export class OmieProcessService {
    constructor(private prisma: PrismaService) {}

    async executarInjecao(templateBuffer: Buffer, dataBuffer: Buffer, datasJson: string): Promise<Buffer> {
        const wbTemplate = XLSX.read(templateBuffer, { type: 'buffer', cellDates: true });
        const wbData = XLSX.read(dataBuffer, { type: 'buffer' });
        const ws = wbTemplate.Sheets[wbTemplate.SheetNames[0]];
        const df_dados: any[][] = XLSX.utils.sheet_to_json(wbData.Sheets[wbData.SheetNames[0]], { header: 1 });
        const datas = datasJson ? JSON.parse(datasJson) : {};

        // BUSCA APENAS O QUE ESTÁ ATIVO PARA O EXCEL
        const [escalas, vinculos] = await Promise.all([
            this.prisma.escalaMapping.findMany({ where: { ativa: true } }),
            this.prisma.vinculoMapping.findMany({ where: { ativa: true } })
        ]);

        let linha = 6;
        for (let i = 9; i < df_dados.length - 1; i += 2) {
            const row_prof = df_dados[i];
            const row_val = df_dados[i + 1];
            if (!row_prof || !row_prof[0]) continue;

            const val_raw = String(row_val ? row_val[16] : "0");
            const val_limpo = val_raw.replace(/[R\$\.\s]/g, '').replace(',', '.');
            const val_final = parseFloat(val_limpo) || 0;

            // Mapeamento de Vínculo (Sigla -> Nome)
            const mapaVinculo = vinculos.find(v => v.sigla === String(row_prof[13]));
            const vinculoDest = mapaVinculo ? mapaVinculo.nome : String(row_prof[13]);

            // Mapeamento de Escala (Origem -> Destino)
            const mapaEscala = escalas.find(e => e.origem === String(row_prof[12]));
            const unidadeDest = mapaEscala ? mapaEscala.destino : String(row_prof[12]);

            // Injeção no Template Omie
            XLSX.utils.sheet_add_aoa(ws, [[row_prof[3]]], { origin: `C${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [[vinculoDest]], { origin: `D${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [["Banco do Brasil"]], { origin: `E${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [[val_final]], { origin: `F${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [[unidadeDest]], { origin: `H${linha}` });

            const fmt = (d: string) => d ? [new Date(d + "T12:00:00")] : [null];
            XLSX.utils.sheet_add_aoa(ws, [fmt(datas.emissao)], { origin: `I${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [fmt(datas.registro)], { origin: `J${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [fmt(datas.vencimento)], { origin: `K${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [fmt(datas.previsao)], { origin: `L${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [fmt(datas.pagamento)], { origin: `M${linha}` });

            XLSX.utils.sheet_add_aoa(ws, [[val_final]], { origin: `N${linha}` });
            linha++;
        }
        return Buffer.from(XLSX.write(wbTemplate, { type: 'buffer', bookType: 'xlsx' }));
    }
}