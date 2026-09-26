import { Suspense } from 'react';
import ShippingAndReturnsClient from './ShippingAndReturnsClient';

export const metadata = {
  title: 'Shipping & Returns | Wild About Greens',
  description: 'Morning harvest delivery policies and 24-hour return & exchange guidelines for Wild About Greens.',
};

export default function ShippingAndReturnsPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-[#FAF6EF] pt-40 text-center text-sm text-[#151F19]/60">
          Loading shipping &amp; returns portal...
        </div>
      }
    >
      <ShippingAndReturnsClient />
    </Suspense>
  );
}
