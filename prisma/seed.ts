// prisma/seed.ts
import { PrismaClient } from '../generated/prisma';

const prisma = new PrismaClient();

async function main() {
  console.log('Starting seed...');

  // Create a room
  const room = await prisma.room.create({
    data: {
      roomNumber: 'A101',
      capacity: 20,
      location: 'First Floor, West Wing'
    }
  });
  console.log('Created room:', room);

  // Create a member with user
  const memberUser = await prisma.user.create({
    data: {
      name: 'john_member',
      password: 'password123',
      typeOfUser: 'member',
      member: {
        create: {
          dob: new Date('1990-05-15'),
          gender: 'MALE',
          allergies: 'Peanuts',
          medicalConditions: 'None',
          heartbeatGoal: 140.0,
          caloriesGoal: 2500.0,
          stepsGoal: 10000.0
        }
      }
    },
    include: {
      member: true
    }
  });
  console.log('Created member:', memberUser);

  // Create a trainer with user
  const trainerUser = await prisma.user.create({
    data: {
      name: 'sarah_trainer',
      password: 'password123',
      typeOfUser: 'trainer',
      trainer: {
        create: {
          isWorking: true,
          hourlyRate: 50,
          certifications: 'Certified Personal Trainer, Yoga Instructor',
          bio: 'Experienced fitness trainer with 5+ years of experience'
        }
      }
    },
    include: {
      trainer: true
    }
  });
  console.log('Created trainer:', trainerUser);

  // Create an admin with user
  const adminUser = await prisma.user.create({
    data: {
      name: 'admin_user',
      password: 'password123',
      typeOfUser: 'system_admin',
      admin: {
        create: {}
      }
    },
    include: {
      admin: true
    }
  });
  console.log('Created admin:', adminUser);

  console.log('Seed completed successfully!');
}

main()
  .catch((e) => {
    console.error('Error during seed:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });