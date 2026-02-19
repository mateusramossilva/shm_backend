import { defineConfig } from '@prisma/config';

export default defineConfig({
  engine: 'classic',
  // O TypeScript avisou: ele quer apenas a string, não o objeto.
  schema: './src/prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});