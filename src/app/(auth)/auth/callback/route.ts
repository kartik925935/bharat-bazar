import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { createAdminClient } from '@/lib/supabase/admin';

export async function GET(request: Request) {
  const { searchParams, origin } = new URL(request.url);
  const code = searchParams.get('code');
  const next = searchParams.get('next') ?? '/dashboard';
  const roleParam = searchParams.get('role');

  if (code) {
    const supabase = await createClient();
    const { data, error } = await supabase.auth.exchangeCodeForSession(code);

    if (!error && data.user) {
      const user = data.user;
      const adminSupabase = createAdminClient();

      // Ensure profile exists
      const { data: profile } = await adminSupabase
        .from('profiles')
        .select('id')
        .eq('id', user.id)
        .maybeSingle();

      const fullName =
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        [user.user_metadata?.first_name, user.user_metadata?.last_name]
          .filter(Boolean)
          .join(' ') ||
        user.email?.split('@')[0] ||
        'User';

      if (!profile) {
        await adminSupabase.from('profiles').insert({
          id: user.id,
          full_name: fullName,
          avatar_url: user.user_metadata?.avatar_url || user.user_metadata?.picture,
          status: 'active',
        });
      }

      // Check if user should be a seller
      if (roleParam === 'seller') {
        const { data: existingSeller } = await adminSupabase
          .from('sellers')
          .select('id')
          .eq('user_id', user.id)
          .maybeSingle();

        if (existingSeller) {
          // If seller already exists, ensure they have the seller role and go to dashboard
          const { data: sellerRole } = await adminSupabase
            .from('roles')
            .select('id')
            .eq('name', 'seller')
            .maybeSingle();

          if (sellerRole) {
            // Delete standard customer role mapping if any
            const { data: customerRole } = await adminSupabase
              .from('roles')
              .select('id')
              .eq('name', 'customer')
              .maybeSingle();

            if (customerRole) {
              await adminSupabase
                .from('user_roles')
                .delete()
                .eq('user_id', user.id)
                .eq('role_id', customerRole.id);
            }

            await adminSupabase.from('user_roles').insert({
              user_id: user.id,
              role_id: sellerRole.id,
            });
          }

          const forwardedHost = request.headers.get('x-forwarded-host');
          const isLocalEnv = process.env.NODE_ENV === 'development';
          if (isLocalEnv) {
            return NextResponse.redirect(`${origin}/seller-dashboard`);
          } else if (forwardedHost) {
            return NextResponse.redirect(`https://${forwardedHost}/seller-dashboard`);
          } else {
            return NextResponse.redirect(`${origin}/seller-dashboard`);
          }
        } else {
          // If seller does not exist, redirect to registration with name and email parameters
          const forwardedHost = request.headers.get('x-forwarded-host');
          const redirectUrl = `/seller-register?email=${encodeURIComponent(user.email || '')}&name=${encodeURIComponent(fullName)}`;
          const isLocalEnv = process.env.NODE_ENV === 'development';
          if (isLocalEnv) {
            return NextResponse.redirect(`${origin}${redirectUrl}`);
          } else if (forwardedHost) {
            return NextResponse.redirect(`https://${forwardedHost}${redirectUrl}`);
          } else {
            return NextResponse.redirect(`${origin}${redirectUrl}`);
          }
        }
      } else {
        // Ensure default customer role exists if not a seller
        const { data: userRoles } = await adminSupabase
          .from('user_roles')
          .select('roles(name)')
          .eq('user_id', user.id);

        const hasAnyRole = userRoles && userRoles.length > 0;
        if (!hasAnyRole) {
          const { data: customerRole } = await adminSupabase
            .from('roles')
            .select('id')
            .eq('name', 'customer')
            .maybeSingle();

          if (customerRole) {
            await adminSupabase.from('user_roles').insert({
              user_id: user.id,
              role_id: customerRole.id,
            });
          }
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
