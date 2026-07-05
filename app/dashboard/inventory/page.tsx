'use client';
import DashboardLayout from '@/app/components/DashboardLayout';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { InventoryItem } from '@/types';

export default function InventoryPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [inventory, setInventory] = useState<InventoryItem[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchInventory();
  }, [user, page]);

  const fetchInventory = async () => {
    if (!user?.id) return;
    setLoadingData(true);
    try {
      const response = await fetch(`/api/inventory?userId=${user.id}&page=${page}&limit=15`);
      const result = await response.json();
      if (result.success) {
        setInventory(result.data);
        setTotal(result.total);
      }
    } catch (error) {
      console.error('Failed to fetch inventory:', error);
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Inventory / Store</h1>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Product Code</th>
                <th className="px-6 py-3 text-left font-semibold">Product Name</th>
                <th className="px-6 py-3 text-left font-semibold">Quantity</th>
                <th className="px-6 py-3 text-left font-semibold">Value</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : inventory.length === 0 ? (
                <tr>
                  <td colSpan={5} className="px-6 py-4 text-center text-gray-500">
                    No inventory items found
                  </td>
                </tr>
              ) : (
                inventory.map((item) => (
                  <tr key={item.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{item.product?.code || 'N/A'}</td>
                    <td className="px-6 py-4">{item.product?.name || 'N/A'}</td>
                    <td className="px-6 py-4">
                      <span className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full">
                        {item.quantity} {item.product?.unit || 'pcs'}
                      </span>
                    </td>
                    <td className="px-6 py-4 font-medium">{item.value.toFixed(2)}</td>
                    <td className="px-6 py-4">{item.product?.category || 'N/A'}</td>
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
