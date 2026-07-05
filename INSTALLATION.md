# Agrifarm ERP - Quick Installation Guide

## 🚀 5-Minute Setup

### Step 1: Install Dependencies (1 min)
```bash
cd c:\Users\usr\agrifarm
npm install
```

### Step 2: Create Supabase Account (2 min)
1. Visit https://supabase.com
2. Click "Start your project"
3. Sign up or log in
4. Create a new project
5. Save your **Project URL** and **Anon Key** (displayed after project creation)

### Step 3: Set Up Database Schema (1 min)
1. In Supabase dashboard, go to **SQL Editor**
2. Click **New Query**
3. Open `supabase_schema.sql` from this project
4. Copy and paste entire content
5. Click **Run**
6. Wait for completion (you'll see green checkmark)

### Step 4: Configure Environment (1 min)
```bash
# Copy example file
copy .env.example .env.local

# Edit .env.local and add:
NEXT_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT_ID.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=YOUR_ANON_KEY
```

Get these values from:
- Supabase Dashboard > Settings > API > Project URL & Anon Key

### Step 5: Start Development Server (0 min)
```bash
npm run dev
```

## ✅ Verification

Open http://localhost:3000 in your browser. You should see:
- Agrifarm ERP splash screen
- Sign up / Login options
- Professional UI

## 🎯 First Use

1. **Sign Up:**
   - Email: your-email@example.com
   - Password: anything (min 6 chars)
   - Shop Name: Your Business Name
   - Fill other details

2. **Login** and go to Dashboard

3. **Create Sample Data:**
   - Add a Customer
   - Add a Product
   - Create a Sale

## 🆘 Troubleshooting

### "Cannot connect to Supabase"
- Check .env.local credentials
- Verify internet connection
- Restart dev server: `Ctrl+C`, then `npm run dev`

### "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

### "Database schema not found"
- Run supabase_schema.sql again
- Check SQL query result for errors

### "Authentication not working"
- Clear browser cookies
- Check Supabase project is active
- Verify credentials in .env.local

## 📚 Next Steps

1. Read [README.md](./README.md) for feature overview
2. Read [SETUP.md](./SETUP.md) for detailed documentation
3. Start creating records in each module
4. Generate reports

## 🎨 Optional Customization

### Change Port
```bash
npm run dev -- -p 8000
```

### Build for Production
```bash
npm run build
npm start
```

### Deploy to Vercel
```bash
npm install -g vercel
vercel
```

## 📞 Support

If something doesn't work:
1. Check the error message in browser console (F12)
2. Check `npm run dev` terminal for errors
3. Verify Supabase credentials
4. Try refreshing the page
5. Check that Supabase project is active

## ✨ You're Ready!

The ERP system is now running and ready to use. Start by:
1. Adding customers
2. Creating products
3. Recording sales/purchases
4. Checking inventory
5. Generating reports

---

**Happy ERP-ing! 🎉**
