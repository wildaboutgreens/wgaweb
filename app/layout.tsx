import type { Metadata } from 'next';
import './globals.css';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import CartDrawer from '@/components/CartDrawer';

export const metadata: Metadata = {
  title: 'Wild About Greens · Living Microgreens Delivered Fresh',
  description:
    'Grown locally on vertical indoor racks across Chandigarh, Mohali & Panchkula. Pure mineral water, non GMO seeds, zero pesticides. Cut to order.',
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
