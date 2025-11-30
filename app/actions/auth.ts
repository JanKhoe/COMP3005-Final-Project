'use server'

import { prisma } from '@/lib/prisma'
import { UserType } from '@/generated/prisma'
import { MetricType } from '@/generated/prisma'
import type { HealthMetric } from '@/generated/prisma'
import type { Member } from '@/generated/prisma'
import { Gender } from '@/generated/prisma'




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
      include: { member: true }
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



export async function getMember(userId: number | undefined): Promise<Member | null> {
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
