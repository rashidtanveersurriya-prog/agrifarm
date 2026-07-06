'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

interface PendingShop {
  id: string;
  email: string;
  full_name: string;
  shop_name: string;
  phone: string;
  city: string;
  country: string;
  created_at: string;
  is_approved: boolean;
}

export default function SuperAdminDashboard() {
  const router = useRouter();
  const [shops, setShops] = useState<PendingShop[]>([]);
  const [loading, setLoading] = useState(true);
  const [stats, setStats] = useState({
    pending: 0,
    approved: 0,
    total: 0,
  });
  const [selectedShop, setSelectedShop] = useState<PendingShop | null>(null);
  const [approvalNotes, setApprovalNotes] = useState('');
  const [activeTab, setActiveTab] = useState<'pending' | 'approved'>('pending');

  useEffect(() => {
    // Check authentication
    const token = localStorage.getItem('superadmin_token');
    if (!token) {
      router.push('/superadmin/login');
      return;
    }
    fetchShops();
  }, [router]);

  const fetchShops = async () => {
    try {
      setLoading(true);
      const token = localStorage.getItem('superadmin_token');
      const response = await fetch('/api/superadmin/shops', {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        if (response.status === 401) {
          router.push('/superadmin/login');
        }
        throw new Error('Failed to fetch shops');
      }

      const data = await response.json();
      setShops(data.data || []);

      // Calculate stats
      const pending = (data.data || []).filter((s: PendingShop) => !s.is_approved).length;
      const approved = (data.data || []).filter((s: PendingShop) => s.is_approved).length;
      setStats({
        pending,
        approved,
        total: data.data?.length || 0,
      });
    } catch (error) {
      console.error('Failed to fetch shops:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (shopId: string) => {
    try {
      const token = localStorage.getItem('superadmin_token');
      const response = await fetch('/api/superadmin/approve', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_id: shopId,
          approval_notes: approvalNotes,
        }),
      });

      if (!response.ok) throw new Error('Approval failed');

      setApprovalNotes('');
      setSelectedShop(null);
      fetchShops();
      alert('Shop approved successfully!');
    } catch (error) {
      alert('Failed to approve shop: ' + error);
    }
  };

  const handleReject = async (shopId: string) => {
    if (!confirm('Are you sure you want to reject this shop?')) return;

    try {
      const token = localStorage.getItem('superadmin_token');
      const response = await fetch('/api/superadmin/reject', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          shop_id: shopId,
          approval_notes: approvalNotes || 'Rejected by superadmin',
        }),
      });

      if (!response.ok) throw new Error('Rejection failed');

      setApprovalNotes('');
      setSelectedShop(null);
      fetchShops();
      alert('Shop rejected');
    } catch (error) {
      alert('Failed to reject shop: ' + error);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('superadmin_token');
    localStorage.removeItem('superadmin_id');
    router.push('/superadmin/login');
  };

  const filteredShops = activeTab === 'pending'
    ? shops.filter(s => !s.is_approved)
    : shops.filter(s => s.is_approved);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-gradient-to-r from-gray-900 to-gray-800 text-white shadow-lg">
        <div className="max-w-7xl mx-auto px-4 py-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold">🔐 SuperAdmin Dashboard</h1>
            <p className="text-gray-300 mt-1">Shop Approval Management</p>
          </div>
          <button
            onClick={handleLogout}
            className="bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-semibold transition"
          >
            Logout
          </button>
        </div>
      </header>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">PENDING SHOPS</p>
            <p className="text-4xl font-bold text-yellow-600 mt-2">{stats.pending}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">APPROVED SHOPS</p>
            <p className="text-4xl font-bold text-green-600 mt-2">{stats.approved}</p>
          </div>
          <div className="bg-white rounded-lg shadow-md p-6">
            <p className="text-gray-600 text-sm font-semibold">TOTAL SHOPS</p>
            <p className="text-4xl font-bold text-blue-600 mt-2">{stats.total}</p>
          </div>
        </div>

        {/* Content */}
        <div className="grid grid-cols-3 gap-8">
          {/* Shops List */}
          <div className="col-span-2">
            <div className="bg-white rounded-lg shadow-md">
              {/* Tabs */}
              <div className="border-b flex">
                <button
                  onClick={() => setActiveTab('pending')}
                  className={`flex-1 py-4 font-semibold text-center transition ${
                    activeTab === 'pending'
                      ? 'bg-blue-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Pending ({stats.pending})
                </button>
                <button
                  onClick={() => setActiveTab('approved')}
                  className={`flex-1 py-4 font-semibold text-center transition ${
                    activeTab === 'approved'
                      ? 'bg-green-600 text-white'
                      : 'text-gray-600 hover:bg-gray-50'
                  }`}
                >
                  Approved ({stats.approved})
                </button>
              </div>

              {/* Table */}
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead className="bg-gray-100 border-b">
                    <tr>
                      <th className="px-6 py-3 text-left font-semibold">Shop Name</th>
                      <th className="px-6 py-3 text-left font-semibold">Owner</th>
                      <th className="px-6 py-3 text-left font-semibold">Email</th>
                      <th className="px-6 py-3 text-left font-semibold">Date</th>
                      <th className="px-6 py-3 text-left font-semibold">Action</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredShops.length === 0 ? (
                      <tr>
                        <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                          No {activeTab} shops found
                        </td>
                      </tr>
                    ) : (
                      filteredShops.map((shop) => (
                        <tr key={shop.id} className="border-b hover:bg-gray-50">
                          <td className="px-6 py-4 font-semibold">{shop.shop_name}</td>
                          <td className="px-6 py-4">{shop.full_name}</td>
                          <td className="px-6 py-4">{shop.email}</td>
                          <td className="px-6 py-4 text-sm text-gray-600">
                            {new Date(shop.created_at).toLocaleDateString()}
                          </td>
                          <td className="px-6 py-4">
                            {!shop.is_approved ? (
                              <button
                                onClick={() => setSelectedShop(shop)}
                                className="bg-blue-600 text-white px-4 py-2 rounded hover:bg-blue-700 text-sm font-semibold"
                              >
                                Review
                              </button>
                            ) : (
                              <span className="text-green-600 font-semibold">✓ Approved</span>
                            )}
                          </td>
                        </tr>
                      ))
                    )}
                  </tbody>
                </table>
              </div>
            </div>
          </div>

          {/* Shop Details & Approval Panel */}
          <div>
            {selectedShop ? (
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h3 className="text-xl font-bold mb-4">Shop Details</h3>

                <div className="space-y-3 mb-6">
                  <div>
                    <p className="text-gray-600 text-sm">Shop Name</p>
                    <p className="font-semibold">{selectedShop.shop_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Owner Name</p>
                    <p className="font-semibold">{selectedShop.full_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Email</p>
                    <p className="font-semibold text-blue-600">{selectedShop.email}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Phone</p>
                    <p className="font-semibold">{selectedShop.phone}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">City</p>
                    <p className="font-semibold">{selectedShop.city}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Country</p>
                    <p className="font-semibold">{selectedShop.country}</p>
                  </div>
                  <div>
                    <p className="text-gray-600 text-sm">Registration Date</p>
                    <p className="font-semibold">
                      {new Date(selectedShop.created_at).toLocaleString()}
                    </p>
                  </div>
                </div>

                {!selectedShop.is_approved && (
                  <>
                    <div className="mb-4">
                      <label className="block text-gray-700 font-semibold mb-2">
                        Approval Notes
                      </label>
                      <textarea
                        value={approvalNotes}
                        onChange={(e) => setApprovalNotes(e.target.value)}
                        placeholder="Add approval or rejection notes..."
                        className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        rows={4}
                      />
                    </div>

                    <div className="space-y-2">
                      <button
                        onClick={() => handleApprove(selectedShop.id)}
                        className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-2 rounded-lg transition"
                      >
                        ✓ Approve Shop
                      </button>
                      <button
                        onClick={() => handleReject(selectedShop.id)}
                        className="w-full bg-red-600 hover:bg-red-700 text-white font-semibold py-2 rounded-lg transition"
                      >
                        ✗ Reject Shop
                      </button>
                      <button
                        onClick={() => setSelectedShop(null)}
                        className="w-full bg-gray-300 hover:bg-gray-400 text-gray-800 font-semibold py-2 rounded-lg transition"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}

                {selectedShop.is_approved && (
                  <div className="bg-green-50 border border-green-200 rounded-lg p-4 text-center">
                    <p className="text-green-800 font-semibold">✓ Shop Approved</p>
                  </div>
                )}
              </div>
            ) : (
              <div className="bg-white rounded-lg shadow-md p-6 text-center">
                <p className="text-gray-500">Select a shop to review</p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="mt-12 bg-white border-t border-gray-200">
        <div className="max-w-7xl mx-auto px-4 py-6 text-center text-sm text-gray-600">
          <p>© 2026 Softtech. All rights reserved.</p>
          <p className="mt-1">Agrifarm ERP SuperAdmin Panel</p>
        </div>
      </footer>
    </div>
  );
}
