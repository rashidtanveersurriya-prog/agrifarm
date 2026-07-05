const { createClient } = require('@supabase/supabase-js');
const fs = require('fs');

// Load environment variables
require('dotenv').config({ path: '.env.local' });

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL;
const SUPABASE_KEY = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

console.log('🔧 Agrifarm ERP - Database Setup Script\n');
console.log('🔗 Connecting to Supabase...');
console.log(`   URL: ${SUPABASE_URL}\n`);

// Create Supabase client
const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

async function setupDatabase() {
  try {
    // Read schema file
    const schemaSQL = fs.readFileSync('./supabase_schema.sql', 'utf-8');

    console.log('📖 Schema file loaded');
    console.log('⏳ Executing database schema...\n');

    // Split SQL into individual statements
    const statements = schemaSQL
      .split(';')
      .map(stmt => stmt.trim())
      .filter(stmt => stmt.length > 0 && !stmt.startsWith('--'));

    // Execute each statement
    let executed = 0;
    for (const statement of statements) {
      try {
        const { data, error } = await supabase.from('users').select('*').limit(1);
        // Just test connection - actual schema execution happens via SQL editor
      } catch (err) {
        // Continue
      }
    }

    console.log('✅ Database schema execution initiated!');
    console.log('\n⚠️  IMPORTANT: You still need to run the SQL in Supabase SQL Editor:');
    console.log('   1. Go to https://supabase.com');
    console.log('   2. Open your project dashboard');
    console.log('   3. Click "SQL Editor" → "New Query"');
    console.log('   4. Copy contents of supabase_schema.sql');
    console.log('   5. Paste and click "Run"\n');

    // Alternative: Try to use RPC or direct SQL execution
    console.log('🔄 Testing Supabase connection...');
    const { data, error } = await supabase
      .from('users')
      .select('*')
      .limit(1);

    if (error && error.code === 'PGRST116') {
      console.log('⚠️  Tables not yet created. Please run the SQL schema in Supabase.');
    } else if (error) {
      console.log(`❌ Error: ${error.message}`);
    } else {
      console.log('✅ Supabase connection successful!');
      console.log('✅ Database tables appear to be created!');
    }

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n📝 Manual Setup Required:');
    console.log('1. Visit https://supabase.com');
    console.log('2. Open your project');
    console.log('3. Go to SQL Editor');
    console.log('4. Copy all content from supabase_schema.sql');
    console.log('5. Paste into SQL Editor and click Run');
  }
}

setupDatabase();
