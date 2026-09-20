'use client';

import Link from 'next/link';
import { usePathname, useRouter, useParams } from 'next/navigation';
import { useAdminAuth } from '@/lib/adminAuth';

export default function AdminLayoutClient({
  children,
  panelKey,
}: {
  children: React.ReactNode;
  panelKey?: string;
}) {
  const pathname = usePathname();
  const router = useRouter();
  const params = useParams();
  const currentKey = (params?.panelKey as string) || panelKey || 'admin';
  const { isAuthed, loading } = useAdminAuth(currentKey);

  const navItems = [
    { href: `/${currentKey}`, label: 'Dashboard', icon: '📊' },
    { href: `/${currentKey}/products`, label: 'Products', icon: '🌱' },
    { href: `/${currentKey}/orders`, label: 'Orders', icon: '📦' },
    { href: `/${currentKey}/reviews`, label: 'Reviews', icon: '⭐' },
    { href: `/${currentKey}/content`, label: 'Content', icon: '✏️' },
    { href: `/${currentKey}/pins`, label: 'Pins', icon: '📌' },
    { href: `/${currentKey}/blog`, label: 'Blog', icon: '📝' },
    { href: `/${currentKey}/carousel`, label: 'Carousel', icon: '🎠' },
    { href: `/${currentKey}/inquiries`, label: 'Inquiries', icon: '💬' },
  ];

  // Login page: no sidebar, no auth check blocking
  if (pathname === `/${currentKey}/login` || pathname.endsWith('/login')) {
    return <>{children}</>;
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <p className="text-gray-500">Loading...</p>
      </div>
    );
  }

  if (!isAuthed) return null;

  const handleLogout = () => {
    document.cookie = 'admin_token=; path=/; max-age=0';
    router.push(`/${currentKey}/login`);
  };

  return (
    <div className="min-h-screen flex bg-gray-50 admin-panel-root">
      {/* Sidebar */}
      <aside className="w-64 bg-gray-900 text-white flex flex-col shrink-0">
        <div className="p-4 border-b border-gray-700">
          <Link href={`/${currentKey}`} className="text-lg font-bold">
            🌱 WGA Admin
          </Link>
        </div>
        <nav className="flex-1 p-3 space-y-1">
          {navItems.map((item) => {
            const isActive =
              item.href === `/${currentKey}`
                ? pathname === `/${currentKey}`
                : pathname.startsWith(item.href);
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive
                    ? 'bg-gray-700 text-white'
                    : 'text-gray-400 hover:text-white hover:bg-gray-800'
                }`}
              >
                <span>{item.icon}</span>
                {item.label}
              </Link>
            );
          })}
        </nav>
        <div className="p-3 border-t border-gray-700 space-y-1">
          <Link
            href="/"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800"
          >
            <span>🌐</span> View Site
          </Link>
          <button
            onClick={handleLogout}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-sm text-gray-400 hover:text-white hover:bg-gray-800 w-full text-left"
          >
            <span>🚪</span> Logout
          </button>
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 overflow-auto">
        <div className="p-6 max-w-6xl">{children}</div>
      </main>
    </div>
  );
}
