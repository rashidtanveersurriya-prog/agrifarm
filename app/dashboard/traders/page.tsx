'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Trader } from '@/types';

export default function TradersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [traders, setTraders] = useState<Trader[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchTraders();
  }, [user, page]);

  const fetchTraders = async () => {
    if (!user?.id) return;
    setLoadingData(true);
    try {
      const response = await fetch(
        `/api/traders?userId=${user.id}&page=${page}&limit=10`
      );
      const result = await response.json();
      if (result.success) {
        setTraders(result.data);
        setTotal(result.total);
      }
    } catch (error) {
      console.error('Failed to fetch traders:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure?')) return;
    try {
      await fetch(`/api/traders/${id}`, { method: 'DELETE' });
      fetchTraders();
    } catch (error) {
      console.error('Failed to delete:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Traders / Suppliers</h1>
          <Link href="/dashboard/traders/new">
            <button className="bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700">
              Add Trader
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Email</th>
                <th className="px-6 py-3 text-left font-semibold">Phone</th>
                <th className="px-6 py-3 text-left font-semibold">Balance</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : traders.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No traders found
                  </td>
                </tr>
              ) : (
                traders.map((trader) => (
                  <tr key={trader.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{trader.name}</td>
                    <td className="px-6 py-4">{trader.email}</td>
                    <td className="px-6 py-4">{trader.phone}</td>
                    <td className="px-6 py-4">{trader.current_balance}</td>
                    <td className="px-6 py-4">
                      <button
                        onClick={() => handleDelete(trader.id)}
                        className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                      >
                        Delete
                      </button>
                    </td>
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
