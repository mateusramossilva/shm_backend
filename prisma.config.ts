import { defineConfig } from '@prisma/config';

export default defineConfig({
  engine: 'classic', // Resolve o erro de build (TypeScript)
  datasource: {
    // Tenta usar a URL do Railway. Se não existir (no seu PC), usa o localhost
    url: process.env.DATABASE_URL || 'postgresql://postgres:docker@localhost:5433/hsm_db',
  },
});