# Agrifarm ERP System - Complete Setup Guide

## Overview
This is a full-featured ERP (Enterprise Resource Planning) system built with Next.js, React, TypeScript, and Supabase for managing:
- Multi-user accounts
- Customers & Traders (Suppliers)
- Sales & Purchases
- Inventory/Store Management
- Roznamcha (Journal/Ledger)
- Banks & Transactions
- Expenses
- Notes
- PDF Reports with custom headers/footers

---

## Prerequisites
- Node.js 18+ installed
- npm or yarn package manager
- Supabase account (free tier available at https://supabase.com)

---

## Installation Steps

### 1. Set Up Supabase Database

1. **Create a Supabase Project:**
   - Go to https://supabase.com and sign up/login
   - Click "New Project"
   - Fill in project details
   - Save your **Project URL** and **Anon Key** (you'll need these)

2. **Create Database Schema:**
   - Go to SQL Editor in Supabase
   - Click "New Query"
   - Copy the entire content from `supabase_schema.sql` file in this project
   - Paste it and click "Run"
   - Wait for the schema to be created

3. **Enable Authentication:**
   - Go to "Authentication" > "Providers"
   - Enable "Email" provider
   - Configure email settings if needed

### 2. Configure Environment Variables

1. **Create `.env.local` file** in the project root:
   ```bash
   cp .env.example .env.local
   ```

2. **Add your Supabase credentials:**
   ```
   NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
   NEXT_PUBLIC_APP_URL=http://localhost:3000
   ```

   (Get these values from Supabase Project Settings > API)

### 3. Install Dependencies

```bash
npm install
# or
yarn install
```

### 4. Run Development Server

```bash
npm run dev
# or
yarn dev
```

The application will be available at `http://localhost:3000`

---

## First Time Usage

### Create Your Account
1. Go to http://localhost:3000
2. Click "Sign Up"
3. Enter your details:
   - Full Name
   - Shop Name
   - Phone
   - Email
   - Password (minimum 6 characters)
4. Click "Sign Up"

### Access Dashboard
After sign up, you'll be redirected to the dashboard with quick access buttons for all modules.

---

## Using Each Module

### 1. Customers Management
- **Location:** Dashboard > Customers
- **Features:**
  - Add new customers with reference numbers
  - Store images, addresses, contact details
  - Track credit limits and balances
  - Add notes for each customer

### 2. Traders/Suppliers
- **Location:** Dashboard > Traders
- **Features:**
  - Add supplier information
  - Manage credit limits
  - Store contact and address details
  - Support for multiple suppliers

### 3. Products
- **Location:** Dashboard > Products
- **Features:**
  - Add products with codes
  - Set purchase and sale prices
  - Categorize by type
  - Set reorder levels
  - Define units (pcs, kg, liter, etc.)

### 4. Sales Management
- **Location:** Dashboard > Sales
- **Features:**
  - Create sales invoices
  - Add multiple line items
  - Apply discounts and taxes
  - Track payment status
  - Auto-updates inventory

### 5. Purchases Management
- **Location:** Dashboard > Purchases
- **Features:**
  - Create purchase bills
  - Add items with quantities and prices
  - Track payment status
  - Auto-updates inventory on receipt

### 6. Inventory/Store
- **Location:** Dashboard > Inventory
- **Features:**
  - View all stock levels
  - Track inventory values
  - Monitor reorder levels
  - Real-time updates from sales/purchases

### 7. Roznamcha (Journal)
- **Location:** Dashboard > Roznamcha
- **Features:**
  - Double-entry bookkeeping
  - Account head management
  - Journal entries with debits and credits
  - Reference tracking

### 8. Banks
- **Location:** Dashboard > Banks
- **Features:**
  - Add multiple bank accounts
  - Track account balances
  - Record bank transactions
  - Monitor total bank balance

### 9. Expenses
- **Location:** Dashboard > Expenses
- **Features:**
  - Categorize expenses
  - Record payment method
  - Add descriptions and references
  - View expense summaries

### 10. Reports
- **Location:** Dashboard > Reports
- **Features:**
  - Generate Sales Reports (PDF)
  - Generate Purchase Reports (PDF)
  - Generate Expense Reports (PDF)
  - Custom date range selection
  - Professional formatting with shop details

---

## Data Structure

### Key Tables

**Users:** Store user account information and shop details

**Customers:** Customer profiles with reference numbers and images

**Traders:** Supplier/trader information

**Products:** Product catalog with pricing

**Inventory:** Stock levels and values

**Sales:** Sale invoices and line items

**Purchases:** Purchase bills and line items

**Accounts:** Chart of accounts for accounting

**Roznamcha:** Journal entries with debits and credits

**Banks:** Bank account information

**Expenses:** Expense records

**Notes:** Internal notes and reminders

---

## API Routes

The system uses the following API endpoints:

### Customers
- `GET /api/customers` - List customers
- `POST /api/customers` - Create customer
- `GET /api/customers/[id]` - Get specific customer
- `PUT /api/customers/[id]` - Update customer
- `DELETE /api/customers/[id]` - Delete customer

### Traders
- `GET /api/traders` - List traders
- `POST /api/traders` - Create trader
- `GET /api/traders/[id]` - Get trader
- `PUT /api/traders/[id]` - Update trader
- `DELETE /api/traders/[id]` - Delete trader

### Sales
- `GET /api/sales` - List sales
- `POST /api/sales` - Create sale (updates inventory)
- `GET /api/sales/[id]` - Get specific sale

### Purchases
- `GET /api/purchases` - List purchases
- `POST /api/purchases` - Create purchase (updates inventory)
- `GET /api/purchases/[id]` - Get purchase

### Inventory
- `GET /api/inventory` - List inventory
- `POST /api/inventory` - Add inventory

### Products
- `GET /api/products` - List products
- `POST /api/products` - Create product

### Expenses
- `GET /api/expenses` - List expenses
- `POST /api/expenses` - Create expense

### Banks
- `GET /api/banks` - List banks
- `POST /api/banks` - Create bank account

### Roznamcha
- `GET /api/roznamcha` - List journal entries
- `POST /api/roznamcha` - Create journal entry

---

## Key Features

### 1. Multi-User Support
- Each user has isolated data
- User-based filtering on all queries
- Secure authentication with Supabase

### 2. Automatic Inventory Updates
- Sales automatically decrease inventory
- Purchases automatically increase inventory
- Real-time inventory tracking

### 3. Payment Tracking
- Track payment status (Pending, Partial, Paid, Overdue)
- Manage customer and supplier balances
- Payment history

### 4. Financial Reports
- PDF export with custom headers
- Multiple report types
- Date range filtering
- Professional formatting

### 5. Reference Numbers
- Auto-generated reference numbers for customers/traders
- Invoice and bill numbering
- Entry number tracking

### 6. Image Support
- Store customer and supplier images
- Product images
- Profile pictures

---

## Troubleshooting

### Issue: "Cannot POST /api/customers"
**Solution:** Check that `.env.local` has correct Supabase credentials

### Issue: "User not authenticated"
**Solution:** Clear browser cookies and sign in again

### Issue: "Inventory not updating"
**Solution:** Ensure sale/purchase has line items before submitting

### Issue: "PDF not generating"
**Solution:** Check that date range is selected and data exists

---

## Development Features

### Type Safety
- Full TypeScript support
- Type definitions for all entities

### Error Handling
- Try-catch blocks in all API routes
- User-friendly error messages
- Validation on forms

### Performance
- Database indexes on frequently used fields
- Pagination on list views
- Optimized queries

### Security
- Secure authentication
- User data isolation
- Protected API routes
- CORS enabled

---

## Deployment

### Deploy to Vercel (Recommended)

1. Push code to GitHub:
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin YOUR_GITHUB_REPO
   git push -u origin main
   ```

2. Go to https://vercel.com
3. Click "New Project"
4. Import your GitHub repository
5. Add environment variables:
   - `NEXT_PUBLIC_SUPABASE_URL`
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`
6. Click "Deploy"

### Production Checklist
- [ ] Update `NEXT_PUBLIC_APP_URL` to production domain
- [ ] Test all modules
- [ ] Backup database
- [ ] Enable HTTPS
- [ ] Set up monitoring

---

## Support & Customization

This ERP system is fully customizable. To add new features:

1. Create new tables in Supabase
2. Add TypeScript types in `types/index.ts`
3. Create API routes in `app/api/`
4. Create dashboard pages in `app/dashboard/`

---

## License

This project is proprietary. All rights reserved.

---

## Contact

For support or questions about the Agrifarm ERP system, contact your system administrator.
