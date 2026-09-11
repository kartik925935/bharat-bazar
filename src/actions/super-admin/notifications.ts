'use server'

import { createClient } from '@/lib/supabase/server'
import type { SANotification, NotificationType } from '@/types/super-admin.types'

// For this demo we're ignoring user_id for notifications so all Super Admins see the same system notifications.
// Alternatively, you could fetch where user_id = current_user.

export async function fetchNotificationsAction() {
  try {
    const supabase = await createClient()
    const { data, error } = await supabase
      .from('notifications')
      .select('*')
      .order('created_at', { ascending: false })

    if (error) throw error

    const formatted: SANotification[] = data.map((n: any) => ({
      id: n.id,
      title: n.title,
      body: n.body,
      type: n.type as NotificationType,
      priority: n.priority as any,
      isRead: n.is_read,
      readAt: n.read_at,
      createdAt: n.created_at,
      actionRoute: n.action_route || undefined,
      actionLabel: n.action_label || undefined,
      isDismissed: n.is_dismissed
    }))

    return { data: formatted, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export async function fetchNotificationPreferencesAction() {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { data, error } = await supabase
      .from('notification_preferences')
      .select('*')
      .eq('user_id', user.id)
      .single()

    if (error && error.code !== 'PGRST116') throw error // PGRST116 is not found

    if (!data) {
      return { data: {
        emailOnCritical: true,
        emailOnHigh: false,
        browserPushEnabled: false,
        mutedTypes: []
      }, error: null }
    }

    return { data: {
      emailOnCritical: data.email_on_critical,
      emailOnHigh: data.email_on_high,
      browserPushEnabled: data.browser_push_enabled,
      mutedTypes: data.muted_types
    }, error: null }
  } catch (error: any) {
    return { data: null, error: error.message }
  }
}

export async function updateNotificationPreferencesAction(prefs: any) {
  try {
    const supabase = await createClient()
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) throw new Error('Not authenticated')

    const { error } = await supabase
      .from('notification_preferences')
      .upsert({
        user_id: user.id,
        email_on_critical: prefs.emailOnCritical,
        email_on_high: prefs.emailOnHigh,
        browser_push_enabled: prefs.browserPushEnabled,
        muted_types: prefs.mutedTypes,
        updated_at: new Date().toISOString()
      })

    if (error) throw error
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function markNotificationReadAction(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('id', id)

    if (error) throw error
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function markAllNotificationsReadAction() {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('notifications')
      .update({ is_read: true, read_at: new Date().toISOString() })
      .eq('is_read', false)

    if (error) throw error
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}

export async function dismissNotificationAction(id: string) {
  try {
    const supabase = await createClient()
    const { error } = await supabase
      .from('notifications')
      .update({ is_dismissed: true })
      .eq('id', id)

    if (error) throw error
    return { success: true, error: null }
  } catch (error: any) {
    return { success: false, error: error.message }
  }
}
