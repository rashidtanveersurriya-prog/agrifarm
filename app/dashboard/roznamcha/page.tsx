'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Roznamcha } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function RoznamchaPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [roznamchas, setRoznamchas] = useState<Roznamcha[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchRoznamcha();
  }, [user, page]);

  const fetchRoznamcha = async () => {
    if (!user?.id) return;
    setLoadingData(true);
    try {
      const response = await fetch(`/api/roznamcha?userId=${user.id}&page=${page}&limit=10`);
      const result = await response.json();
      if (result.success) {
        setRoznamchas(result.data);
        setTotal(result.total);
      }
    } catch (error) {
      console.error('Failed to fetch roznamcha:', error);
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Roznamcha (Journal)</h1>
          <Link href="/dashboard/roznamcha/new">
            <button className="bg-cyan-600 text-white px-6 py-2 rounded-lg hover:bg-cyan-700">
              New Entry
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Entry #</th>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Description</th>
                <th className="px-6 py-3 text-left font-semibold">Debit</th>
                <th className="px-6 py-3 text-left font-semibold">Credit</th>
                <th className="px-6 py-3 text-left font-semibold">Reference</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : roznamchas.length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-6 py-4 text-center text-gray-500">
                    No journal entries found
                  </td>
                </tr>
              ) : (
                roznamchas.map((roznamcha) => (
                  <tr key={roznamcha.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold">{roznamcha.entry_number}</td>
                    <td className="px-6 py-4">{new Date(roznamcha.entry_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4">{roznamcha.description}</td>
                    <td className="px-6 py-4 font-bold text-red-600">
                      {formatCurrency(roznamcha.total_debit)}
                    </td>
                    <td className="px-6 py-4 font-bold text-green-600">
                      {formatCurrency(roznamcha.total_credit)}
                    </td>
                    <td className="px-6 py-4">{roznamcha.reference}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {Math.ceil(total / 10)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * 10 >= total}
            className="px-4 py-2 bg-gray-300 rounded-lg disabled:opacity-50"
          >
            Next
          </button>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-4 text-center text-xs text-gray-500">
          <p>© 2026 Softtech. All rights reserved. | Powered by Softtech</p>
        </div>
      </footer>
    </div>
  );
}
