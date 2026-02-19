import { defineConfig } from '@prisma/config';

export default defineConfig({
  engine: 'classic',
  schema: './src/prisma/schema.prisma',
  datasource: {
    url: process.env.DATABASE_URL,
  },
});