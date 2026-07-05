'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';
import { useAuth } from '@/lib/auth-context';
import { Customer, Product } from '@/types';
import { generateInvoiceNumber, calculateLineTotal } from '@/lib/utils';

interface LineItem {
  product_id: string;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  tax_percent: number;
  discount_amount: number;
  tax_amount: number;
  line_total: number;
}

export default function NewSalePage() {
  const router = useRouter();
  const { user } = useAuth();
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const [formData, setFormData] = useState({
    customer_id: '',
    invoice_number: generateInvoiceNumber(),
    sale_date: new Date().toISOString().split('T')[0],
    due_date: '',
    notes: '',
  });

  const [lineItems, setLineItems] = useState<LineItem[]>([
    {
      product_id: '',
      quantity: 1,
      unit_price: 0,
      discount_percent: 0,
      tax_percent: 0,
      discount_amount: 0,
      tax_amount: 0,
      line_total: 0,
    },
  ]);

  useEffect(() => {
    if (user?.id) {
      fetchCustomersAndProducts();
    }
  }, [user?.id]);

  const fetchCustomersAndProducts = async () => {
    if (!user?.id) return;
    try {
      const [custRes, prodRes] = await Promise.all([
        fetch(`/api/customers?userId=${user.id}&limit=100`),
        fetch(`/api/products?userId=${user.id}&limit=100`),
      ]);

      const custResult = await custRes.json();
      const prodResult = await prodRes.json();

      if (custResult.success) setCustomers(custResult.data);
      if (prodResult.success) setProducts(prodResult.data);
    } catch (error) {
      console.error('Failed to fetch data:', error);
    }
  };

  const handleAddLineItem = () => {
    setLineItems([
      ...lineItems,
      {
        product_id: '',
        quantity: 1,
        unit_price: 0,
        discount_percent: 0,
        tax_percent: 0,
        discount_amount: 0,
        tax_amount: 0,
        line_total: 0,
      },
    ]);
  };

  const handleLineItemChange = (index: number, field: string, value: any) => {
    const updated = [...lineItems];
    updated[index] = { ...updated[index], [field]: value };

    if (field === 'product_id') {
      const product = products.find((p) => p.id === value);
      if (product) {
        updated[index].unit_price = product.sale_price;
      }
    }

    const quantity = updated[index].quantity || 1;
    const unitPrice = updated[index].unit_price || 0;
    const discountPercent = updated[index].discount_percent || 0;
    const taxPercent = updated[index].tax_percent || 0;

    const subtotal = quantity * unitPrice;
    updated[index].discount_amount = (subtotal * discountPercent) / 100;
    const afterDiscount = subtotal - updated[index].discount_amount;
    updated[index].tax_amount = (afterDiscount * taxPercent) / 100;
    updated[index].line_total = afterDiscount + updated[index].tax_amount;

    setLineItems(updated);
  };

  const handleRemoveLineItem = (index: number) => {
    setLineItems(lineItems.filter((_, i) => i !== index));
  };

  const calculateTotals = () => {
    const totals = lineItems.reduce(
      (acc, item) => ({
        total: acc.total + item.line_total,
        discount: acc.discount + item.discount_amount,
        tax: acc.tax + item.tax_amount,
      }),
      { total: 0, discount: 0, tax: 0 }
    );

    return {
      total_amount: totals.total + totals.discount,
      discount,
      tax_amount: totals.tax,
      net_amount: totals.total,
    };
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user?.id || !formData.customer_id || lineItems.some((item) => !item.product_id)) {
      setError('Please fill in all required fields');
      return;
    }

    setLoading(true);
    setError('');

    try {
      const totals = calculateTotals();
      const response = await fetch('/api/sales', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ...formData,
          user_id: user.id,
          payment_status: 'pending',
          sales_items: lineItems.filter((item) => item.product_id),
          ...totals,
        }),
      });

      const result = await response.json();

      if (result.success) {
        router.push('/dashboard/sales');
      } else {
        setError(result.error || 'Failed to create sale');
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const totals = calculateTotals();

  return (
    <div className="min-h-screen bg-gray-50 py-8">
      <div className="max-w-6xl mx-auto bg-white rounded-lg shadow-md p-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-8">Create New Sale</h1>

        {error && (
          <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {/* Sale Header */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div>
              <label className="block text-gray-700 font-semibold mb-2">Invoice #</label>
              <input
                type="text"
                value={formData.invoice_number}
                readOnly
                className="w-full px-4 py-2 border border-gray-300 rounded-lg bg-gray-100"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Buyer/Customer *</label>
              <select
                value={formData.customer_id}
                onChange={(e) => setFormData({ ...formData, customer_id: e.target.value })}
                required
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="">Select Buyer/Customer</option>
                {customers.map((cust) => (
                  <option key={cust.id} value={cust.id}>
                    {cust.name}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Sale Date</label>
              <input
                type="date"
                value={formData.sale_date}
                onChange={(e) => setFormData({ ...formData, sale_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>

            <div>
              <label className="block text-gray-700 font-semibold mb-2">Due Date</label>
              <input
                type="date"
                value={formData.due_date}
                onChange={(e) => setFormData({ ...formData, due_date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg"
              />
            </div>
          </div>

          {/* Line Items */}
          <div className="mb-8">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-xl font-bold text-gray-900">Items</h2>
              <button
                type="button"
                onClick={handleAddLineItem}
                className="bg-green-600 text-white px-4 py-2 rounded-lg hover:bg-green-700"
              >
                Add Item
              </button>
            </div>

            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="bg-gray-100 border-b">
                    <th className="px-4 py-2 text-left">Product</th>
                    <th className="px-4 py-2 text-left">Qty</th>
                    <th className="px-4 py-2 text-left">Unit Price</th>
                    <th className="px-4 py-2 text-left">Discount %</th>
                    <th className="px-4 py-2 text-left">Tax %</th>
                    <th className="px-4 py-2 text-left">Line Total</th>
                    <th className="px-4 py-2">Action</th>
                  </tr>
                </thead>
                <tbody>
                  {lineItems.map((item, index) => (
                    <tr key={index} className="border-b">
                      <td className="px-4 py-2">
                        <select
                          value={item.product_id}
                          onChange={(e) =>
                            handleLineItemChange(index, 'product_id', e.target.value)
                          }
                          className="w-full px-2 py-1 border rounded"
                        >
                          <option value="">Select Product</option>
                          {products.map((prod) => (
                            <option key={prod.id} value={prod.id}>
                              {prod.name}
                            </option>
                          ))}
                        </select>
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.quantity}
                          onChange={(e) =>
                            handleLineItemChange(index, 'quantity', parseInt(e.target.value) || 0)
                          }
                          className="w-20 px-2 py-1 border rounded"
                          min="1"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.unit_price}
                          onChange={(e) =>
                            handleLineItemChange(index, 'unit_price', parseFloat(e.target.value) || 0)
                          }
                          className="w-24 px-2 py-1 border rounded"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.discount_percent}
                          onChange={(e) =>
                            handleLineItemChange(
                              index,
                              'discount_percent',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-20 px-2 py-1 border rounded"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2">
                        <input
                          type="number"
                          value={item.tax_percent}
                          onChange={(e) =>
                            handleLineItemChange(
                              index,
                              'tax_percent',
                              parseFloat(e.target.value) || 0
                            )
                          }
                          className="w-20 px-2 py-1 border rounded"
                          step="0.01"
                        />
                      </td>
                      <td className="px-4 py-2 font-bold">{item.line_total.toFixed(2)}</td>
                      <td className="px-4 py-2">
                        <button
                          type="button"
                          onClick={() => handleRemoveLineItem(index)}
                          className="bg-red-500 text-white px-2 py-1 rounded hover:bg-red-600"
                        >
                          Remove
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Totals */}
          <div className="grid grid-cols-4 gap-4 mb-8">
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Subtotal</p>
              <p className="text-2xl font-bold">{totals.total_amount.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Discount</p>
              <p className="text-2xl font-bold text-red-600">-{totals.discount.toFixed(2)}</p>
            </div>
            <div className="bg-gray-50 p-4 rounded-lg">
              <p className="text-gray-600 text-sm">Tax</p>
              <p className="text-2xl font-bold text-blue-600">{totals.tax_amount.toFixed(2)}</p>
            </div>
            <div className="bg-blue-50 p-4 rounded-lg border-2 border-blue-500">
              <p className="text-gray-600 text-sm">Net Total</p>
              <p className="text-2xl font-bold text-blue-600">{totals.net_amount.toFixed(2)}</p>
            </div>
          </div>

          {/* Notes */}
          <div className="mb-8">
            <label className="block text-gray-700 font-semibold mb-2">Notes</label>
            <textarea
              value={formData.notes}
              onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            />
          </div>

          {/* Submit */}
          <div className="flex gap-4">
            <button
              type="submit"
              disabled={loading}
              className="flex-1 bg-blue-600 text-white font-bold py-2 px-4 rounded-lg hover:bg-blue-700 disabled:bg-gray-400"
            >
              {loading ? 'Creating...' : 'Create Sale'}
            </button>
            <button
              type="button"
              onClick={() => router.back()}
              className="flex-1 bg-gray-300 text-gray-700 font-bold py-2 px-4 rounded-lg hover:bg-gray-400"
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
