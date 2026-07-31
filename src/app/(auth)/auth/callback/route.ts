import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;

      // For OAuth users, ensure a profile & role exist.
      // The database trigger should handle this, but we add a safety-net
      // in case the trigger hasn't been applied yet.
      const { data: profile } = await supabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      if (!profile) {
        const fullName =
          user.user_metadata?.full_name ||
          user.user_metadata?.name ||
          [user.user_metadata?.first_name, user.user_metadata?.last_name]
            .filter(Boolean)
            .join(' ') ||
          user.email?.split('@')[0] ||
          'User';

        await supabase.from('profiles').insert({
          id: user.id,
          full_name: fullName,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          status: 'active',
        });

        // Assign default 'customer' role
        const { data: customerRole } = await supabase
          .from('roles')
          .select('id')
          .eq('name', 'customer')
          .maybeSingle();

        if (customerRole) {
          await supabase.from('user_roles').insert({
            user_id: user.id,
            role_id: customerRole.id,
          });
        }
      }

      const forwardedHost = request.headers.get('x-forwarded-host');
      const isLocalEnv = process.env.NODE_ENV === 'development';
      if (isLocalEnv) {
        return NextResponse.redirect(`${origin}${next}`);
      } else if (forwardedHost) {
        return NextResponse.redirect(`https://${forwardedHost}${next}`);
      } else {
        return NextResponse.redirect(`${origin}${next}`);
      }
    }
  }

  // Redirect back to login with error parameter
  return NextResponse.redirect(`${origin}/login?error=auth-code-error`);
}
