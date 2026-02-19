"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OmieProcessService = void 0;
const common_1 = require("@nestjs/common");
const prisma_service_1 = require("../prisma/prisma.service");
const XLSX = require("xlsx");
let OmieProcessService = class OmieProcessService {
    constructor(prisma) {
        this.prisma = prisma;
    }
    async executarInjecao(templateBuffer, dataBuffer, datasJson) {
        const wbTemplate = XLSX.read(templateBuffer, { type: 'buffer', cellDates: true });
        const wbData = XLSX.read(dataBuffer, { type: 'buffer' });
        const ws = wbTemplate.Sheets[wbTemplate.SheetNames[0]];
        const df_dados = XLSX.utils.sheet_to_json(wbData.Sheets[wbData.SheetNames[0]], { header: 1 });
        const datas = datasJson ? JSON.parse(datasJson) : {};
        const [escalas, vinculos] = await Promise.all([
            this.prisma.escalaMapping.findMany({ where: { ativa: true } }),
            this.prisma.vinculoMapping.findMany({ where: { ativa: true } })
        ]);
        let linha = 6;
        for (let i = 9; i < df_dados.length - 1; i += 2) {
            const row_prof = df_dados[i];
            const row_val = df_dados[i + 1];
            if (!row_prof || !row_prof[0])
                continue;
            const val_raw = String(row_val ? row_val[16] : "0");
            const val_limpo = val_raw.replace(/[R\$\.\s]/g, '').replace(',', '.');
            const val_final = parseFloat(val_limpo) || 0;
            const mapaVinculo = vinculos.find(v => v.sigla === String(row_prof[13]));
            const vinculoDest = mapaVinculo ? mapaVinculo.nome : String(row_prof[13]);
            const mapaEscala = escalas.find(e => e.origem === String(row_prof[12]));
            const unidadeDest = mapaEscala ? mapaEscala.destino : String(row_prof[12]);
            XLSX.utils.sheet_add_aoa(ws, [[row_prof[3]]], { origin: `C${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [[vinculoDest]], { origin: `D${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [["Banco do Brasil"]], { origin: `E${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [[val_final]], { origin: `F${linha}` });
            XLSX.utils.sheet_add_aoa(ws, [[unidadeDest]], { origin: `H${linha}` });
            const fmt = (d) => d ? [new Date(d + "T12:00:00")] : [null];
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
};
exports.OmieProcessService = OmieProcessService;
exports.OmieProcessService = OmieProcessService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [prisma_service_1.PrismaService])
], OmieProcessService);
//# sourceMappingURL=omie-process.service.js.map