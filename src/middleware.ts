import { updateSession } from '@/lib/supabase/middleware';
import { type NextRequest, NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

export async function middleware(request: NextRequest) {
  // First, update the session
  const response = await updateSession(request);
  const supabase = await createClient();
  const {
    data: { user },
  } = await supabase.auth.getUser();

  if (!user && !request.nextUrl.pathname.startsWith('/auth/')) return NextResponse.redirect(new URL('/auth/login', request.url));

  if (user && request.nextUrl.pathname.startsWith('/auth/')) return NextResponse.redirect(new URL('/', request.url));

  if (user && request.nextUrl.pathname.startsWith('/admin')) {
    const { data: adminUser } = await supabase.schema('ladder').from('admin_users').select('id').eq('user_id', user.id).single();
    if (!adminUser) return NextResponse.redirect(new URL('/', request.url));
  }

  /*
  // Check if the route is a sign up route
  if (request.nextUrl.pathname.startsWith('/auth/')) {
    if (user) return NextResponse.redirect(new URL('/', request.url));
  }

  // Check if the route is an admin route
  if (request.nextUrl.pathname.startsWith('/admin')) {
    const { data: adminUser } = await supabase.schema('ladder').from('admin_users').select('id').eq('user_id', user.id).single();
    if (!adminUser) return NextResponse.redirect(new URL('/', request.url));
  }
    */

  return response;
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
};
