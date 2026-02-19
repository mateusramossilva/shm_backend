import { Injectable } from '@nestjs/common';
import * as fs from 'fs';
import * as path from 'path';

@Injectable()
export class MappingsService {
    private readonly filePath = path.resolve('mappings.json');

    private getMappings() {
        if (!fs.existsSync(this.filePath)) {
            return { escalas: {}, vinculos: {} };
        }
        return JSON.parse(fs.readFileSync(this.filePath, 'utf-8'));
    }

    saveMapping(type: 'escalas' | 'vinculos', key: string, value: string) {
        const data = this.getMappings();
        data[type][key] = value;
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
        return data[type];
    }

    getAll() {
        return this.getMappings();
    }

    deleteMapping(type: 'escalas' | 'vinculos', key: string) {
        const data = this.getMappings();
        delete data[type][key];
        fs.writeFileSync(this.filePath, JSON.stringify(data, null, 2));
        return data[type];
    }
}