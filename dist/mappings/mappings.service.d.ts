export declare class MappingsService {
    private readonly filePath;
    private getMappings;
    saveMapping(type: 'escalas' | 'vinculos', key: string, value: string): any;
    getAll(): any;
    deleteMapping(type: 'escalas' | 'vinculos', key: string): any;
}
