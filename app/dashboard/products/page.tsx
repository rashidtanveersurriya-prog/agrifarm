'use client';
import DashboardLayout from '@/app/components/DashboardLayout';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { useAuth } from '@/lib/auth-context';
import { Product } from '@/types';

export default function ProductsPage() {
  const router = useRouter();
  const { user, loading } = useAuth();
  const [products, setProducts] = useState<Product[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [page, setPage] = useState(1);
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!loading && !user) router.push('/auth/login');
  }, [user, loading, router]);

  useEffect(() => {
    if (user) fetchProducts();
  }, [user, page]);

  const fetchProducts = async () => {
    if (!user?.id) return;
    setLoadingData(true);
    try {
      const response = await fetch(`/api/products?userId=${user.id}&page=${page}&limit=15`);
      const result = await response.json();
      if (result.success) {
        setProducts(result.data);
        setTotal(result.total);
      }
    } catch (error) {
      console.error('Failed to fetch products:', error);
    } finally {
      setLoadingData(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Products</h1>
          <Link href="/dashboard/products/new">
            <button className="bg-indigo-600 text-white px-6 py-2 rounded-lg hover:bg-indigo-700">
              Add Product
            </button>
          </Link>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-100 border-b">
              <tr>
                <th className="px-6 py-3 text-left font-semibold">Code</th>
                <th className="px-6 py-3 text-left font-semibold">Name</th>
                <th className="px-6 py-3 text-left font-semibold">Category</th>
                <th className="px-6 py-3 text-left font-semibold">Purchase Price</th>
                <th className="px-6 py-3 text-left font-semibold">Sale Price</th>
                <th className="px-6 py-3 text-left font-semibold">Unit</th>
                <th className="px-6 py-3 text-left font-semibold">Actions</th>
              </tr>
            </thead>
            <tbody>
              {loadingData ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center">
                    Loading...
                  </td>
                </tr>
              ) : products.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-6 py-4 text-center text-gray-500">
                    No products found
                  </td>
                </tr>
              ) : (
                products.map((product) => (
                  <tr key={product.id} className="border-b hover:bg-gray-50">
                    <td className="px-6 py-4 font-medium">{product.code}</td>
                    <td className="px-6 py-4">{product.name}</td>
                    <td className="px-6 py-4">{product.category}</td>
                    <td className="px-6 py-4">{product.purchase_price.toFixed(2)}</td>
                    <td className="px-6 py-4 font-medium text-green-600">{product.sale_price.toFixed(2)}</td>
                    <td className="px-6 py-4">{product.unit}</td>
                    <td className="px-6 py-4">
                      <Link href={`/dashboard/products/${product.id}`}>
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                          Edit
                        </button>
                      </Link>
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
