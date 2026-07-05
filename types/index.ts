// User types
export type UserRole = 'admin' | 'manager' | 'accountant' | 'user';

export interface User {
  id: string;
  email: string;
  full_name: string;
  role: UserRole;
  shop_name: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  image_url: string | null;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Customer types
export interface Customer {
  id: string;
  user_id: string;
  reference_number: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  image_url: string | null;
  credit_limit: number;
  current_balance: number;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Trader/Supplier types
export interface Trader {
  id: string;
  user_id: string;
  reference_number: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  city: string;
  country: string;
  image_url: string | null;
  credit_limit: number;
  current_balance: number;
  notes: string;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Product types
export interface Product {
  id: string;
  user_id: string;
  code: string;
  name: string;
  description: string;
  category: string;
  unit: string;
  purchase_price: number;
  sale_price: number;
  reorder_level: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Inventory types
export interface InventoryItem {
  id: string;
  user_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  value: number;
  last_stock_date: string | null;
  created_at: string;
  updated_at: string;
}

// Sales types
export type PaymentStatus = 'pending' | 'partial' | 'paid' | 'overdue';

export interface SalesItem {
  id: string;
  sale_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  line_total: number;
  created_at: string;
}

export interface Sale {
  id: string;
  user_id: string;
  customer_id: string;
  customer?: Customer;
  invoice_number: string;
  sale_date: string;
  due_date: string | null;
  total_amount: number;
  tax_amount: number;
  discount: number;
  net_amount: number;
  payment_status: PaymentStatus;
  notes: string;
  sales_items?: SalesItem[];
  created_at: string;
  updated_at: string;
}

// Purchase types
export interface PurchaseItem {
  id: string;
  purchase_id: string;
  product_id: string;
  product?: Product;
  quantity: number;
  unit_price: number;
  discount_percent: number;
  discount_amount: number;
  tax_percent: number;
  tax_amount: number;
  line_total: number;
  created_at: string;
}

export interface Purchase {
  id: string;
  user_id: string;
  trader_id: string;
  trader?: Trader;
  bill_number: string;
  purchase_date: string;
  due_date: string | null;
  total_amount: number;
  tax_amount: number;
  discount: number;
  net_amount: number;
  payment_status: PaymentStatus;
  notes: string;
  purchase_items?: PurchaseItem[];
  created_at: string;
  updated_at: string;
}

// Account types
export interface Account {
  id: string;
  user_id: string;
  code: string;
  name: string;
  type: 'Asset' | 'Liability' | 'Equity' | 'Revenue' | 'Expense';
  opening_balance: number;
  current_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

// Roznamcha types
export interface RoznamchaDetail {
  id: string;
  roznamcha_id: string;
  account_id: string;
  account?: Account;
  debit: number;
  credit: number;
  description: string;
  created_at: string;
}

export interface Roznamcha {
  id: string;
  user_id: string;
  entry_date: string;
  entry_number: string;
  description: string;
  total_debit: number;
  total_credit: number;
  reference: string;
  roznamcha_details?: RoznamchaDetail[];
  created_at: string;
  updated_at: string;
}

// Bank types
export interface Bank {
  id: string;
  user_id: string;
  bank_name: string;
  account_number: string;
  account_holder: string;
  branch: string;
  opening_balance: number;
  current_balance: number;
  is_active: boolean;
  created_at: string;
  updated_at: string;
}

export interface BankTransaction {
  id: string;
  user_id: string;
  bank_id: string;
  bank?: Bank;
  transaction_date: string;
  transaction_type: 'deposit' | 'withdrawal' | 'transfer';
  amount: number;
  description: string;
  reference: string;
  created_at: string;
}

// Expense types
export interface Expense {
  id: string;
  user_id: string;
  expense_date: string;
  category: string;
  amount: number;
  description: string;
  payment_method: string;
  reference_number: string;
  created_at: string;
  updated_at: string;
}

// Note types
export interface Note {
  id: string;
  user_id: string;
  title: string;
  content: string;
  note_date: string;
  is_important: boolean;
  created_at: string;
  updated_at: string;
}

// Payment types
export interface Payment {
  id: string;
  user_id: string;
  payment_date: string;
  payment_type: 'sale_payment' | 'purchase_payment';
  sale_id: string | null;
  purchase_id: string | null;
  amount: number;
  payment_method: string;
  reference_number: string;
  notes: string;
  created_at: string;
}

// API Response types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  total_pages: number;
}
