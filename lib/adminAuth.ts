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
