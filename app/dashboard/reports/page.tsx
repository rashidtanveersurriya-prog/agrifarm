'use client';

import { useState } from 'react';
import { useAuth } from '@/lib/auth-context';
import { Sale, Purchase, Expense } from '@/types';
import { PDFGenerator } from '@/lib/pdf-generator';

export default function ReportsPage() {
  const { user } = useAuth();
  const [reportType, setReportType] = useState('sales');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');
  const [loading, setLoading] = useState(false);

  const handleGenerateReport = async () => {
    if (!user?.id || !dateFrom || !dateTo) {
      alert('Please select date range and report type');
      return;
    }

    setLoading(true);

    try {
      let data: any[] = [];
      let filename = '';

      if (reportType === 'sales') {
        const response = await fetch(
          `/api/sales?userId=${user.id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
        );
        const result = await response.json();
        data = result.data || [];
        filename = `sales_report_${new Date().toISOString().split('T')[0]}.pdf`;
      } else if (reportType === 'purchases') {
        const response = await fetch(
          `/api/purchases?userId=${user.id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
        );
        const result = await response.json();
        data = result.data || [];
        filename = `purchase_report_${new Date().toISOString().split('T')[0]}.pdf`;
      } else if (reportType === 'expenses') {
        const response = await fetch(
          `/api/expenses?userId=${user.id}&dateFrom=${dateFrom}&dateTo=${dateTo}`
        );
        const result = await response.json();
        data = result.data || [];
        filename = `expense_report_${new Date().toISOString().split('T')[0]}.pdf`;
      }

      const pdfGenerator = new PDFGenerator({
        shopName: 'Agrifarm',
        shopAddress: 'Your Shop Address',
        shopPhone: '+92 XXX XXXXXXX',
        shopEmail: user.email || '',
        reportDate: new Date().toLocaleDateString(),
      });

      let pdf;
      if (reportType === 'sales') {
        pdf = pdfGenerator.generateSalesReport(data as Sale[]);
      } else if (reportType === 'purchases') {
        pdf = pdfGenerator.generatePurchaseReport(data as Purchase[]);
      } else {
        pdf = pdfGenerator.generateExpenseReport(data as Expense[]);
      }

      pdf.save(filename);
      alert(`${reportType.charAt(0).toUpperCase() + reportType.slice(1)} report generated!`);
    } catch (error) {
      console.error('Failed to generate report:', error);
      alert('Failed to generate report');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white shadow-md">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <h1 className="text-3xl font-bold text-gray-900">Reports</h1>
        </div>
      </div>

      <div className="max-w-4xl mx-auto px-4 py-8">
        <div className="bg-white rounded-lg shadow-md p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Generate Report</h2>

          <div className="space-y-6">
            {/* Report Type Selection */}
            <div>
              <label className="block text-gray-700 font-semibold mb-3">Report Type</label>
              <div className="grid grid-cols-3 gap-4">
                {['sales', 'purchases', 'expenses'].map((type) => (
                  <button
                    key={type}
                    onClick={() => setReportType(type)}
                    className={`py-3 px-4 rounded-lg font-semibold transition ${
                      reportType === type
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Date Range */}
            <div className="grid grid-cols-2 gap-6">
              <div>
                <label className="block text-gray-700 font-semibold mb-2">From Date</label>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => setDateFrom(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-gray-700 font-semibold mb-2">To Date</label>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => setDateTo(e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>

            {/* Generate Button */}
            <button
              onClick={handleGenerateReport}
              disabled={loading}
              className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400 transition"
            >
              {loading ? 'Generating...' : 'Generate PDF Report'}
            </button>
          </div>

          {/* Report Info */}
          <div className="mt-8 pt-8 border-t">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Available Reports</h3>
            <ul className="space-y-3 text-gray-600">
              <li>
                <strong>Sales Report:</strong> Complete sales transactions with customer details, amounts, and payment status
              </li>
              <li>
                <strong>Purchase Report:</strong> All purchase orders with trader information, quantities, and costs
              </li>
              <li>
                <strong>Expense Report:</strong> Expense categorization and breakdown with payment methods
              </li>
            </ul>
          </div>
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
