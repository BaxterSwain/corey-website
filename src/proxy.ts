import { NextRequest, NextResponse } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET || 'corey-site-secret-change-in-production'
);

async function verifyJWT(token: string) {
  try {
    const { payload } = await jwtVerify(token, JWT_SECRET);
    return payload as { userId: number; email: string };
  } catch {
    return null;
  }
}

const COOKIE_NAME = 'corey-auth';

export const config = {
  matcher: [
    '/admin/:path*',
    '/api/content/:path*',
    '/api/highlights/:path*',
    '/api/gallery/:path*',
    '/api/stats/:path*',
    '/api/contacts/:path*',
    '/api/media/:path*',
  ],
};

export default async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Allow /admin/login without auth
  if (pathname === '/admin/login') {
    return NextResponse.next();
  }

  // Allow POST to /api/contacts without auth (public contact form)
  if (pathname === '/api/contacts' && request.method === 'POST') {
    return NextResponse.next();
  }

  // Everything else requires auth
  const token = request.cookies.get(COOKIE_NAME)?.value;
  if (!token) {
    // API routes return 401 JSON
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    // Admin pages redirect to login
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  const user = await verifyJWT(token);
  if (!user) {
    if (pathname.startsWith('/api/')) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }
    const loginUrl = new URL('/admin/login', request.url);
    return NextResponse.redirect(loginUrl);
  }

  return NextResponse.next();
}
