'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import Link from 'next/link';
import { supabase } from '@/lib/supabase';

interface DashboardStats {
  totalSales: number;
  totalPurchases: number;
  totalExpenses: number;
  totalCustomers: number;
  totalTraders: number;
  inventoryItems: number;
}

export default function DashboardPage() {
  const router = useRouter();
  const { user, loading, signOut } = useAuth();
  const [stats, setStats] = useState<DashboardStats>({
    totalSales: 0,
    totalPurchases: 0,
    totalExpenses: 0,
    totalCustomers: 0,
    totalTraders: 0,
    inventoryItems: 0,
  });
  const [loadingStats, setLoadingStats] = useState(true);

  useEffect(() => {
    if (!loading && !user) {
      router.push('/auth/login');
    }
  }, [user, loading, router]);

  useEffect(() => {
    if (user) {
      fetchStats();
    }
  }, [user]);

  const fetchStats = async () => {
    if (!user?.id) return;

    try {
      setLoadingStats(true);

      const [
        { count: salesCount },
        { count: purchasesCount },
        { count: expensesCount },
        { count: customersCount },
        { count: tradersCount },
        { count: inventoryCount },
      ] = await Promise.all([
        supabase.from('sales').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('purchases').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('expenses').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('customers').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('traders').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
        supabase.from('inventory').select('*', { count: 'exact', head: true }).eq('user_id', user.id),
      ]);

      setStats({
        totalSales: salesCount || 0,
        totalPurchases: purchasesCount || 0,
        totalExpenses: expensesCount || 0,
        totalCustomers: customersCount || 0,
        totalTraders: tradersCount || 0,
        inventoryItems: inventoryCount || 0,
      });
    } catch (error) {
      console.error('Failed to fetch stats:', error);
    } finally {
      setLoadingStats(false);
    }
  };

  const handleLogout = async () => {
    await signOut();
    router.push('/auth/login');
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-blue-600"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Navigation */}
      <nav className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-4 flex justify-between items-center">
          <div>
            <h1 className="text-2xl font-bold text-blue-600">Agrifarm ERP</h1>
            <p className="text-xs text-gray-500">Powered by Softtech</p>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-gray-600">{user?.email}</span>
            <button
              onClick={handleLogout}
              className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8 flex-1">
        <h2 className="text-3xl font-bold text-gray-900 mb-8">Dashboard</h2>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mb-8">
          <Link href="/dashboard/sales">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer">
              <h3 className="text-gray-600 font-semibold mb-2">Total Sales</h3>
              <p className="text-3xl font-bold text-blue-600">{stats.totalSales}</p>
            </div>
          </Link>

          <Link href="/dashboard/purchases">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer">
              <h3 className="text-gray-600 font-semibold mb-2">Total Purchases</h3>
              <p className="text-3xl font-bold text-purple-600">{stats.totalPurchases}</p>
            </div>
          </Link>

          <Link href="/dashboard/expenses">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer">
              <h3 className="text-gray-600 font-semibold mb-2">Total Expenses</h3>
              <p className="text-3xl font-bold text-red-600">{stats.totalExpenses}</p>
            </div>
          </Link>

          <Link href="/dashboard/traders">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer">
              <h3 className="text-gray-600 font-semibold mb-2">Traders/Buyers</h3>
              <p className="text-3xl font-bold text-green-600">{stats.totalCustomers}</p>
            </div>
          </Link>

          <Link href="/dashboard/traders">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer">
              <h3 className="text-gray-600 font-semibold mb-2">Traders</h3>
              <p className="text-3xl font-bold text-orange-600">{stats.totalTraders}</p>
            </div>
          </Link>

          <Link href="/dashboard/inventory">
            <div className="bg-white p-6 rounded-lg shadow-md hover:shadow-lg hover:scale-105 transition cursor-pointer">
              <h3 className="text-gray-600 font-semibold mb-2">Inventory Items</h3>
              <p className="text-3xl font-bold text-indigo-600">{stats.inventoryItems}</p>
            </div>
          </Link>
        </div>

        {/* Quick Access Menu */}
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-xl font-bold text-gray-900 mb-6">Quick Access</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Link href="/dashboard/traders/new">
              <button className="w-full bg-blue-500 text-white py-3 px-4 rounded-lg hover:bg-blue-600 font-semibold">
                New Trader/Buyer
              </button>
            </Link>
            <Link href="/dashboard/traders/new">
              <button className="w-full bg-purple-500 text-white py-3 px-4 rounded-lg hover:bg-purple-600 font-semibold">
                New Trader
              </button>
            </Link>
            <Link href="/dashboard/sales/new">
              <button className="w-full bg-green-500 text-white py-3 px-4 rounded-lg hover:bg-green-600 font-semibold">
                New Sale
              </button>
            </Link>
            <Link href="/dashboard/purchases/new">
              <button className="w-full bg-orange-500 text-white py-3 px-4 rounded-lg hover:bg-orange-600 font-semibold">
                New Purchase
              </button>
            </Link>
            <Link href="/dashboard/products">
              <button className="w-full bg-indigo-500 text-white py-3 px-4 rounded-lg hover:bg-indigo-600 font-semibold">
                Products
              </button>
            </Link>
            <Link href="/dashboard/inventory">
              <button className="w-full bg-cyan-500 text-white py-3 px-4 rounded-lg hover:bg-cyan-600 font-semibold">
                Inventory
              </button>
            </Link>
            <Link href="/dashboard/roznamcha">
              <button className="w-full bg-teal-500 text-white py-3 px-4 rounded-lg hover:bg-teal-600 font-semibold">
                Roznamcha
              </button>
            </Link>
            <Link href="/dashboard/reports">
              <button className="w-full bg-red-500 text-white py-3 px-4 rounded-lg hover:bg-red-600 font-semibold">
                Reports
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2026 Softtech. All rights reserved.</p>
          <p className="mt-1 text-gray-500">Agrifarm ERP - Powered by <span className="font-semibold text-gray-700">Softtech</span></p>
        </div>
      </footer>
    </div>
  );
}
