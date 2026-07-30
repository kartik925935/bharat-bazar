'use server'

import { createClient } from '@/lib/supabase/server'
import { requireRole } from '../auth/session'
import { inventorySchema, InventoryInput } from './validations'
import { revalidatePath } from 'next/cache'

export async function updateInventory(data: InventoryInput) {
  const { authorized, user } = await requireRole(['super admin', 'admin', 'seller'])
  if (!authorized || !user) return { error: 'Unauthorized' }

  const result = inventorySchema.safeParse(data)
  if (!result.success) return { error: 'Invalid input', details: result.error.flatten().fieldErrors }

  const supabase = await createClient()

  // Upsert inventory record
  const { data: inventory, error } = await supabase
    .from('inventory')
    .upsert({ 
      product_id: result.data.productId,
      quantity: result.data.quantity,
      sku: result.data.sku
    }, { onConflict: 'product_id' })
    .select()
    .single()

  if (error) return { error: error.message }

  revalidatePath('/inventory')
  return { success: true, data: inventory }
}

export async function getInventory(productId: string) {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('inventory')
    .select('*')
    .eq('product_id', productId)
    .single()

  if (error) return { error: error.message }

  return { success: true, data }
}
