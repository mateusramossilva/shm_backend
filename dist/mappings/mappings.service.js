"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.MappingsService = void 0;
const common_1 = require("@nestjs/common");
const fs = require("fs");
const path = require("path");
let MappingsService = class MappingsService {
    constructor() {
        this.filePath = path.resolve('mappings.json');
    }
    getMappings() {
        if (!fs.existsSync(this.filePath)) {
            return { escalas: {}, vinculos: {} };
        }
        return JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    }
    saveMapping(type, key, value) {
        const data = this.getMappings();
        data[type][key] = value;
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
        return data[type];
    }
    getAll() {
        return this.getMappings();
    }
    deleteMapping(type, key) {
        const data = this.getMappings();
        delete data[type][key];
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
        return data[type];
    }
};
exports.MappingsService = MappingsService;
exports.MappingsService = MappingsService = __decorate([
    (0, common_1.Injectable)()
], MappingsService);
//# sourceMappingURL=mappings.service.js.map