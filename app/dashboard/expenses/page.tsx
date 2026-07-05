'use client';
import DashboardLayout from '@/app/components/DashboardLayout';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Expense } from '@/types';
import { formatCurrency } from '@/lib/utils';

export default function ExpensesPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [expenses, setExpenses] = useState<Expense[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchExpenses();
  }, [user, page]);

  const fetchExpenses = async () => {
    if (!user?.id) return;
    setLoadingData(true);
    try {
      const response = await fetch(`/api/expenses?userId=${user.id}&page=${page}&limit=15`);
      const result = await response.json();
      if (result.success) {
        setExpenses(result.data);
        setTotal(result.total);
      }
    } catch (error) {
      console.error('Failed to fetch expenses:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const totalAmount = expenses.reduce((sum, exp) => sum + parseFloat(exp.amount.toString()), 0);

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Expenses</h1>
          <Link href="/dashboard/expenses/new">
            <button className="bg-red-600 text-white px-6 py-2 rounded-lg hover:bg-red-700">
              Add Expense
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-6 mb-6">
          <h3 className="text-xl font-bold text-gray-900 mb-2">Total Expenses (This Page)</h3>
          <p className="text-2xl font-bold text-red-600">{formatCurrency(totalAmount)}</p>
        </div>

        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Date</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Amount</th>
                <th className="px-6 py-3 text-left font-semibold">Payment Method</th>
                <th className="px-6 py-3 text-left font-semibold">Description</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : expenses.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No expenses found
                  </td>
                </tr>
              ) : (
                expenses.map((expense) => (
                  <tr key={expense.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4">{new Date(expense.expense_date).toLocaleDateString()}</td>
                    <td className="px-6 py-4 font-medium">{expense.category}</td>
                    <td className="px-6 py-4 font-bold text-red-600">{formatCurrency(parseFloat(expense.amount.toString()))}</td>
                    <td className="px-6 py-4">{expense.payment_method}</td>
                    <td className="px-6 py-4 text-gray-600">{expense.description}</td>
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
            Page {page} of {Math.ceil(total / 15)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * 15 >= total}
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
