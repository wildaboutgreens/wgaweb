import { notFound } from 'next/navigation';
import AdminLayoutClient from './AdminLayoutClient';

export const dynamic = 'force-dynamic';

export default function DynamicPanelLayout({
  children,
  params,
}: {
  children: React.ReactNode;
  params: { panelKey: string };
}) {
  const secretSlug = process.env.ADMIN_PANEL_SLUG;

  // If ADMIN_PANEL_SLUG is not configured or does not match exactly,
  // return a standard 404 with no indication that an admin panel exists.
  if (!secretSlug || params.panelKey !== secretSlug) {
    notFound();
  }

  return <AdminLayoutClient panelKey={params.panelKey}>{children}</AdminLayoutClient>;
}
