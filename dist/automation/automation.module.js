"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.AutomationModule = void 0;
const common_1 = require("@nestjs/common");
const automation_controller_1 = require("./automation.controller");
const omie_process_service_1 = require("./omie-process.service");
const omie_service_1 = require("./omie.service");
const prisma_service_1 = require("../prisma/prisma.service");
const escala_service_1 = require("./escala.service");
const vinculo_service_1 = require("./vinculo.service");
let AutomationModule = class AutomationModule {
};
exports.AutomationModule = AutomationModule;
exports.AutomationModule = AutomationModule = __decorate([
    (0, common_1.Module)({
        controllers: [automation_controller_1.AutomationController],
        providers: [
            prisma_service_1.PrismaService,
            omie_process_service_1.OmieProcessService,
            omie_service_1.OmieService,
            escala_service_1.EscalaService,
            vinculo_service_1.VinculoService
        ],
    })
], AutomationModule);
//# sourceMappingURL=automation.module.js.map