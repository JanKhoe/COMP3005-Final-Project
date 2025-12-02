const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function setupDatabase() {
  try {
    
    // Insert sample admin
    console.log('Inserting sample admin...');
    
    await pool.query(`
      INSERT INTO "User" (name, password, "typeOfUser")
      VALUES ('admin', 'adminpass', 'system_admin')
    `);
    
    await pool.query(`
      INSERT INTO "Admin" ("userId", "accessLevel")
      VALUES (1, 'sudo')
    `);
    
    console.log('Sample data inserted successfully!');

    // Insert sample trainer
    console.log('Inserting sample trainer...');
    
    await pool.query(`
      INSERT INTO "User" (name, password, "typeOfUser")
      VALUES ('trainer', 'trainer', 'trainer')
      VALUES ('trainer2', 'trainer', 'trainer')

    `);
    
    await pool.query(`
      INSERT INTO "Trainer" ("userId", "isWorking", "hourlyRate", "certifications", "bio")
      VALUES (2, true, 60, 'CPT, Strength Training', 'Passionate about helping people get stronger.')
      VALUES (3, true, 85, 'CPT, Strength Training', 'Passionate about helping people get stronger.')
    `);
    
    console.log('Sample trainer inserted successfully!');

    // Insert sample rooms
    console.log('Inserting sample rooms...');
    
    await pool.query(`
      INSERT INTO "Room" ("roomNumber", "capacity", "location") VALUES
      ('R101', 50, 'First Floor - Main Hall'),
      ('R102', 40, 'First Floor - Gym Area'),
      ('R201', 25, 'Second Floor - North Wing'),
      ('R202', 30, 'Second Floor - South Wing'),
      ('R300A', 10, 'Third Floor - Studio A'),
      ('R300B', 10, 'Third Floor - Studio B'),
      ('R300C', 10, 'Third Floor - Studio C')
    `);
    
    console.log('Sample rooms inserted successfully!');
    console.log('Database setup complete!');
    
  } catch (error) {
    console.error('Error setting up database:', error);
  } finally {
    await pool.end();
  }
}

setupDatabase();