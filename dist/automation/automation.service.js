"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationService = void 0;
const common_1 = require("@nestjs/common");
const XLSX = require("xlsx");
let AutomationService = class AutomationService {
    async processarArquivos(fileOmie, fileDoctor, datas) {
        const wbOmie = XLSX.read(fileOmie.buffer, { type: 'buffer' });
        const wbDoctor = XLSX.read(fileDoctor.buffer, { type: 'buffer' });
        const wsOmie = wbOmie.Sheets[wbOmie.SheetNames[0]];
        const wsDoctor = wbDoctor.Sheets[wbDoctor.SheetNames[0]];
        const dadosDoctor = XLSX.utils.sheet_to_json(wsDoctor);
        const dadosOmie = XLSX.utils.sheet_to_json(wsOmie, { header: 1 });
        const newWs = XLSX.utils.aoa_to_sheet(dadosOmie);
        wbOmie.Sheets[wbOmie.SheetNames[0]] = newWs;
        const buffer = XLSX.write(wbOmie, { type: 'buffer', bookType: 'xlsx' });
        return buffer;
    }
};
exports.AutomationService = AutomationService;
exports.AutomationService = AutomationService = __decorate([
    (0, common_1.Injectable)()
], AutomationService);
//# sourceMappingURL=automation.service.js.map