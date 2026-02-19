import { PrismaService } from '../prisma/prisma.service';
export declare class OmieProcessService {
    private prisma;
    constructor(prisma: PrismaService);
    executarInjecao(templateBuffer: Buffer, dataBuffer: Buffer, datasJson: string): Promise<Buffer>;
}
