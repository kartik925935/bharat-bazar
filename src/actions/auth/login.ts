'use server'

import { createClient } from '@/lib/supabase/server'
import { loginSchema, LoginInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function loginWithPassword(data: LoginInput) {
  const result = loginSchema.safeParse(data)

  if (!result.success) {
    return {
      error: 'Invalid input',
      details: result.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()

  const { error } = await supabase.auth.signInWithPassword({
    email: result.data.email,
    password: result.data.password,
  })

  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')

  return { success: true }
}

export async function getGoogleOAuthUrl(callbackUrl?: string) {
  const supabase = await createClient()

  const { data, error } = await supabase.auth.signInWithOAuth({
    provider: 'google',
    options: {
      redirectTo: callbackUrl || `${process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'}/auth/callback`,
    },
  })

  if (error) {
    return { error: error.message }
  }

  return { url: data.url }
}
