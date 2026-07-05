'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Customer } from '@/types';

export default function CustomersPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [search, setSearch] = useState('');
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchCustomers();
    }
  }, [user, page, search]);

  const fetchCustomers = async () => {
    if (!user?.id) return;
    setLoadingData(true);
    try {
      const query = new URLSearchParams({
        userId: user.id,
        page: page.toString(),
        limit: '10',
        ...(search && { search }),
      });

      const response = await fetch(`/api/customers?${query}`);
      const result = await response.json();

      if (result.success) {
        setCustomers(result.data);
        setTotal(result.total);
      }
    } catch (error) {
      console.error('Failed to fetch customers:', error);
    } finally {
      setLoadingData(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this customer?')) return;

    try {
      const response = await fetch(`/api/customers/${id}`, {
        method: 'DELETE',
      });
      const result = await response.json();

      if (result.success) {
        fetchCustomers();
      }
    } catch (error) {
      console.error('Failed to delete customer:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Traders & Buyers</h1>
          <Link href="/dashboard/traders/new">
            <button className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700">
              Add New Trader/Buyer
            </button>
          </Link>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Search */}
        <div className="mb-6">
          <input
            type="text"
            placeholder="Search traders/buyers..."
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        {/* Table */}
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Name</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Email</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Phone</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Balance</th>
                <th className="px-6 py-3 text-left font-semibold text-gray-700">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    Loading...
                  </td>
                </tr>
              ) : customers.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No customers found
                  </td>
                </tr>
              ) : (
                customers.map((customer) => (
                  <tr key={customer.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium text-gray-900">{customer.name}</td>
                    <td className="px-6 py-4 text-gray-600">{customer.email}</td>
                    <td className="px-6 py-4 text-gray-600">{customer.phone}</td>
                    <td className="px-6 py-4 text-gray-600">{customer.current_balance}</td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/customers/${customer.id}`}>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 mr-2">
                          Edit
                        </button>
                      </Link>
                      <button
                        onClick={() => handleDelete(customer.id)}
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

        {/* Pagination */}
        <div className="mt-6 flex justify-between items-center">
          <button
            onClick={() => setPage(Math.max(1, page - 1))}
            disabled={page === 1}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400"
          >
            Previous
          </button>
          <span className="text-gray-600">
            Page {page} of {Math.ceil(total / 10)}
          </span>
          <button
            onClick={() => setPage(page + 1)}
            disabled={page * 10 >= total}
            className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg disabled:opacity-50 hover:bg-gray-400"
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
