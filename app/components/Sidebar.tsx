'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';

export default function Sidebar() {
  const router = useRouter();
  const { user, logout } = useAuth();
  const [expandedMenu, setExpandedMenu] = useState<string | null>('dashboard');

  const handleLogout = async () => {
    await logout();
    router.push('/auth/login');
  };

  const menuItems = [
    {
      icon: '📊',
      label: 'Dashboard',
      href: '/dashboard',
      id: 'dashboard',
    },
    {
      icon: '🛍️',
      label: 'Sales',
      href: '/dashboard/sales',
      id: 'sales',
    },
    {
      icon: '📦',
      label: 'Purchases',
      href: '/dashboard/purchases',
      id: 'purchases',
    },
    {
      icon: '📋',
      label: 'Inventory',
      href: '/dashboard/inventory',
      id: 'inventory',
    },
    {
      icon: '👥',
      label: 'Traders',
      href: '/dashboard/traders',
      id: 'traders',
    },
    {
      icon: '🤝',
      label: 'Customers',
      href: '/dashboard/customers',
      id: 'customers',
    },
    {
      icon: '🏷️',
      label: 'Products',
      href: '/dashboard/products',
      id: 'products',
    },
    {
      icon: '💰',
      label: 'Expenses',
      href: '/dashboard/expenses',
      id: 'expenses',
    },
    {
      icon: '🏦',
      label: 'Banks',
      href: '/dashboard/banks',
      id: 'banks',
    },
    {
      icon: '📖',
      label: 'Roznamcha',
      href: '/dashboard/roznamcha',
      id: 'roznamcha',
    },
    {
      icon: '📄',
      label: 'Reports',
      href: '/dashboard/reports',
      id: 'reports',
    },
  ];

  return (
    <div className="fixed left-0 top-0 h-screen w-64 bg-gradient-to-b from-blue-900 to-blue-800 text-white shadow-2xl overflow-y-auto">
      {/* Header */}
      <div className="p-6 border-b border-blue-700">
        <h1 className="text-2xl font-bold">Agrifarm ERP</h1>
        <p className="text-blue-200 text-sm mt-1">Powered by Softtech</p>
      </div>

      {/* User Info */}
      {user && (
        <div className="p-4 bg-blue-800 mx-3 mt-4 rounded-lg">
          <p className="text-xs text-blue-200">Logged in as</p>
          <p className="font-semibold text-sm truncate">{user.full_name || user.email}</p>
          <p className="text-xs text-blue-300">{user.role?.toUpperCase()}</p>
        </div>
      )}

      {/* Menu Items */}
      <nav className="p-4 space-y-2">
        {menuItems.map((item) => (
          <Link key={item.id} href={item.href}>
            <button
              onClick={() => setExpandedMenu(item.id)}
              className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg hover:bg-blue-700 transition-all duration-200 text-left group"
            >
              <span className="text-xl">{item.icon}</span>
              <span className="font-medium">{item.label}</span>
            </button>
          </Link>
        ))}
      </nav>

      {/* Divider */}
      <div className="mx-3 border-t border-blue-700"></div>

      {/* Logout Button */}
      <div className="p-4">
        <button
          onClick={handleLogout}
          className="w-full flex items-center space-x-3 px-4 py-3 rounded-lg bg-red-600 hover:bg-red-700 transition-all duration-200 font-medium"
        >
          <span className="text-xl">🚪</span>
          <span>Logout</span>
        </button>
      </div>

      {/* Footer */}
      <div className="p-3 text-center text-xs text-blue-300 border-t border-blue-700">
        <p>© 2026 Softtech</p>
        <p>All rights reserved</p>
      </div>
    </div>
  );
}
