'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminFetch } from '@/lib/adminAuth';
import { downloadCSV } from '@/lib/csvExport';

interface Subscriber {
  id: string;
  email: string;
  source: string | null;
  subscribed_at: string;
}

export default function AdminNewsletterPage() {
  const [subscribers, setSubscribers] = useState<Subscriber[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const loadSubscribers = useCallback(async () => {
    setLoading(true);
    const res = await adminFetch('/api/admin/newsletter');
    if (res.ok) {
      setSubscribers(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    loadSubscribers();
  }, [loadSubscribers]);

  const handleCopy = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filteredSubscribers = subscribers.filter((sub) => {
    if (!searchQuery.trim()) return true;
    const q = searchQuery.toLowerCase().trim();
    return sub.email.toLowerCase().includes(q) || sub.id.toLowerCase().includes(q);
  });

  const handleExportCSV = () => {
    const headers = ['Subscriber ID', 'Email Address', 'Signup Source', 'Subscribed Date & Time'];
    const rows = filteredSubscribers.map((sub) => [
      sub.id,
      sub.email,
      sub.source || 'Website',
      new Date(sub.subscribed_at).toLocaleString('en-IN', {
        dateStyle: 'medium',
        timeStyle: 'medium',
      }),
    ]);

    downloadCSV('wga-newsletter-subscribers.csv', [headers, ...rows]);
  };

  return (
    <div>
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-6">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold text-gray-900">Newsletter Subscribers</h1>
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-100 text-emerald-800">
              {filteredSubscribers.length} {filteredSubscribers.length === 1 ? 'subscriber' : 'subscribers'}
            </span>
          </div>
          <p className="text-sm text-gray-500 mt-1">
            Registered subscribers opted in for microgreen harvest updates and seasonal offers.
          </p>
        </div>

        <button
          type="button"
          onClick={handleExportCSV}
          disabled={filteredSubscribers.length === 0}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-emerald-800 hover:bg-emerald-900 disabled:opacity-50 text-white text-xs font-semibold shadow-xs transition-colors cursor-pointer self-start sm:self-auto"
        >
          <span>📥</span>
          <span>Export to CSV</span>
        </button>
      </div>

      {/* Search Input */}
      <div className="mb-6 relative max-w-md">
        <input
          type="text"
          placeholder="Search by Email or Subscriber ID..."
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

      {/* Table */}
      <div className="bg-white rounded-xl border border-gray-200 overflow-hidden shadow-xs">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="text-left text-gray-500 border-b bg-gray-50/80 text-xs font-semibold uppercase tracking-wider">
                <th className="px-4 py-3">Subscriber ID</th>
                <th className="px-4 py-3">Email Address</th>
                <th className="px-4 py-3">Source</th>
                <th className="px-4 py-3">Subscribed Time</th>
                <th className="px-4 py-3 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredSubscribers.map((sub) => (
                <tr key={sub.id} className="hover:bg-gray-50/80 transition-colors">
                  <td className="px-4 py-3.5">
                    <span className="font-mono text-xs text-gray-500" title={sub.id}>
                      {sub.id.slice(0, 8)}...{sub.id.slice(-4)}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 font-medium text-gray-900">
                    <div className="flex items-center gap-2">
                      <span>{sub.email}</span>
                      <button
                        type="button"
                        onClick={() => handleCopy(sub.email, sub.id)}
                        className="text-[10px] text-gray-400 hover:text-gray-700 p-0.5 rounded"
                        title="Copy email"
                      >
                        {copiedId === sub.id ? '✓' : '📋'}
                      </button>
                    </div>
                  </td>

                  <td className="px-4 py-3.5">
                    <span className="inline-block px-2.5 py-0.5 text-xs rounded-md bg-gray-100 text-gray-700 capitalize">
                      {sub.source || 'Website'}
                    </span>
                  </td>

                  <td className="px-4 py-3.5 whitespace-nowrap text-xs text-gray-600">
                    <div>
                      {new Date(sub.subscribed_at).toLocaleDateString('en-IN', {
                        day: 'numeric',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </div>
                    <div className="text-[11px] text-gray-400 font-mono">
                      {new Date(sub.subscribed_at).toLocaleTimeString('en-IN', {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: true,
                      })}
                    </div>
                  </td>

                  <td className="px-4 py-3.5 text-right whitespace-nowrap">
                    <a
                      href={`mailto:${sub.email}`}
                      className="text-xs font-semibold text-emerald-800 hover:underline"
                    >
                      Email →
                    </a>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {loading && (
          <div className="p-8 text-center text-sm text-gray-500">
            Loading newsletter subscribers...
          </div>
        )}

        {!loading && filteredSubscribers.length === 0 && (
          <div className="p-8 text-center text-sm text-gray-500">
            {searchQuery
              ? `No subscribers matching "${searchQuery}"`
              : 'No newsletter subscribers found.'}
          </div>
        )}
      </div>
    </div>
  );
}
