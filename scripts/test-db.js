const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function testConnection() {
  try {
    console.log('Testing database connection...');
    console.log('Connection string:', process.env.DATABASE_URL?.replace(/:[^:@]+@/, ':****@')); // Hide password
    
    const result = await pool.query('SELECT NOW()');
    console.log('✅ Connection successful!');
    console.log('Current time from database:', result.rows[0].now);
    
    // Check if students table exists
    const tableCheck = await pool.query(`
      SELECT EXISTS (
        SELECT FROM information_schema.tables 
        WHERE table_name = 'students'
      );
    `);
    
    if (tableCheck.rows[0].exists) {
      console.log('✅ Students table exists');
      
      // Count students
      const count = await pool.query('SELECT COUNT(*) FROM students');
      console.log(`📊 Number of students: ${count.rows[0].count}`);
    } else {
      console.log('⚠️  Students table does not exist yet');
    }
    
  } catch (error) {
    console.error('❌ Connection failed!');
    console.error('Error:', error.message);
    
    if (error.code === 'ECONNREFUSED') {
      console.log('\n💡 Tips:');
      console.log('- Is PostgreSQL running?');
      console.log('- Check if the port (5432) is correct');
    } else if (error.code === '28P01') {
      console.log('\n💡 Authentication failed. Check your username and password.');
    } else if (error.code === '3D000') {
      console.log('\n💡 Database does not exist. Create it first.');
    }
  } finally {
    await pool.end();
  }
}

testConnection();