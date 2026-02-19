import { Module } from '@nestjs/common';
import { AutomationModule } from './automation/automation.module';
import { PrismaModule } from './prisma/prisma.module';

@Module({
  imports: [PrismaModule, AutomationModule],
})
export class AppModule {}