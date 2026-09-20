import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'https://wildaboutgreens.com';

export const metadata: Metadata = {
  title: 'Wild About Greens · Living Microgreens Delivered Fresh',
  description:
    'Grown locally on vertical indoor racks across Chandigarh, Mohali & Panchkula. Pure mineral water, non GMO seeds, zero pesticides. Cut to order.',
  openGraph: {
    type: 'website',
    siteName: 'Wild About Greens',
    title: 'Wild About Greens · Living Microgreens Delivered Fresh',
    description: 'Grown locally on vertical indoor racks across Chandigarh, Mohali & Panchkula. Pure mineral water, non GMO seeds, zero pesticides. Cut to order.',
    url: siteUrl,
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Wild About Greens · Living Microgreens Delivered Fresh',
    description: 'Grown locally on vertical indoor racks across Chandigarh, Mohali & Panchkula. Pure mineral water, non GMO seeds, zero pesticides.',
  },
  icons: {
    icon: [
      { url: '/favicon.ico', sizes: 'any' },
      { url: '/favicon.png', type: 'image/png' },
    ],
    apple: [
      { url: '/apple-touch-icon.png', sizes: '180x180', type: 'image/png' },
    ],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className="min-h-screen flex flex-col font-sans bg-[#F3EEE0] text-[#151F19] antialiased">
        <Header />
        <CartDrawer />
        <div className="flex-1">{children}</div>
        <Footer />
      </body>
    </html>
  );
}
