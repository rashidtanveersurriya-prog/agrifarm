# SuperAdmin Panel Setup Guide

## Overview
The SuperAdmin panel allows you to approve or reject shop registrations before they can access the main ERP system.

## Database Setup

### 1. Execute the Migration
Run this SQL in your Supabase SQL Editor:

```sql
-- Add shop approval status to users table
ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;
ALTER TABLE users ADD COLUMN IF NOT EXISTS approval_notes TEXT;
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;
ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by UUID;

-- Create superadmin user type
CREATE TYPE superadmin_role AS ENUM ('superadmin', 'support');

-- Create superadmin users table
CREATE TABLE IF NOT EXISTS superadmin_users (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  full_name VARCHAR(255),
  role superadmin_role DEFAULT 'support',
  is_active BOOLEAN DEFAULT TRUE,
  last_login TIMESTAMP,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create approval logs table
CREATE TABLE IF NOT EXISTS approval_logs (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
  superadmin_id UUID NOT NULL REFERENCES superadmin_users(id),
  action VARCHAR(50) NOT NULL,
  notes TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved);
CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);
CREATE INDEX IF NOT EXISTS idx_approval_logs_user_id ON approval_logs(user_id);
```

### 2. Create SuperAdmin User
After running the migration, insert a superadmin user:

```sql
INSERT INTO superadmin_users (email, password_hash, full_name, role) 
VALUES ('admin@softtech.com', 'admin123', 'Softtech Admin', 'superadmin');
```

**Default Credentials:**
- Email: `admin@softtech.com`
- Password: `admin123`

⚠️ **IMPORTANT**: Change these credentials immediately in production!

## How to Use

### 1. Access SuperAdmin Panel
- URL: `https://your-app.vercel.app/superadmin/login`
- Login with superadmin credentials

### 2. Dashboard Features
- **Pending Shops Tab**: View all shops awaiting approval
- **Approved Shops Tab**: View all approved shops
- **Statistics**: See pending, approved, and total shop counts

### 3. Approve a Shop
1. Click "Review" on a pending shop
2. View shop details in the right panel
3. Add approval notes (optional)
4. Click "✓ Approve Shop"
5. Shop owner can now login and use the ERP

### 4. Reject a Shop
1. Click "Review" on a pending shop
2. Add rejection reason in approval notes
3. Click "✗ Reject Shop"
4. Shop will remain unapproved and cannot login

## Shop Registration Flow

1. **User Signs Up** 
   - New shop created with `is_approved = FALSE`
   - User cannot login to main ERP yet

2. **SuperAdmin Approves**
   - SuperAdmin reviews shop details
   - Clicks "Approve Shop"
   - Approval is logged

3. **User Can Login**
   - User receives approval notification (optional)
   - User can now login to main ERP system
   - Dashboard and all modules accessible

## API Endpoints

### SuperAdmin Login
```
POST /api/superadmin/login
Body: { email, password }
Response: { token, superadmin_id, email, full_name }
```

### Get All Shops
```
GET /api/superadmin/shops
Headers: Authorization: Bearer <token>
Response: { data: [shop1, shop2, ...] }
```

### Approve Shop
```
POST /api/superadmin/approve
Headers: Authorization: Bearer <token>
Body: { shop_id, approval_notes }
Response: { success: true, message }
```

### Reject Shop
```
POST /api/superadmin/reject
Headers: Authorization: Bearer <token>
Body: { shop_id, approval_notes }
Response: { success: true, message }
```

## Features

✅ View pending shop registrations
✅ View approved shops
✅ Review shop details (owner, email, phone, location)
✅ Approve shops with notes
✅ Reject shops with reason
✅ Automatic logging of all approvals/rejections
✅ Statistics dashboard
✅ Secure authentication
✅ Professional UI

## Next Steps

1. Run the SQL migration in Supabase
2. Create superadmin user
3. Access `/superadmin/login`
4. Change default credentials
5. Start approving shop registrations

## Security Notes

- ⚠️ Update default superadmin password immediately
- ⚠️ Use strong passwords
- ⚠️ In production, implement JWT tokens instead of base64
- ⚠️ In production, use bcrypt for password hashing
- ⚠️ Enable HTTPS only
- ⚠️ Limit superadmin access to trusted IP addresses (if possible)

## Powered by Softtech
© 2026 Softtech. All rights reserved.
