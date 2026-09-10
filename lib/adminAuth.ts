'use client';

import { useEffect, useState } from 'react';
import { useRouter, usePathname } from 'next/navigation';

/**
 * Client-side admin auth check. Calls /api/admin/stats to verify
 * the admin_token cookie is still valid. If not, redirects to /{panelKey}/login.
 */
export function useAdminAuth(panelKey?: string) {
  const router = useRouter();
  const pathname = usePathname();
  const [isAuthed, setIsAuthed] = useState(false);
  const [loading, setLoading] = useState(true);

  // Derive panelKey from pathname if not provided explicitly (e.g. /my-secret-slug/products)
  const currentKey = panelKey || pathname.split('/').filter(Boolean)[0] || 'admin';
  const loginPath = `/${currentKey}/login`;

  useEffect(() => {
    // Don't check auth on the login page itself
    if (pathname.endsWith('/login')) {
      setLoading(false);
      return;
    }

    fetch('/api/admin/stats', { credentials: 'include' })
      .then((res) => {
        if (res.ok) {
          setIsAuthed(true);
        } else {
          router.replace(loginPath);
        }
      })
      .catch(() => {
        router.replace(loginPath);
      })
      .finally(() => setLoading(false));
  }, [pathname, router, loginPath]);

  return { isAuthed, loading };
}

/** Wrapper for admin fetch calls — returns the response or redirects on 401 */
export async function adminFetch(url: string, options?: RequestInit): Promise<Response> {
  const res = await fetch(url, { ...options, credentials: 'include' });
  if (res.status === 401 && typeof window !== 'undefined') {
    const segments = window.location.pathname.split('/').filter(Boolean);
    const currentKey = segments[0] || 'admin';
    window.location.href = `/${currentKey}/login`;
  }
  return res;
}

const KNOWN_PUBLIC_PREFIXES = [
  '/products',
  '/cart',
  '/checkout',
  '/order-confirmation',
  '/track-order',
  '/our-story',
  '/blog',
  '/recipe-khazana',
];

const ADMIN_SUBPAGES = [
  'products',
  'orders',
  'content',
  'pins',
  'blog',
  'carousel',
  'inquiries',
  'login',
];

export function isAdminPath(pathname: string | null): boolean {
  if (!pathname) return false;
  if (pathname === '/') return false;

  const adminSlug = process.env.NEXT_PUBLIC_ADMIN_PANEL_SLUG;
  if (adminSlug && (pathname === `/${adminSlug}` || pathname.startsWith(`/${adminSlug}/`))) {
    return true;
  }
  if (pathname === '/admin' || pathname.startsWith('/admin/')) {
    return true;
  }

  // If matches known public prefixes, definitely not admin
  if (KNOWN_PUBLIC_PREFIXES.some((prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`))) {
    return false;
  }

  // Any non-public first segment that ends with an admin subpage
  const segments = pathname.split('/').filter(Boolean);
  if (segments.length >= 1 && ADMIN_SUBPAGES.includes(segments[segments.length - 1])) {
    return true;
  }

  return false;
}
