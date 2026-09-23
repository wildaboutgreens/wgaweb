import { redirect } from 'next/navigation';

export default function CartContentRedirect({
  params,
}: {
  params: { panelKey: string };
}) {
  redirect(`/${params.panelKey}/content?tab=cart-drawer`);
}
