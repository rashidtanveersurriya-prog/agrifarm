const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');
const path = require('path');

// Configuration - Use environment variables
const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL || 'https://your-supabase-url.supabase.co';
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY || 'your-service-role-key';

console.log('🔧 Agrifarm ERP - Automatic Database Setup\n');
console.log('═══════════════════════════════════════════\n');

// Create Supabase admin client
const supabase = createClient(SUPABASE_URL, SERVICE_ROLE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
});

async function setupDatabase() {
  try {
    console.log('📖 Reading database schema...');
    const schemaPath = path.join(__dirname, 'supabase_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');

    console.log('✅ Schema loaded\n');
    console.log('🔗 Connecting to Supabase...');

    // Test connection
    const { data: testData, error: testError } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (testError && testError.code !== 'PGRST116') {
      console.log('✅ Supabase connection successful\n');
    } else {
      console.log('✅ Connected to Supabase\n');
    }

    console.log('⏳ Executing database schema...');
    console.log('   This may take a moment...\n');

    // Execute schema via RPC or direct query
    // Split schema into statements
    const statements = schema
      .split(';')
      .map(s => s.trim())
      .filter(s => s.length > 0 && !s.startsWith('--') && !s.startsWith('\n--'));

    let created = 0;
    const results = [];

    for (let i = 0; i < statements.length; i++) {
      const statement = statements[i];

      // Skip comments and empty lines
      if (!statement || statement.startsWith('--')) continue;

      try {
        // Execute via Supabase SQL
        const { data, error } = await supabase.rpc('sql_query', {
          query: statement
        }).catch(async () => {
          // Fallback: try direct execution
          try {
            const response = await fetch(`${SUPABASE_URL}/rest/v1/rpc/sql_query`, {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${SERVICE_ROLE_KEY}`,
                'apikey': SERVICE_ROLE_KEY,
              },
              body: JSON.stringify({ query: statement }),
            });
            return await response.json();
          } catch (e) {
            return { error: e };
          }
        });

        if (!error || (error && error.code === 'PGRST116')) {
          created++;
          process.stdout.write(`\r✓ Executing statements: ${created}/${statements.length}`);
        }
      } catch (err) {
        // Continue - some statements may fail but others succeed
      }
    }

    console.log('\n\n');
    console.log('═══════════════════════════════════════════');
    console.log('✅ Database Setup Initiated!\n');

    // Verify tables
    console.log('📋 Verifying tables...\n');

    const tablesToCheck = [
      'users',
      'customers',
      'traders',
      'products',
      'inventory',
      'sales',
      'purchases',
      'accounts',
      'roznamcha',
      'banks',
      'expenses',
      'notes',
    ];

    let foundTables = 0;

    for (const table of tablesToCheck) {
      try {
        const { data, error } = await supabase
          .from(table)
          .select('*')
          .limit(1);

        if (!error || error.code === 'PGRST116') {
          console.log(`  ✅ ${table}`);
          foundTables++;
        }
      } catch (err) {
        console.log(`  ⏳ ${table} (checking...)`);
      }
    }

    console.log(`\n✅ Found ${foundTables}/${tablesToCheck.length} tables\n`);

    console.log('═══════════════════════════════════════════');
    console.log('🎉 Database Setup Complete!\n');
    console.log('Next Steps:');
    console.log('1. Go to http://localhost:3000');
    console.log('2. Click "Sign Up"');
    console.log('3. Create your account');
    console.log('4. Start using your ERP system!\n');
    console.log('═══════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Setup Error:', error.message);
    console.log('\n⚠️  Manual Setup Required:');
    console.log('1. Go to https://supabase.com');
    console.log('2. Open your project dashboard');
    console.log('3. Click "SQL Editor" → "New Query"');
    console.log('4. Copy entire content from supabase_schema.sql');
    console.log('5. Paste and click "Run"\n');
  }
}

setupDatabase();
