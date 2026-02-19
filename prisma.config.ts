import { defineConfig } from '@prisma/config';

export default defineConfig({
  engine: 'classic',
  // Apenas a string, sem o objeto que deu erro antes
  schema: './src/prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});