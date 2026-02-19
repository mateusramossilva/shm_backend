import { Injectable } from '@nestjs/common';
import * as XLSX from 'xlsx';

@Injectable()
export class AutomationService {

    // Função auxiliar para formatar CPF: 12345678901 -> 123.456.789-01
    private formatarCPF(cpf: any): string {
        if (!cpf) return '';
        // 1. Remove tudo que não for número
        const apenasNumeros = String(cpf).replace(/\D/g, '');

        // 2. Verifica se tem 11 dígitos, se não, retorna o que sobrou
        if (apenasNumeros.length !== 11) return apenasNumeros;

        // 3. Aplica a máscara: 000.000.000-00
        return apenasNumeros.replace(/(\d{3})(\d{3})(\d{3})(\d{2})/, "$1.$2.$3-$4");
    }

    async processarArquivos(fileOmie: Express.Multer.File, fileDoctor: Express.Multer.File, datas: any): Promise<Buffer> {
        const wbOmie = XLSX.read(fileOmie.buffer, { type: 'buffer' });
        const wbDoctor = XLSX.read(fileDoctor.buffer, { type: 'buffer' });

        const wsOmie = wbOmie.Sheets[wbOmie.SheetNames[0]];
        const wsDoctor = wbDoctor.Sheets[wbDoctor.SheetNames[0]];

        // Dados do Doctor ID (onde está o CPF que precisa de ajuste)
        const dadosDoctor: any[] = XLSX.utils.sheet_to_json(wsDoctor);

        // --- LÓGICA DE CORREÇÃO DO CPF ---
        const dadosDoctorFormatados = dadosDoctor.map(linha => {
            // Supondo que a coluna no Doctor ID se chama 'CPF' ou 'cpf_cnpj'
            // Ajuste o nome da chave abaixo para o nome real da coluna no seu Excel
            const cpfOriginal = linha['CPF'] || linha['cpf'] || linha['Cpf'];

            return {
                ...linha,
                CPF_FORMATADO: this.formatarCPF(cpfOriginal)
            };
        });

        // Agora, quando você for fazer o "Match" com o Template da Omie,
        // use o 'CPF_FORMATADO' que garantirá o encontro dos dados.

        // Exemplo de como você faria o match:
        const dadosOmie = XLSX.utils.sheet_to_json(wsOmie, { header: 1 }) as any[][];
        // ... sua lógica de cruzamento aqui ...

        const newWs = XLSX.utils.aoa_to_sheet(dadosOmie);
        wbOmie.Sheets[wbOmie.SheetNames[0]] = newWs;

        const buffer = XLSX.write(wbOmie, { type: 'buffer', bookType: 'xlsx' });
        return buffer;
    }
}