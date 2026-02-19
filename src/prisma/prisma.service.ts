import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    try {
      await this.$connect();
      console.log('🐘 PostgreSQL conectado com sucesso via Prisma!');
    } catch (error) {
      console.error('❌ Erro de conexão no Prisma:', error.message);
    }
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }
}