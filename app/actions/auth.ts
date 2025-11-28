'use server'

import { prisma } from '@/lib/prisma'
import { UserType } from '@/generated/prisma'

export async function loginUser(username: string, password: string) {
  try {
    const user = await prisma.user.findFirst({
      where: { name: username },
      include: { member: true }
    })

    if (!user) {
      return { success: false, error: 'User not found' }
    }

    // TODO: Use bcrypt.compare() when you add password hashing
    if (user.password !== password) {
      return { success: false, error: 'Invalid password' }
    }

    return { success: true, user }
  } catch (error) {
    console.error('Login error:', error)
    return { success: false, error: 'Login failed' }
  }
}

export async function registerUser(username: string, password: string) {
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
          create: {}
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