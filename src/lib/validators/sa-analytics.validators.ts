// src/lib/validators/sa-analytics.validators.ts
import { z } from 'zod'

export const saDateRangeSchema = z.object({
  from: z.string().datetime(),
  to: z.string().datetime(),
}).refine((d) => new Date(d.from) < new Date(d.to), {
  message: 'Start date must be before end date',
})
export type SADateRangeInput = z.infer<typeof saDateRangeSchema>
