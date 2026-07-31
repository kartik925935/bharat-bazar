'use server'

import { createClient } from '@/lib/supabase/server'
import { revalidatePath } from 'next/cache'

export async function logout() {
  const supabase = await createClient()
  
  const { error } = await supabase.auth.signOut()
  
  if (error) {
    return { error: error.message }
  }

  revalidatePath('/', 'layout')
  
  return { success: true }
}
