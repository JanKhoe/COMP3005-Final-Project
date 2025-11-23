const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  try {
    console.log('Dropping existing table.')



    await pool.query(`
      DROP TABLE IF EXISTS students;
    `);


    console.log('Creating students table...');
    
    await pool.query(`
      CREATE TABLE IF NOT EXISTS students (
        student_id SERIAL PRIMARY KEY,
        first_name TEXT NOT NULL,
        last_name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        enrollment_date DATE
      );
    `);
    
    console.log('Students table created successfully!');
    
    // Optional: Insert sample data
    console.log('Inserting sample data...');
    
    await pool.query(`
      INSERT INTO students (first_name, last_name, email, enrollment_date) VALUES
('John', 'Doe', 'john.doe@example.com', '2023-09-01'),
('Jane', 'Smith', 'jane.smith@example.com', '2023-09-01'),
('Jim', 'Beam', 'jim.beam@example.com', '2023-09-02');
    `);
    
    console.log('Sample data inserted successfully!');
    console.log('Database setup complete!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();