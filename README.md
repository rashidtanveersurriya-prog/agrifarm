# Agrifarm ERP System

A comprehensive, production-ready Enterprise Resource Planning (ERP) system built for modern businesses. Manage sales, purchases, inventory, financials, and more in one integrated platform.

## ✨ Features

### Core Functionality
- **Multi-User Support** - Isolated accounts for each business/user
- **Customer Management** - Store customer details, images, reference numbers, credit limits
- **Supplier/Trader Management** - Manage suppliers with complete contact information
- **Product Catalog** - Maintain product database with pricing and categories
- **Sales Management** - Create invoices, track payments, manage discounts and taxes
- **Purchase Management** - Record purchases, track supplier payments, manage bills
- **Inventory/Store Management** - Real-time inventory tracking with automatic updates
- **Financial Accounting** - Roznamcha (Journal) for double-entry bookkeeping
- **Bank Management** - Track multiple bank accounts and transactions
- **Expense Tracking** - Categorize and monitor business expenses
- **Notes & Reminders** - Store important notes and information
- **Professional Reports** - Generate PDF reports with custom headers and footers

## 🚀 Quick Start

### Prerequisites
- Node.js 18 or higher
- npm or yarn
- Supabase account (free tier available)

### Installation

1. **Install dependencies:**
   ```bash
   npm install
   ```

2. **Configure Supabase:**
   - Create account at https://supabase.com
   - Copy your Project URL and Anon Key
   - Run the schema from `supabase_schema.sql` in Supabase SQL Editor

3. **Set environment variables:**
   ```bash
   cp .env.example .env.local
   # Edit .env.local with your Supabase credentials
   NEXT_PUBLIC_SUPABASE_URL=your_url
   NEXT_PUBLIC_SUPABASE_ANON_KEY=your_key
   ```

4. **Start development server:**
   ```bash
   npm run dev
   ```

5. **Access the application:**
   Open http://localhost:3000 in your browser

## 📚 Documentation

For detailed setup instructions and feature documentation, see [SETUP.md](./SETUP.md)

## 🏗️ Architecture

### Tech Stack
- **Frontend:** Next.js 14, React 19, TypeScript
- **Styling:** Tailwind CSS
- **Database:** Supabase (PostgreSQL)
- **Authentication:** Supabase Auth
- **Reports:** jsPDF, jsPDF-AutoTable

## 📊 Modules

| Module | Purpose |
|--------|---------|
| **Customers** | Customer management & tracking |
| **Traders** | Supplier management |
| **Products** | Product catalog |
| **Sales** | Invoice management |
| **Purchases** | Bill management |
| **Inventory** | Stock tracking |
| **Roznamcha** | Accounting journal |
| **Banks** | Bank accounts |
| **Expenses** | Expense tracking |
| **Reports** | Financial reports |

## 🔐 Security

- Secure authentication with Supabase
- User data isolation
- Protected API routes
- HTTPS ready

## 🚀 Deployment

Deploy to Vercel, AWS, or your preferred platform. Environment variables required:
- `NEXT_PUBLIC_SUPABASE_URL`
- `NEXT_PUBLIC_SUPABASE_ANON_KEY`

## 📝 License

Proprietary - All rights reserved.

## 🆘 Support

For issues or questions, check [SETUP.md](./SETUP.md) or contact your administrator.

---

**Built with ❤️ for modern businesses**
