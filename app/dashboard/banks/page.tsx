'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Bank } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function BanksPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [banks, setBanks] = useState<Bank[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchBanks();
  }, [user, page]);

  const fetchBanks = async () => {
    if (!user?.id) return;
    setLoadingData(true);
    try {
      const response = await fetch(`/api/banks?userId=${user.id}&page=${page}&limit=10`);
      const result = await response.json();
      if (result.success) {
        setBanks(result.data);
        setTotal(result.total);
      }
    } catch (error) {
      console.error('Failed to fetch banks:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const totalBalance = banks.reduce((sum, bank) => sum + parseFloat(bank.current_balance.toString()), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Banks</h1>
          <Link href="/dashboard/banks/new">
            <button className="bg-teal-600 text-white px-6 py-2 rounded-lg hover:bg-teal-700">
              Add Bank Account
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Total Balance</h3>
          <p className="text-2xl font-bold text-teal-600">{formatCurrency(totalBalance)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Bank Name</th>
                <th className="px-6 py-3 text-left font-semibold">Account Number</th>
                <th className="px-6 py-3 text-left font-semibold">Account Holder</th>
                <th className="px-6 py-3 text-left font-semibold">Branch</th>
                <th className="px-6 py-3 text-left font-semibold">Current Balance</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : banks.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No bank accounts found
                  </td>
                </tr>
              ) : (
                banks.map((bank) => (
                  <tr key={bank.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-bold">{bank.bank_name}</td>
                    <td className="px-6 py-4 font-medium">{bank.account_number}</td>
                    <td className="px-6 py-4">{bank.account_holder}</td>
                    <td className="px-6 py-4">{bank.branch}</td>
                    <td className="px-6 py-4 font-bold text-teal-600">{formatCurrency(parseFloat(bank.current_balance.toString()))}</td>
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
