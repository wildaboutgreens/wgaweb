'use client';

import { useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';

interface Inquiry {
  id: string;
  restaurant_name: string;
  contact_person: string;
  phone: string;
  email: string | null;
  message: string | null;
  status: string;
  created_at: string;
}

const statusColors: Record<string, string> = {
  new: 'bg-blue-50 text-blue-700',
  contacted: 'bg-yellow-50 text-yellow-700',
  closed: 'bg-gray-100 text-gray-500',
};

export default function AdminInquiriesPage() {
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [filter, setFilter] = useState('');

  const loadInquiries = async () => {
    const url = filter ? `/api/admin/inquiries?status=${filter}` : '/api/admin/inquiries';
    const res = await adminFetch(url);
    if (res.ok) setInquiries(await res.json());
  };

  useEffect(() => {
    loadInquiries();
  }, [filter]);

  const updateStatus = async (id: string, status: string) => {
    await adminFetch(`/api/admin/inquiries/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status }),
    });
    loadInquiries();
  };

  return (
    <div>
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Inquiries</h1>

      <div className="mb-6">
        <select
          value={filter}
          onChange={(e) => setFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm"
        >
          <option value="">All statuses</option>
          <option value="new">New</option>
          <option value="contacted">Contacted</option>
          <option value="closed">Closed</option>
        </select>
      </div>

      <div className="space-y-4">
        {inquiries.map((inq) => (
          <div key={inq.id} className="bg-white rounded-xl border p-5">
            <div className="flex items-start justify-between mb-3">
              <div>
                <h3 className="font-bold text-gray-900">{inq.restaurant_name}</h3>
                <p className="text-sm text-gray-500">
                  {inq.contact_person} &middot; {inq.phone}
                  {inq.email ? ` \u00b7 ${inq.email}` : ''}
                </p>
              </div>
              <span
                className={`text-xs font-medium px-2 py-1 rounded-full ${
                  statusColors[inq.status] || 'bg-gray-100'
                }`}
              >
                {inq.status}
              </span>
            </div>
            {inq.message && <p className="text-sm text-gray-600 mb-3">{inq.message}</p>}
            <div className="flex items-center justify-between">
              <span className="text-xs text-gray-400">
                {new Date(inq.created_at).toLocaleString()}
              </span>
              <select
                value={inq.status}
                onChange={(e) => updateStatus(inq.id, e.target.value)}
                className="px-2 py-1 border rounded text-sm"
              >
                <option value="new">New</option>
                <option value="contacted">Contacted</option>
                <option value="closed">Closed</option>
              </select>
            </div>
          </div>
        ))}
        {inquiries.length === 0 && (
          <p className="text-center text-gray-400 py-8">No inquiries found</p>
        )}
      </div>
    </div>
  );
}
