// scripts/createTriggers.ts
import pool from '@/lib/db';

async function createAttendeeCountTrigger() {
  try {
    await pool.query(`
      -- Function to update attendees count when a member joins a class
      CREATE OR REPLACE FUNCTION update_group_class_attendees_count()
      RETURNS TRIGGER AS $$
      BEGIN
        -- Increment count for the group class (column A = GroupClassOffering.id)
        UPDATE "GroupClassOffering"
        SET "attendeesCount" = "attendeesCount" + 1
        WHERE id = NEW."A";
        
        RETURN NEW;
      END;
      $$ LANGUAGE plpgsql;

      -- Drop trigger if it exists
      DROP TRIGGER IF EXISTS group_class_attendees_trigger ON "_MembersInGroupClasses";

      -- Create trigger on the join table (only for INSERT)
      CREATE TRIGGER group_class_attendees_trigger
      AFTER INSERT ON "_MembersInGroupClasses"
      FOR EACH ROW
      EXECUTE FUNCTION update_group_class_attendees_count();
    `);
    
    console.log('Attendee count trigger created successfully');
  } catch (error) {
    console.error('Error creating trigger:', error);
  } finally {
    await pool.end();
  }
}

createAttendeeCountTrigger();