import { defineConfig } from '@prisma/config';

export default defineConfig({
  datasource: {
    // Note o 5433 no final do localhost
    url: 'postgresql://postgres:docker@localhost:5433/hsm_db',
  },
});