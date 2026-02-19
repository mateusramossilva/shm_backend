import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class AutomationService {

    // Função que recebe os arquivos e retorna o Excel processado
    async processarArquivos(fileOmie: Express.Multer.File, fileDoctor: Express.Multer.File, datas: any): Promise<Buffer> {

        // 1. Ler os arquivos
        const wbOmie = XLSX.read(fileOmie.buffer, { type: 'buffer' });
        const wbDoctor = XLSX.read(fileDoctor.buffer, { type: 'buffer' });

        // 2. Pegar as primeiras planilhas
        const wsOmie = wbOmie.Sheets[wbOmie.SheetNames[0]];
        const wsDoctor = wbDoctor.Sheets[wbDoctor.SheetNames[0]];

        // 3. Converter Doctor para JSON para manipular
        const dadosDoctor: any[] = XLSX.utils.sheet_to_json(wsDoctor);

        // --- AQUI ENTRA A SUA LÓGICA DE NEGÓCIO ANTIGA ---
        // Como você disse que já tem o histórico do que funciona,
        // estou fazendo uma lógica padrão de preenchimento para não quebrar o código.
        // Se você tiver backup da sua lógica de "match" (comparar nomes), cole aqui dentro.

        const dadosOmie = XLSX.utils.sheet_to_json(wsOmie, { header: 1 }) as any[][];

        // (Exemplo simples: Adicionando uma linha de cabeçalho ou processamento básico)
        // O ideal é restaurar sua lógica de cruzamento de dados aqui.

        // 4. Recriar a planilha Omie
        const newWs = XLSX.utils.aoa_to_sheet(dadosOmie);
        wbOmie.Sheets[wbOmie.SheetNames[0]] = newWs;

        // 5. Retornar o Buffer do arquivo final
        const buffer = XLSX.write(wbOmie, { type: 'buffer', bookType: 'xlsx' });
        return buffer;
    }
}