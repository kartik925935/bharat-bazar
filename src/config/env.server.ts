import 'server-only'
import { z } from 'zod'
import { publicEnv } from './env.public'

const serverSchema = z.object({
  SUPABASE_SERVICE_ROLE_KEY: z
    .string({ required_error: 'Missing SUPABASE_SERVICE_ROLE_KEY' })
    .min(1, 'SUPABASE_SERVICE_ROLE_KEY must not be empty'),

  ENCRYPTION_KEY: z
    .string({ required_error: 'Missing ENCRYPTION_KEY' })
    .min(32, 'ENCRYPTION_KEY must be at least 32 characters (use: openssl rand -base64 32)'),

  SA_PATH_TOKEN: z
    .string()
    .min(16, 'SA_PATH_TOKEN must be at least 16 characters')
    .optional(),
})

function parseServerEnv(
  env: Record<string, string | undefined>
): z.infer<typeof serverSchema> {
  const result = serverSchema.safeParse(env)
  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `  • ${e.path.join('.')}: ${e.message}`)
      .join('\n')
    throw new Error(
      `\n\n[Bharat Bazaar] Server environment validation failed:\n${errors}\n\n` +
      `Copy .env.example to .env.local and fill in the missing values.\n`
    )
  }
  return result.data
}

export const serverEnv = {
  ...publicEnv,
  ...parseServerEnv({
    SUPABASE_SERVICE_ROLE_KEY: process.env.SUPABASE_SERVICE_ROLE_KEY,
    ENCRYPTION_KEY: process.env.ENCRYPTION_KEY,
    SA_PATH_TOKEN: process.env.SA_PATH_TOKEN,
  })
}
