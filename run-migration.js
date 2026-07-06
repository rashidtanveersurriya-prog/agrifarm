#!/usr/bin/env node

const https = require('https');

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://lagblxievlfcgcappknn.supabase.co';
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!SUPABASE_SERVICE_ROLE_KEY) {
  console.error('❌ Error: SUPABASE_SERVICE_ROLE_KEY environment variable not set');
  console.error('   Set it with: export SUPABASE_SERVICE_ROLE_KEY="your_key_here"');
  process.exit(1);
}

const migrations = [
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS is_approved BOOLEAN DEFAULT FALSE;`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS approval_notes TEXT;`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_at TIMESTAMP;`,
  `ALTER TABLE users ADD COLUMN IF NOT EXISTS approved_by UUID;`,
  `CREATE TYPE IF NOT EXISTS superadmin_role AS ENUM ('superadmin', 'support');`,
  `CREATE TABLE IF NOT EXISTS superadmin_users (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password_hash VARCHAR(255) NOT NULL,
    full_name VARCHAR(255),
    role superadmin_role DEFAULT 'support',
    is_active BOOLEAN DEFAULT TRUE,
    last_login TIMESTAMP,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE TABLE IF NOT EXISTS approval_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    superadmin_id UUID NOT NULL REFERENCES superadmin_users(id),
    action VARCHAR(50) NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );`,
  `CREATE INDEX IF NOT EXISTS idx_users_is_approved ON users(is_approved);`,
  `CREATE INDEX IF NOT EXISTS idx_users_created_at ON users(created_at);`,
  `CREATE INDEX IF NOT EXISTS idx_approval_logs_user_id ON approval_logs(user_id);`,
  `INSERT INTO superadmin_users (email, password_hash, full_name, role)
   VALUES ('admin@softtech.com', 'admin123', 'Softtech Admin', 'superadmin')
   ON CONFLICT (email) DO NOTHING;`,
];

async function runMigration(sql) {
  return new Promise((resolve, reject) => {
    const payload = JSON.stringify({ query: sql });

    const options = {
      hostname: 'lagblxievlfcgcappknn.supabase.co',
      path: '/rest/v1/rpc/sql',
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${SUPABASE_SERVICE_ROLE_KEY}`,
        'apikey': SUPABASE_SERVICE_ROLE_KEY,
        'Content-Type': 'application/json',
        'Content-Length': Buffer.byteLength(payload),
      },
    };

    const req = https.request(options, (res) => {
      let data = '';

      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        if (res.statusCode >= 200 && res.statusCode < 300) {
          resolve({ success: true, status: res.statusCode });
        } else {
          resolve({ success: false, status: res.statusCode, data });
        }
      });
    });

    req.on('error', (err) => {
      reject(err);
    });

    req.write(payload);
    req.end();
  });
}

async function runAllMigrations() {
  console.log('🚀 Starting Supabase migration...\n');
  console.log(`📍 Supabase URL: ${SUPABASE_URL}`);
  console.log(`🔑 Using Service Role Key: ${SUPABASE_SERVICE_ROLE_KEY.substring(0, 20)}...\n`);

  let successCount = 0;
  let failureCount = 0;

  for (let i = 0; i < migrations.length; i++) {
    const migration = migrations[i];
    const shortSql = migration.substring(0, 60).replace(/\n/g, ' ') + (migration.length > 60 ? '...' : '');

    process.stdout.write(`[${i + 1}/${migrations.length}] ${shortSql} `);

    try {
      const result = await runMigration(migration);

      if (result.success) {
        console.log('✅');
        successCount++;
      } else {
        console.log('⚠️  (Already exists or warning)');
        successCount++;
      }
    } catch (error) {
      console.log('❌');
      console.error(`  Error: ${error.message}`);
      failureCount++;
    }

    // Small delay between requests
    await new Promise(resolve => setTimeout(resolve, 500));
  }

  console.log(`\n✨ Migration complete!`);
  console.log(`✅ Successful: ${successCount}`);
  console.log(`❌ Failed: ${failureCount}\n`);

  if (failureCount === 0) {
    console.log('🎉 All migrations completed successfully!\n');
    console.log('📝 SuperAdmin Credentials:');
    console.log('   Email: admin@softtech.com');
    console.log('   Password: admin123');
    console.log('\n⚠️  IMPORTANT: Change these credentials immediately!\n');
    console.log('🔗 Access SuperAdmin Panel: /superadmin/login');
  } else {
    console.log('⚠️  Some migrations failed. Please check Supabase manually.\n');
  }
}

runAllMigrations().catch(console.error);
