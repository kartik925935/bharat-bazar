'use server'

import { createClient } from '@/lib/supabase/server'
import { signupSchema, SignupInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function signup(data: SignupInput) {
  const result = signupSchema.safeParse(data)

  if (!result.success) {
    return {
      error: 'Invalid input',
      details: result.error.flatten().fieldErrors,
    }
  }

  const supabase = await createClient()

  // Sign up the user
  const { data: authData, error: authError } = await supabase.auth.signUp({
    email: result.data.email,
    password: result.data.password,
    options: {
      data: {
        first_name: result.data.firstName,
        last_name: result.data.lastName,
        role: result.data.role,
      },
    },
  })

  if (authError) {
    return { error: authError.message }
  }

  // Optional: If you need to insert into a public.profiles table,
  // it is generally recommended to do this via a Supabase Auth Trigger (Database function).
  // However, since we are returning the response, the user can be notified.
  // The trigger can handle creating the row in `profiles` automatically.

  revalidatePath('/', 'layout')

  return { success: true, user: authData.user }
}
