import { Module } from '@nestjs/common';
import { AutomationController } from './automation.controller';
import { OmieProcessService } from './omie-process.service';
import { OmieService } from './omie.service';
import { PrismaService } from '../prisma/prisma.service';
// Se tiver os services antigos, mantenha-os aqui também
import { EscalaService } from './escala.service';
import { VinculoService } from './vinculo.service';

@Module({
    controllers: [AutomationController],
    providers: [
        PrismaService,
        OmieProcessService,
        OmieService,
        EscalaService,
        VinculoService
    ],
})
export class AutomationModule {}