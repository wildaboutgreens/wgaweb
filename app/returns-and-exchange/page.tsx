import { redirect } from 'next/navigation';

export const metadata = {
  title: 'Returns & Exchanges | Wild About Greens',
  description: 'Submit an exchange or return request for your living microgreens order.',
};

export default function ReturnsAndExchangePage() {
  redirect('/shipping-and-returns');
}
