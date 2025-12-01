'use server'

import { prisma } from '@/lib/prisma'
import { UserType } from '@/generated/prisma'
import { MetricType } from '@/generated/prisma'
import { Gender } from '@/generated/prisma'
import { ClassType } from '@/generated/prisma'
import type { HealthMetric } from '@/generated/prisma'
import type { Member, User, Trainer, ClassOffering, Room } from '@/generated/prisma'

// METRIC SERVER ACTIONS
export async function getMetricsForMember(id: number | undefined): Promise<HealthMetric[]> {
  try {
    if (!id) return [];
    console.log(id);
    return await prisma.healthMetric.findMany({
      where: {
        memberId: id,
      },
      orderBy: {
        measuredAt: 'asc'
      }
    });
  } catch (error) {
    console.error("Error fetching metrics:", error);
    return [];
  }
}

export async function addMetric(metricType: MetricType, value: number, memberId: number|undefined, measuredAt?: Date) {
  try {
    if(!memberId) return { success: false };
    const metric = await prisma.healthMetric.create({
      data: {
        metricType,
        value,
        memberId,
        measuredAt: measuredAt ?? undefined
      }
    });
    return { success: true, metric };

  } catch (error) {
    console.error('Metric creation error:', error);
    return { success: false, error: 'Failed to add metric' };
  }
}

// USER SERVER ACTIONS
export async function loginUser(username: string, password: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { name: username },
      include: { member: true, trainer: true }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    if (user.password !== password) {
      return { success: false, error: 'Invalid password' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Login failed' }
  }
}



export async function registerUser(username: string, password: string, date_of_birth: string, gender: Gender, allergies: string, medical_conditions: string) {
    console.log(username, password);
  try {
    // Check if user already exists
    const existingUser = await prisma.user.findFirst({
      where: { name: username }
    })

    if (existingUser) {
      return { success: false, error: 'Username already exists' }
    }

    // Create user with associated member
    const user = await prisma.user.create({
      data: {
        name: username,
        password: password,
        typeOfUser: UserType.member,
        member: {
          create: {
            dob: new Date(date_of_birth),
            gender: gender,
            allergies: allergies,
            medicalConditions: medical_conditions
          }
        }
      },
      include: {
        member: true
      }
    })

    return { success: true, user }
  } catch (error) {
    console.error('Registration error:', error)
    return { success: false, error: 'Failed to create user' }
  }
}

// Member functions

export async function updateMemberGoal(
  memberId: number,
  metricType: MetricType,
  goalValue: number
) {
  try {
    const goalField = `${metricType}Goal` as 'heartbeatGoal' | 'caloriesGoal' | 'stepsGoal';
    
    await prisma.member.update({
      where: { id: memberId },
      data: { [goalField]: goalValue }
    });
    
    return { success: true };
  } catch (error) {
    console.error('Error updating goal:', error);
    return { success: false, error: 'Failed to update goal' };
  }
}



export async function getMember(userId: number | undefined) {
  if (!userId) return null;

  try {
    const member = await prisma.member.findUnique({
      where: {
        id: userId,
      },
      include: {
        healthMetrics: true,
        user: true            
      }
    });

    return member;
  } catch (error) {
    console.error("Error fetching member by userId:", error);
    return null;
  }
}

export async function updateMemberInfo(
  memberId: number,
  dateOfBirth: string,
  gender: Gender,
  allergies: string,
  medicalConditions: string
) {
  try {
    const updatedMember = await prisma.member.update({
      where: { id: memberId },
      data: {
        dob: new Date(dateOfBirth),
        gender: gender,
        allergies: allergies,
        medicalConditions: medicalConditions,
      },
      include: {
        user: true
      }
    });

    return { success: true, member: updatedMember };
  } catch (error) {
    console.error('Update member info error:', error);
    return { success: false, error: 'Failed to update member information' };
  }
}

/// ADMIN PAGE FUNCTIONS
// Function for getting all members for admin view
export async function getAllUsers(): Promise<User[]> {
  try {
    const users = await prisma.user.findMany({
      include: {
        member: true,
        trainer: true,
        admin: true
      }
    });
    return users;
  } catch (error) {
    console.error("Error fetching all members:", error);
    return [];
  }
}

// Function for getting all classeofferings for admin view
export async function getAllClasses(){
  try {
    console.log("Fetching all classes...");
    const classes = await prisma.classOffering.findMany({
      include: {
        trainer: true,
        room: true,
        groupClass: true,
        ptSession: true
      }
    });
    return classes;
  } catch (error) {
    console.error("Error fetching all classes:", error);
    return [];
  }
}

// Function for getting all rooms for admin view
export async function getAllRooms(): Promise<Room[]> {
  try {
    const rooms = await prisma.room.findMany();
    return rooms;
  } catch (error) {
    console.error("Error fetching all rooms:", error);
    return [];
  }
}

// Function for checking schedule conflicts when adding a new class offering
export async function checkScheduleConflict(
  scheduleTime: Date,
  durationMins: number,
  roomId: number
): Promise<boolean> {
  try {
    const endTime = new Date(scheduleTime.getTime() + durationMins * 60000);  
    const conflictingClasses = await prisma.classOffering.findMany({
      where: {
        roomId: roomId,
        AND: [
          {
            scheduleTime: {
              lt: endTime
            }
          },
          {
            scheduleTime: {
              gt: new Date(scheduleTime.getTime() - durationMins * 60000)
            }
          }
        ]
      }
    });

    return conflictingClasses.length > 0;
  } catch (error) {
    console.error("Error checking schedule conflict:", error);
    return false;
  }
}

// Function for adding a new class offering (AddClassButton)
export async function addClassOffering(
  className: string,
  description: string,
  scheduleTime: Date,
  durationMins: number,
  trainerId: number,
  roomId: number,
  classType: ClassType,

  gcCapacity?: number,
  ptMemberId?: number,
  ptGoal?: string

) {
  try {
    const classOffering = await prisma.classOffering.create({
      data: {
        className,
        description,
        scheduleTime,
        durationMins,
        trainerId,
        roomId,
        classType
      }
    });

    const room = await prisma.room.findUnique({
      where: { id: roomId }
    });

    // Check capacity constraints
    if (room && room.capacity < (gcCapacity || 10)) {
      return { success: false, error: "Room capacity is less than the group class capacity." };
    }
    // Check schedule conflicts
    const hasConflict = await checkScheduleConflict(scheduleTime, durationMins, roomId);
    if (hasConflict) {
      return { success: false, error: "Schedule conflict detected for room" + roomId + " and time" + scheduleTime.toString() };
    }

    if (classType === ClassType.group) {
      await prisma.groupClassOffering.create({
        data: {
          classOfferingId: classOffering.id, // 1-to-1 link
          capacityCount: gcCapacity || 10,
          attendeesCount: 0
        }
      });
    }

    if (classType === ClassType.personal_training) {
      if (!ptMemberId) {
        return { success: false, error: "PT Session requires a memberId." };
      }

      await prisma.pTSessionOffering.create({
        data: {
          classOfferingId: classOffering.id,
          memberId: ptMemberId,
          goal_completed: false,
          goal: ptGoal || ''
        }
      });
    }

    return { success: true };
  } catch (error) {
    console.error("Error creating class offering:", error);
    return { success: false, error };
  }
}

// Function for deleting a class offering
export async function deleteClassOffering(classId: number) {
  try {
    await prisma.classOffering.delete({
      where: { id: classId }
    });
    return { success: true };
  } catch (error) {
    console.error("Error deleting class offering:", error);
    return { success: false, error };
  }
}

export async function registerForClassOffering(groupClassId: number, memberId: number){
  await prisma.groupClassOffering.update({
  where: { id: groupClassId },
  data: {
    members: {
      connect: { id: memberId }
    }
  }
})
}

export async function getMemberRegisteredClasses(memberId: number) {
  const member = await prisma.member.findUnique({
    where: { id: memberId },
    include: {
      groupClasses: true
    }
  });

  if (!member) return null;

  return member.groupClasses;
}

/// TRAINER PAGE FUNCTIONS

export async function getTrainer(userId: number | undefined): Promise<Trainer | null> {
  if (!userId) return null;
 
  try {
    const trainer = await prisma.trainer.findUnique({
      where: {
        userId: userId,
      },
      include: {
        user: true,
        registeredClasses: true,
      },
    });

    return trainer;
  } catch (error) {
    console.error("Error fetching trainer by userId:", error);
    return null;
  }
}

export async function searchMember(name: string) { // For the search bar, find member by name
  try {
    const member = await prisma.member.findFirst({
      where: {
        user: {
          name: {
            contains: name,
            mode: "insensitive",
          },
        },
      },
      include: {
        user: true,
        healthMetrics: {
          orderBy: { measuredAt: "desc" },
          take: 1, // <-- ONLY the most recent metric
        },
      },
    });

    return member;
  } catch (err) {
    console.error("Error searching member:", err);
    return null;
  }
}