import { NextRequest, NextResponse } from 'next/server';

export function middleware(req) {
  const url = req.nextUrl.clone();
  const password = process.env.SITE_PASSWORD;
  const cookie = req.cookies.get('auth')?.value;

  const isPublic = url.pathname.startsWith('/login') || url.pathname.startsWith('/api') || url.pathname.startsWith('/favicon') || url.pathname.includes('.');

  if (cookie === password || isPublic) {
    return NextResponse.next();
  }

  // Redirect to /login if not authorized
  url.pathname = '/login.html';
  return NextResponse.redirect(url);
}
