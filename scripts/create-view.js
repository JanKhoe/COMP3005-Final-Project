// scripts/createViews.ts
const { Pool } = require('pg');
require('dotenv').config({ path: '.env' });

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

async function createTrainerWorkView() {
  try {
    await pool.query(`
      DROP VIEW IF EXISTS trainer_work_data;
      
      CREATE VIEW trainer_work_data AS
      SELECT 
        t.id as trainer_id,
        co.id as class_offering_id,
        co."className",
        co.description,
        co."scheduleTime",
        co."durationMins",
        
        -- Room data
        r.id as room_id,
        r."roomNumber",
        r.capacity as room_capacity,
        r.location as room_location,
        
        -- PT Session specific data
        pts.id as pt_session_id,
        pts."goal_completed",
        pts."memberId",
        
        -- Group Class specific data
        gc.id as group_class_id,
        gc."capacityCount",
        gc."attendeesCount"
        
      FROM "Trainer" t
      LEFT JOIN "ClassOffering" co ON t.id = co."trainerId"
      LEFT JOIN "Room" r ON co."roomId" = r.id
      LEFT JOIN "PTSessionOffering" pts ON co.id = pts."classOfferingId"
      LEFT JOIN "GroupClassOffering" gc ON co.id = gc.id;
    `);
        
    console.log('View created successfully');
  } catch (error) {
    console.error('Error creating view:', error);
  } finally {
    await pool.end();
  }
}

createTrainerWorkView();



