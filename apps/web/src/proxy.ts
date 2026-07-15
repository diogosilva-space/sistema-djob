import { NextRequest, NextResponse } from 'next/server';

function getRole(token: string | undefined): string | undefined {
  if (!token) return undefined;

  try {
    const payload = token.split('.')[1];
    if (!payload) return undefined;

    const normalizedPayload = payload.replace(/-/g, '+').replace(/_/g, '/');
    const decoded = atob(
      normalizedPayload.padEnd(Math.ceil(normalizedPayload.length / 4) * 4, '='),
    );
    return (JSON.parse(decoded) as { role?: string }).role;
  } catch {
    return undefined;
  }
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const role = getRole(request.cookies.get('djob_token')?.value);

  if (!role) {
    return NextResponse.redirect(new URL('/auth/login', request.url));
  }

  const isAdminRoute = pathname.startsWith('/admin');
  const isSuperAdmin = role === 'SUPER_ADMIN';

  if (isAdminRoute && !isSuperAdmin) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  if (!isAdminRoute && isSuperAdmin) {
    return NextResponse.redirect(new URL('/admin/tenants', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/dashboard/:path*',
    '/contacts/:path*',
    '/crm/:path*',
    '/products/:path*',
    '/vendas/:path*',
    '/pcp/:path*',
    '/estoque/:path*',
    '/compras/:path*',
    '/rh/:path*',
    '/logistica/:path*',
    '/financeiro/:path*',
  ],
};
