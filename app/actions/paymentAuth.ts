'use server'

import { prisma } from "@/lib/prisma";
import { Trainer } from "@/generated/prisma";
import { Payment } from "@/generated/prisma";

export async function generatePaymentsForAllTrainers() {
  try {
    // Fetch all trainers
    const trainers = await prisma.trainer.findMany();

    if (trainers.length === 0) {
      return { success: false, error: "No trainers found." };
    }

    // Create a payment entry for each trainer with hourlyRate as amount
    const payments = await Promise.all(
      trainers.map((trainer) =>
        prisma.payment.create({
          data: {
            trainerId: trainer.id,
            amount: trainer.hourlyRate,
            dateOpened: new Date()
          },
        })
      )
    );

    return { success: true, count: payments.length };
  } catch (error) {
    console.error("Error generating payments:", error);
    return { success: false, error: String(error) };
  }
}

export async function getAllPayments(): Promise<Payment[] | null> {
  try {
    const payments = await prisma.payment.findMany();
    return payments;
  } catch (error) {
    console.error("Error fetching payments:", error);
    return null;
  }
}

// Set payment as paid by updating datePaid
export async function payPayment(paymentId: number) {
  try {
    const updatedPayment = await prisma.payment.update({
      where: { id: paymentId },
      data: {
        paymentDate: new Date(), // <-- correct way to set current timestamp
      },
    });

    return { success: true, payment: updatedPayment };
  } catch (error) {
    console.error("Error paying payment:", error);
    return { success: false, error: String(error) };
  }
}