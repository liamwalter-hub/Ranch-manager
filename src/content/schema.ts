import { z } from 'zod';

const dateSchema = z.object({ year: z.number().int(), month: z.number().int().min(1).max(12), day: z.number().int().min(1).max(31) });
const range = z.object({ mean: z.number(), spread: z.number().min(0) });

export const packSchema = z.object({
  id: z.string(),
  name: z.string(),
  location: z.string(),
  calendar: z.object({
    start: dateSchema,
    seasonEnd: z.object({ month: z.number().int(), day: z.number().int() }),
  }),
  weather: z.object({
    byMonth: z.record(z.string(), z.object({
      high: range,
      low: range,
      conditions: z.record(z.string(), z.number().min(0)),
    })),
    labels: z.record(z.string(), z.string()),
  }),
});

export type Pack = z.infer<typeof packSchema>;
