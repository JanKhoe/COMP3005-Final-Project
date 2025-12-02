/*
INSERT INTO "User" (name, password, "typeOfUser")
VALUES ('admin', 'adminpass', 'system_admin');
*/

-- Insert trainer users into the User table

INSERT INTO "User" (name, password, "typeOfUser")
VALUES 
  ('Alice Johnson', 'password123', 'trainer'),
  ('Bob Smith', 'securepass', 'trainer'),
  ('Carla Lopez', 'trainme', 'trainer');



DELETE FROM "Trainer"
WHERE id = 10;

-- Insert into Trainer using the IDs of the new Users
INSERT INTO "Trainer" ("userId", "isWorking", "hourlyRate", "certifications", "bio")
VALUES
  (1, true, 60, 'CPT, Strength Training', 'Passionate about helping people get stronger.'),
   (2, true, 50, 'CPT', 'Former athlete turned professional trainer.'),
   (3, false, 55, NULL, 'Currently on leave.');
   

INSERT INTO "Room" ("roomNumber", "capacity", "location") VALUES
('R101', 50, 'First Floor - Main Hall'),
('R102', 40, 'First Floor - Gym Area'),
('R201', 25, 'Second Floor - North Wing'),
('R202', 30, 'Second Floor - South Wing'),
('R300A', 10, 'Third Floor - Studio A'),
('R300B', 10, 'Third Floor - Studio B'),
('R300C', 10, 'Third Floor - Studio C');


INSERT INTO "User" (name, password, "typeOfUser")
VALUES ('john', '123', 'member');