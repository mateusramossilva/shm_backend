import { z } from 'zod';

export const MappingSchema = z.object({
  origin: z.string().min(1, 'Origem é obrigatória'),
  destiny: z.string().min(1, 'Destino Omie é obrigatório'),
  type: z.enum(['ESCALA', 'VINCULO']),
});

export type Mapping = z.infer<typeof MappingSchema>;
