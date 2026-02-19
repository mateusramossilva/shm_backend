import { defineConfig } from '@prisma/config';

export default defineConfig({
  engine: 'classic',
  schema: './src/prisma/schema.prisma', // String pura aqui
  datasource: {
    url: process.env.DATABASE_URL,
  },
});