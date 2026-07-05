const { Client } = require('pg');
const fs = require('fs');
const path = require('path');

console.log('🔧 Agrifarm ERP - Direct Database Setup\n');
console.log('═══════════════════════════════════════════\n');

// Supabase PostgreSQL connection details
const connectionConfig = {
  host: 'lagblxievlfcgcappknn.supabase.co',
  port: 5432,
  database: 'postgres',
  user: 'postgres',
  password: 'T96KP&dk5XE/ur-', // This is the password they set
  ssl: { rejectUnauthorized: false },
};

async function setupDatabase() {
  const client = new Client(connectionConfig);

  try {
    console.log('🔗 Connecting to PostgreSQL...');
    await client.connect();
    console.log('✅ Connected to database\n');

    console.log('📖 Reading schema file...');
    const schemaPath = path.join(__dirname, 'supabase_schema.sql');
    const schema = fs.readFileSync(schemaPath, 'utf-8');
    console.log('✅ Schema loaded\n');

    console.log('⏳ Executing database schema...');
    console.log('   This may take a moment...\n');

    // Execute entire schema
    const result = await client.query(schema);

    console.log('✅ Schema executed successfully!\n');

    // Verify tables
    console.log('📋 Verifying tables...\n');

    const query = `
      SELECT table_name
      FROM information_schema.tables
      WHERE table_schema = 'public'
      ORDER BY table_name
    `;

    const res = await client.query(query);
    const tables = res.rows.map(row => row.table_name);

    console.log(`Found ${tables.length} tables:\n`);
    tables.forEach(table => {
      console.log(`  ✅ ${table}`);
    });

    console.log('\n═══════════════════════════════════════════');
    console.log('🎉 Database Setup Complete!\n');
    console.log('Your Agrifarm ERP database is ready!\n');
    console.log('Next Steps:');
    console.log('1. Go to http://localhost:3000 (refresh if open)');
    console.log('2. Click "Sign Up"');
    console.log('3. Create your account with your email');
    console.log('4. Fill in your shop details');
    console.log('5. Start using your ERP system!\n');
    console.log('═══════════════════════════════════════════\n');

  } catch (error) {
    console.error('❌ Error:', error.message);
    console.log('\n💡 Troubleshooting:');
    console.log('- Make sure your Supabase project is active');
    console.log('- Verify the database password is correct');
    console.log('- Check your internet connection\n');
  } finally {
    await client.end();
  }
}

setupDatabase();
