"use client";

import { useState } from "react";
import { generatePaymentsForAllTrainers, getAllPayments, payPayment } from "../actions/paymentAuth";
import { Payment } from "@/generated/prisma/edge";
import { useEffect } from 'react';
import { deleteClassOffering } from "../actions/auth";

export default function GeneratePaymentsButton() {
  const [message, setMessage] = useState("");
  const [ payments, setPayments ] = useState<Payment[]>([]);

  const handleGenerate = async () => {
    setMessage("Generating payments...");

    const result = await generatePaymentsForAllTrainers();

    if (result.success) {
      setMessage(`Payments created for ${result.count} trainers.`);
    } else {
      setMessage("Failed to generate payments: " + result.error);
    }
  };

  // Get all rooms for admin view
  useEffect(() => {
    async function fetchPayments() {
      const allPayments = await getAllPayments();
      if (!allPayments) return;
      setPayments(allPayments);
    }
    fetchPayments();
  }, []);
  

  return (
    <div className="flex flex-col gap-3 p-4 border rounded-lg bg-white dark:bg-zinc-900">
      <button
        onClick={handleGenerate}
        className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
      >
        Generate Payments for All Trainers
      </button>

      {message && <p className="text-sm mt-2">{message}</p>}

      {/* PAYMENT TABLE */}
      <h2 className="text-xl font-semibold mb-4 text-black dark:text-white">
        Payments
      </h2>

        {/* Header */}
      <table className="w-full text-sm text-left">
        <thead className="bg-gray-100 dark:bg-zinc-800 text-black dark:text-white">
            <tr>
            <th className="py-2 px-3 font-semibold">Date Opened</th>
            <th className="py-2 px-3 font-semibold">Trainer ID</th>
            <th className="py-2 px-3 font-semibold">Amount</th>
            <th className="py-2 px-3 font-semibold">Date Paid</th>
            </tr>
        </thead>

        <tbody className="text-black dark:text-white">
            {payments.map((p) => (
            <tr
                key={p.id}
                className="border-b border-zinc-200 dark:border-zinc-700 hover:bg-gray-50 dark:hover:bg-zinc-800"
            >
                <td className="py-2 px-3">{p.dateOpened.toLocaleDateString()}</td>
                <td className="py-2 px-3">{p.trainerId}</td>
                <td className="py-2 px-3">{"$" + p.amount}</td>
                <td className="py-2 px-3">
                  {p.paymentDate ? p.paymentDate.toLocaleDateString() : "Not Paid"}
                </td>
                {/* Pay button */}
                <td className="py-2 px-3">
                  <button
                    className="px-3 py-1 bg-green-500 text-white rounded hover:bg-red-600"
                    onClick={async () => {
                        const result = await payPayment(p.id);

                        if (result.success && result.payment) {
                          // Update payment immediately in UI
                          setPayments(prev =>
                            prev.map(pay => pay.id === p.id ? { ...pay, paymentDate: result.payment.paymentDate } : pay)
                          );
                        }
                      }
                    }
                  >
                    Pay
                  </button>
                </td>
            </tr>
            ))}
        </tbody>
      </table>

    </div>
  );
}