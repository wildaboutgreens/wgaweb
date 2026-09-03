'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import { formatPrice } from '@/lib/format';

interface Order {
  id: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string | null;
  total_paise: number;
  payment_status: string;
  fulfillment_status: string;
  created_at: string;
}

interface OrderItem {
  product_name: string;
  variant_label: string;
  quantity: number;
  price_paise: number;
}

interface OrderDetail extends Order {
  delivery_address: string;
  delivery_pincode: string;
  razorpay_order_id: string | null;
  razorpay_payment_id: string | null;
  items: OrderItem[];
}

const statusColors: Record<string, string> = {
  paid: 'bg-green-50 text-green-700',
  pending: 'bg-yellow-50 text-yellow-700',
  failed: 'bg-red-50 text-red-700',
  unfulfilled: 'bg-yellow-50 text-yellow-700',
  fulfilled: 'bg-blue-50 text-blue-700',
  shipped: 'bg-purple-50 text-purple-700',
  delivered: 'bg-green-50 text-green-700',
};

export default function AdminOrdersPage() {
  const [orders, setOrders] = useState<Order[]>([]);
  const [paymentFilter, setPaymentFilter] = useState('');
  const [fulfillmentFilter, setFulfillmentFilter] = useState('');
  const [detail, setDetail] = useState<OrderDetail | null>(null);
  const [saving, setSaving] = useState(false);

  const loadOrders = async () => {
    const params = new URLSearchParams();
    if (paymentFilter) params.set('payment_status', paymentFilter);
    if (fulfillmentFilter) params.set('fulfillment_status', fulfillmentFilter);
    const res = await adminFetch(`/api/admin/orders?${params}`);
    if (res.ok) setOrders(await res.json());
  };

  useEffect(() => {
    loadOrders();
  }, [paymentFilter, fulfillmentFilter]);

  const openDetail = async (id: string) => {
    const res = await adminFetch(`/api/admin/orders/${id}`);
    if (res.ok) setDetail(await res.json());
  };

  const updateFulfillment = async (status: string) => {
    if (!detail) return;
    setSaving(true);
    const res = await adminFetch(`/api/admin/orders/${detail.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ fulfillment_status: status }),
    });
    if (res.ok) {
      const updated = await res.json();
      setDetail({ ...detail, fulfillment_status: updated.fulfillment_status });
      loadOrders();
    }
    setSaving(false);
  };

  if (detail) {
    return (
      <div>
        <button
          onClick={() => setDetail(null)}
          className="text-sm text-gray-500 hover:text-gray-700 mb-4"
        >
          &larr; Back to orders
        </button>
        <h1 className="text-2xl font-bold text-gray-900 mb-6">Order Detail</h1>

        <div className="bg-white rounded-xl border p-6 mb-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-sm mb-6">
            <div>
              <span className="text-gray-500">Customer:</span>
              <span className="ml-2 font-medium">{detail.customer_name}</span>
            </div>
            <div>
              <span className="text-gray-500">Phone:</span>
              <span className="ml-2">{detail.customer_phone}</span>
            </div>
            <div>
              <span className="text-gray-500">Email:</span>
              <span className="ml-2">{detail.customer_email || 'N/A'}</span>
            </div>
            <div>
              <span className="text-gray-500">Total:</span>
              <span className="ml-2 font-bold text-green-700">
                {formatPrice(detail.total_paise)}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Address:</span>
              <span className="ml-2">
                {detail.delivery_address}, {detail.delivery_pincode}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Payment:</span>
              <span
                className={`ml-2 text-xs font-medium px-2 py-1 rounded-full ${
                  statusColors[detail.payment_status] || 'bg-gray-100'
                }`}
              >
                {detail.payment_status}
              </span>
            </div>
            <div>
              <span className="text-gray-500">Created:</span>
              <span className="ml-2">{new Date(detail.created_at).toLocaleString()}</span>
            </div>
            {detail.razorpay_payment_id && (
              <div>
                <span className="text-gray-500">Razorpay ID:</span>
                <span className="ml-2 font-mono text-xs">{detail.razorpay_payment_id}</span>
              </div>
            )}
          </div>

          <div className="flex items-center gap-3 pt-4 border-t">
            <span className="text-sm text-gray-500">Fulfillment:</span>
            <select
              value={detail.fulfillment_status}
              onChange={(e) => updateFulfillment(e.target.value)}
              disabled={saving}
              className="px-3 py-2 border rounded-lg text-sm"
            >
              <option value="unfulfilled">Unfulfilled</option>
              <option value="fulfilled">Fulfilled</option>
              <option value="shipped">Shipped</option>
              <option value="delivered">Delivered</option>
            </select>
            {saving && <span className="text-xs text-gray-400">Saving...</span>}
          </div>
        </div>

        <div className="bg-white rounded-xl border p-6">
          <h2 className="font-bold text-gray-900 mb-3">Line Items</h2>
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b">
                <th className="pb-2">Product</th>
                <th className="pb-2">Variant</th>
                <th className="pb-2 text-right">Qty</th>
                <th className="pb-2 text-right">Price</th>
                <th className="pb-2 text-right">Subtotal</th>
              </tr>
            </thead>
            <tbody>
              {detail.items.map((item, i) => (
                <tr key={i} className="border-b last:border-0">
                  <td className="py-2">{item.product_name}</td>
                  <td className="py-2">{item.variant_label}</td>
                  <td className="py-2 text-right">{item.quantity}</td>
                  <td className="py-2 text-right">{formatPrice(item.price_paise)}</td>
                  <td className="py-2 text-right font-medium">
                    {formatPrice(item.price_paise * item.quantity)}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    );
  }

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Orders</h1>

      <div className="flex flex-wrap gap-3 mb-6">
        <select
          value={paymentFilter}
          onChange={(e) => setPaymentFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All payment statuses</option>
          <option value="paid">Paid</option>
          <option value="pending">Pending</option>
          <option value="failed">Failed</option>
        </select>
        <select
          value={fulfillmentFilter}
          onChange={(e) => setFulfillmentFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All fulfillment statuses</option>
          <option value="unfulfilled">Unfulfilled</option>
          <option value="fulfilled">Fulfilled</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      <div className="bg-white rounded-xl border overflow-hidden">
        <table className="w-full text-sm">
          <thead>
            <tr className="text-left text-gray-500 border-b bg-gray-50">
              <th className="px-4 py-3">Customer</th>
              <th className="px-4 py-3">Total</th>
              <th className="px-4 py-3">Payment</th>
              <th className="px-4 py-3">Fulfillment</th>
              <th className="px-4 py-3">Date</th>
              <th className="px-4 py-3"></th>
            </tr>
          </thead>
          <tbody>
            {orders.map((o) => (
              <tr
                key={o.id}
                className="border-b last:border-0 hover:bg-gray-50 cursor-pointer"
                onClick={() => openDetail(o.id)}
              >
                <td className="px-4 py-3 font-medium">{o.customer_name}</td>
                <td className="px-4 py-3">{formatPrice(o.total_paise)}</td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      statusColors[o.payment_status] || 'bg-gray-100'
                    }`}
                  >
                    {o.payment_status}
                  </span>
                </td>
                <td className="px-4 py-3">
                  <span
                    className={`text-xs font-medium px-2 py-1 rounded-full ${
                      statusColors[o.fulfillment_status] || 'bg-gray-100'
                    }`}
                  >
                    {o.fulfillment_status}
                  </span>
                </td>
                <td className="px-4 py-3 text-gray-500">
                  {new Date(o.created_at).toLocaleDateString()}
                </td>
                <td className="px-4 py-3 text-blue-600 text-sm">View</td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && <p className="p-6 text-center text-gray-400">No orders found</p>}
      </div>
    </div>
  );
}
