'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import { downloadCSV } from '@/lib/csvExport';

interface ReturnRequest {
  id: string;
  ticket_number: string;
  order_id: string | null;
  order_number: string;
  customer_name: string;
  customer_phone: string;
  customer_email: string;
  request_type: 'return' | 'exchange';
  reason: string;
  status: 'pending' | 'approved' | 'rejected' | 'completed';
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}

const statusColors: Record<string, string> = {
  pending: 'bg-yellow-50 text-yellow-800 border-yellow-200',
  approved: 'bg-emerald-50 text-emerald-800 border-emerald-200',
  rejected: 'bg-red-50 text-red-700 border-red-200',
  completed: 'bg-blue-50 text-blue-700 border-blue-200',
};

export default function AdminReturnsPage() {
  const [tickets, setTickets] = useState<ReturnRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [statusFilter, setStatusFilter] = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedTicket, setSelectedTicket] = useState<ReturnRequest | null>(null);
  const [updatingId, setUpdatingId] = useState<string | null>(null);
  const [adminNoteInput, setAdminNoteInput] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadTickets = useCallback(async () => {
    setLoading(true);
    const url = statusFilter ? `/api/admin/returns?status=${statusFilter}` : '/api/admin/returns';
    const res = await adminFetch(url);
    if (res.ok) {
      setTickets(await res.json());
    }
    setLoading(false);
  }, [statusFilter]);

  useEffect(() => {
    loadTickets();
  }, [loadTickets]);

  const handleStatusChange = async (id: string, newStatus: string) => {
    setUpdatingId(id);
    const res = await adminFetch(`/api/admin/returns/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ status: newStatus }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTickets((prev) => prev.map((t) => (t.id === id ? { ...t, status: updated.status } : t)));
      if (selectedTicket && selectedTicket.id === id) {
        setSelectedTicket({ ...selectedTicket, status: updated.status });
      }
    }
    setUpdatingId(null);
  };

  const handleSaveNotes = async () => {
    if (!selectedTicket) return;
    setUpdatingId(selectedTicket.id);
    const res = await adminFetch(`/api/admin/returns/${selectedTicket.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ admin_notes: adminNoteInput }),
    });

    if (res.ok) {
      const updated = await res.json();
      setTickets((prev) =>
        prev.map((t) => (t.id === selectedTicket.id ? { ...t, admin_notes: updated.admin_notes } : t))
      );
      setSelectedTicket({ ...selectedTicket, admin_notes: updated.admin_notes });
    }
    setUpdatingId(null);
  };

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredTickets = tickets.filter((t) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return (
      t.ticket_number.toLowerCase().includes(q) ||
      t.order_number.toLowerCase().includes(q) ||
      (t.customer_name && t.customer_name.toLowerCase().includes(q)) ||
      t.customer_phone.includes(q) ||
      t.customer_email.toLowerCase().includes(q) ||
      t.reason.toLowerCase().includes(q)
    );
  });

  const handleExportCSV = () => {
    const headers = [
      'Ticket Number',
      'Order Number',
      'Customer Name',
      'Customer Phone',
      'Customer Email',
      'Request Type',
      'Reason',
      'Status',
      'Admin Notes',
      'Date & Time',
    ];

    const rows = filteredTickets.map((t) => [
      t.ticket_number,
      t.order_number,
      t.customer_name,
      t.customer_phone,
      t.customer_email,
      t.request_type,
      t.reason,
      t.status,
      t.admin_notes || '',
      new Date(t.created_at).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }),
    ]);

    downloadCSV('wga-return-exchange-requests.csv', [headers, ...rows]);
  };

  return (
    <div>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Return &amp; Exchange Requests</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {filteredTickets.length} {filteredTickets.length === 1 ? 'ticket' : 'tickets'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Review and resolve customer exchange and refund claims.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={filteredTickets.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>📥</span>
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Filter and Search Bar */}
      <div className="flex flex-col sm:flex-row gap-3 mb-6">
        <div className="flex-1 relative">
          <input
            type="text"
            placeholder="Search by Ticket #, Order #, Name, Phone, Email, Reason..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border rounded-lg text-sm outline-none focus:ring-2 focus:ring-[#1C3F2D] focus:border-[#1C3F2D] bg-white"
          />
          <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          {searchQuery && (
            <button
              onClick={() => setSearchQuery('')}
              className="absolute right-3 top-2.5 text-xs text-gray-400 hover:text-gray-600"
            >
              ✕
            </button>
          )}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="px-3 py-2 border rounded-lg text-sm bg-white font-medium text-gray-700"
        >
          <option value="">All Statuses</option>
          <option value="pending">Pending</option>
          <option value="approved">Approved</option>
          <option value="rejected">Rejected</option>
          <option value="completed">Completed</option>
        </select>
      </div>

      {/* Table Container */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50/80 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">Ticket ID</th>
                <th className="px-4 py-3">Order #</th>
                <th className="px-4 py-3">Customer</th>
                <th className="px-4 py-3">Type</th>
                <th className="px-4 py-3">Reason Preview</th>
                <th className="px-4 py-3">Status</th>
                <th className="px-4 py-3">Date &amp; Time</th>
                <th className="px-4 py-3 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredTickets.map((t) => (
                <tr
                  key={t.id}
                  className="hover:bg-gray-50/80 transition-colors"
                >
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-1.5">
                      <span className="font-mono font-bold text-xs text-[#122A1F]">
                        {t.ticket_number}
                      </span>
                      <button
                        type="button"
                        onClick={() => handleCopy(t.ticket_number, t.id)}
                        className="text-[10px] text-gray-400 hover:text-gray-700 p-0.5 rounded"
                        title="Copy Ticket ID"
                      >
                        {copiedId === t.id ? '✓' : '📋'}
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="font-mono font-medium text-xs text-emerald-800 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-100">
                      {t.order_number}
                    </span>
                  </td>

                  <td className="px-4 py-3.5">
                    <div>
                      <div className="font-medium text-gray-900">{t.customer_name || 'Customer'}</div>
                      <div className="text-xs text-gray-500 flex flex-wrap gap-x-2">
                        <span className="font-mono">{t.customer_phone}</span>
                        <span>&middot;</span>
                        <span>{t.customer_email}</span>
                      </div>
                    </div>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <span
                      className={`text-xs font-semibold px-2 py-0.5 rounded-md inline-flex items-center gap-1 ${
                        t.request_type === 'exchange'
                          ? 'bg-blue-50 text-blue-700 border border-blue-200'
                          : 'bg-purple-50 text-purple-700 border border-purple-200'
                      }`}
                    >
                      <span>{t.request_type === 'exchange' ? '🔄' : '↩️'}</span>
                      <span className="capitalize">{t.request_type}</span>
                    </span>
                  </td>

                  <td className="px-4 py-3.5 max-w-xs">
                    <p className="text-xs text-gray-600 line-clamp-2" title={t.reason}>
                      {t.reason}
                    </p>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap">
                    <select
                      value={t.status}
                      disabled={updatingId === t.id}
                      onChange={(e) => handleStatusChange(t.id, e.target.value)}
                      className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer outline-none transition-colors ${
                        statusColors[t.status] || 'bg-gray-100 text-gray-700'
                      }`}
                    >
                      <option value="pending">⏳ Pending</option>
                      <option value="approved">✓ Approved</option>
                      <option value="rejected">✕ Rejected</option>
                      <option value="completed">🎉 Completed</option>
                    </select>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-600">
                    <div>
                      {new Date(t.created_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">
                      {new Date(t.created_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        hour12: true,
                      })}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <button
                      type="button"
                      onClick={() => {
                        setSelectedTicket(t);
                        setAdminNoteInput(t.admin_notes || '');
                      }}
                      className="text-xs font-semibold text-emerald-800 hover:text-emerald-950 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 px-3 py-1.5 rounded-lg transition-colors cursor-pointer"
                    >
                      Inspect Details →
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading return requests...
          </div>
        )}

        {!loading && filteredTickets.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">
            {searchQuery
              ? `No return requests matching "${searchQuery}"`
              : 'No return or exchange requests found.'}
          </div>
        )}
      </div>

      {/* Ticket Details Modal */}
      {selectedTicket && (
        <div className="fixed inset-0 z-50 bg-black/40 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl border border-gray-200 shadow-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto p-6 sm:p-7 animate-fadeIn">
            <div className="flex items-center justify-between pb-4 border-b border-gray-100">
              <div>
                <span className="text-xs font-bold uppercase tracking-wider text-gray-400">
                  Ticket Details
                </span>
                <h3 className="font-mono text-xl font-bold text-gray-900 mt-0.5">
                  {selectedTicket.ticket_number}
                </h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedTicket(null)}
                className="w-8 h-8 rounded-full bg-gray-100 hover:bg-gray-200 flex items-center justify-center text-gray-500 font-bold transition-colors"
              >
                ✕
              </button>
            </div>

            <div className="py-4 space-y-4 text-sm">
              <div className="grid grid-cols-2 gap-3 bg-gray-50 p-4 rounded-xl border border-gray-100 text-xs">
                <div>
                  <span className="text-gray-400 block">Order Number</span>
                  <span className="font-mono font-bold text-emerald-900 text-sm">
                    {selectedTicket.order_number}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Request Type</span>
                  <span className="capitalize font-semibold text-gray-800 text-sm">
                    {selectedTicket.request_type === 'exchange' ? '🔄 Fresh Exchange' : '↩️ Return & Refund'}
                  </span>
                </div>
                <div>
                  <span className="text-gray-400 block">Customer Name</span>
                  <span className="font-medium text-gray-800">{selectedTicket.customer_name}</span>
                </div>
                <div>
                  <span className="text-gray-400 block">Phone</span>
                  <span className="font-mono text-gray-800">{selectedTicket.customer_phone}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block">Email</span>
                  <span className="text-gray-800">{selectedTicket.customer_email}</span>
                </div>
                <div className="col-span-2">
                  <span className="text-gray-400 block">Exact Creation Time</span>
                  <span className="text-gray-800 font-medium">
                    {new Date(selectedTicket.created_at).toLocaleString('en-IN', {
                      dateStyle: 'full',
                      timeStyle: 'medium',
                    })}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Customer Reason Description
                </label>
                <div className="p-3.5 bg-amber-50/50 rounded-xl border border-amber-200/80 text-xs sm:text-sm text-gray-800 whitespace-pre-wrap leading-relaxed">
                  {selectedTicket.reason}
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold uppercase tracking-wider text-gray-500 mb-1">
                  Admin Resolution Notes
                </label>
                <textarea
                  rows={3}
                  value={adminNoteInput}
                  onChange={(e) => setAdminNoteInput(e.target.value)}
                  placeholder="e.g. Replacement tray added to Morning dispatch; replacement tracking sent via email..."
                  className="w-full p-3 border rounded-xl text-xs sm:text-sm outline-none focus:ring-2 focus:ring-[#1C3F2D] resize-none"
                />
              </div>

              <div className="flex items-center justify-between pt-2">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-medium text-gray-600">Status:</span>
                  <select
                    value={selectedTicket.status}
                    onChange={(e) => handleStatusChange(selectedTicket.id, e.target.value)}
                    disabled={updatingId === selectedTicket.id}
                    className={`text-xs font-semibold px-2.5 py-1 rounded-full border cursor-pointer outline-none ${
                      statusColors[selectedTicket.status] || 'bg-gray-100'
                    }`}
                  >
                    <option value="pending">⏳ Pending</option>
                    <option value="approved">✓ Approved</option>
                    <option value="rejected">✕ Rejected</option>
                    <option value="completed">🎉 Completed</option>
                  </select>
                </div>

                <button
                  type="button"
                  onClick={handleSaveNotes}
                  disabled={updatingId === selectedTicket.id}
                  className="px-4 py-2 rounded-lg bg-[#1C3F2D] hover:bg-[#122A1F] text-white text-xs font-semibold disabled:opacity-50 transition-colors shadow-xs"
                >
                  {updatingId === selectedTicket.id ? 'Saving...' : 'Save Notes'}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
