import { z } from 'zod'

const publicSchema = z.object({
  NEXT_PUBLIC_SUPABASE_URL: z
    .string({ required_error: 'Missing NEXT_PUBLIC_SUPABASE_URL' })
    .url({ message: 'NEXT_PUBLIC_SUPABASE_URL must be a valid URL (e.g. https://xxx.supabase.co)' }),

  NEXT_PUBLIC_SUPABASE_ANON_KEY: z
    .string({ required_error: 'Missing NEXT_PUBLIC_SUPABASE_ANON_KEY' })
    .min(1, 'NEXT_PUBLIC_SUPABASE_ANON_KEY must not be empty'),

  NEXT_PUBLIC_SITE_NAME: z.string().optional().default('Bharat Bazaar'),
  NEXT_PUBLIC_SITE_DESCRIPTION: z.string().optional().default(
    'Shop directly from artisans, village producers, and NGOs across India.'
  ),
  NEXT_PUBLIC_APP_URL: z
    .string()
    .optional()
    .default('http://localhost:3000'),
  NEXT_PUBLIC_SUPPORT_EMAIL: z.string().email().optional().default('support@bharatbazaar.com'),
  NEXT_PUBLIC_SUPPORT_PHONE: z.string().optional().default('1800-XXX-XXXX'),
  NEXT_PUBLIC_SA_TOKEN: z.string().optional().default('bb-sa-7f3a9b2c4d1e8f6a0b5c3d7e2f4a9b1c'),
})

function parsePublicEnv(
  env: Record<string, string | undefined>
): z.infer<typeof publicSchema> {
  const result = publicSchema.safeParse(env)
  if (!result.success) {
    const errors = result.error.errors
      .map((e) => `  • ${e.path.join('.')}: ${e.message}`)
      .join('\n')
    throw new Error(
      `\n\n[Bharat Bazaar] Public environment validation failed:\n${errors}\n\n` +
      `Copy .env.example to .env.local and fill in the missing values.\n`
    )
  }
  return result.data
}

export const publicEnv = parsePublicEnv({
  NEXT_PUBLIC_SUPABASE_URL: process.env.NEXT_PUBLIC_SUPABASE_URL,
  NEXT_PUBLIC_SUPABASE_ANON_KEY: process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY,
  NEXT_PUBLIC_SITE_NAME: process.env.NEXT_PUBLIC_SITE_NAME,
  NEXT_PUBLIC_SITE_DESCRIPTION: process.env.NEXT_PUBLIC_SITE_DESCRIPTION,
  NEXT_PUBLIC_APP_URL: process.env.NEXT_PUBLIC_APP_URL,
  NEXT_PUBLIC_SUPPORT_EMAIL: process.env.NEXT_PUBLIC_SUPPORT_EMAIL,
  NEXT_PUBLIC_SUPPORT_PHONE: process.env.NEXT_PUBLIC_SUPPORT_PHONE,
  NEXT_PUBLIC_SA_TOKEN: process.env.NEXT_PUBLIC_SA_TOKEN,
})
