import React, { useState } from "react";

const feeBreakdown = [
  { item: "Tuition Fee", amount: 400, dueDate: "10th each month", status: "paid" },
  { item: "Transport Fee", amount: 120, dueDate: "10th each month", status: "paid" },
  { item: "Library Fee", amount: 50, dueDate: "10th each month", status: "pending" },
  { item: "Lab Fee", amount: 80, dueDate: "15 May 2026", status: "pending" },
  { item: "Sports Fee", amount: 100, dueDate: "15 May 2026", status: "pending" },
  { item: "Activity Fee", amount: 70, dueDate: "20 May 2026", status: "pending" },
];

const paymentHistory = [
  { id: 1, date: "10 Apr 2026", amount: 520, method: "Credit Card", receipt: "REC-001", status: "paid" },
  { id: 2, date: "10 Mar 2026", amount: 520, method: "UPI", receipt: "REC-002", status: "paid" },
  { id: 3, date: "10 Feb 2026", amount: 470, method: "Net Banking", receipt: "REC-003", status: "paid" },
  { id: 4, date: "10 Jan 2026", amount: 520, method: "Credit Card", receipt: "REC-004", status: "paid" },
  { id: 5, date: "10 Dec 2025", amount: 400, method: "Cash", receipt: "REC-005", status: "paid" },
];

const paymentMethods = ["Credit Card", "Debit Card", "UPI", "Net Banking", "Cash"];

export default function Fees() {
  const [selectedMethod, setSelectedMethod] = useState("UPI");
  const [showPayModal, setShowPayModal] = useState(false);

  const totalFees = feeBreakdown.reduce((sum, f) => sum + f.amount, 0);
  const paidFees = feeBreakdown.filter((f) => f.status === "paid").reduce((sum, f) => sum + f.amount, 0);
  const dueFees = totalFees - paidFees;

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Fee Management</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Track and pay your child's fees</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <button onClick={() => setShowPayModal(true)} className="btn-primary bg-green-600 hover:bg-green-700 text-white px-6 py-2 rounded-lg text-sm font-medium">
              Pay Now
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
            <p className="text-sm text-gray-500 dark:text-gray-400">Total Fees</p>
            <p className="text-2xl font-bold text-gray-900 dark:text-white mt-1">${totalFees}</p>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
            <p className="text-sm text-gray-500 dark:text-gray-400">Paid</p>
            <p className="text-2xl font-bold text-green-600 mt-1">${paidFees}</p>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
            <p className="text-sm text-gray-500 dark:text-gray-400">Due</p>
            <p className="text-2xl font-bold text-red-600 mt-1">${dueFees}</p>
          </div>
          <div className="stat-card card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
            <p className="text-sm text-gray-500 dark:text-gray-400">Next Payment</p>
            <p className="text-2xl font-bold text-orange-600 mt-1">10 Jun 2026</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Fee Structure Breakdown</h2>
            <div className="space-y-3">
              {feeBreakdown.map((f) => (
                <div key={f.item} className="flex items-center justify-between p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                  <div>
                    <p className="font-medium text-gray-900 dark:text-white">{f.item}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">Due: {f.dueDate}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <span className="font-semibold text-gray-900 dark:text-white">${f.amount}</span>
                    {f.status === "paid" ? (
                      <span className="badge bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded text-xs">Paid</span>
                    ) : (
                      <span className="badge bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded text-xs">Due</span>
                    )}
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Payment History</h2>
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-200 dark:border-gray-700 text-gray-500 dark:text-gray-400">
                    <th className="text-left py-2">Date</th>
                    <th className="text-right py-2">Amount</th>
                    <th className="text-center py-2">Method</th>
                    <th className="text-center py-2">Receipt</th>
                    <th className="text-center py-2">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {paymentHistory.map((p) => (
                    <tr key={p.id} className="border-b border-gray-100 dark:border-gray-700">
                      <td className="py-3 text-gray-700 dark:text-gray-300">{p.date}</td>
                      <td className="py-3 text-right font-medium text-gray-900 dark:text-white">${p.amount}</td>
                      <td className="py-3 text-center text-gray-500 dark:text-gray-400">{p.method}</td>
                      <td className="py-3 text-center">
                        <button className="text-blue-600 dark:text-blue-400 text-xs underline">{p.receipt}</button>
                      </td>
                      <td className="py-3 text-center">
                        <span className="badge bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded text-xs">Paid</span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {dueFees > 0 && (
          <div className="card bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
            <div className="flex items-center gap-3">
              <span className="text-2xl">⚠️</span>
              <div>
                <p className="font-semibold text-yellow-800 dark:text-yellow-200">Due Fee Reminder</p>
                <p className="text-sm text-yellow-700 dark:text-yellow-300">You have ${dueFees} pending fee. Please pay before the due date to avoid late fees.</p>
              </div>
            </div>
          </div>
        )}

        {showPayModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">Pay Fees</h2>
                <button onClick={() => setShowPayModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl">&times;</button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">Amount Due</p>
                  <p className="text-3xl font-bold text-gray-900 dark:text-white">${dueFees}</p>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Select Payment Method</p>
                  <div className="grid grid-cols-2 gap-2">
                    {paymentMethods.map((method) => (
                      <button
                        key={method}
                        onClick={() => setSelectedMethod(method)}
                        className={`px-4 py-3 rounded-lg text-sm font-medium border transition-all ${
                          selectedMethod === method
                            ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20 text-blue-700 dark:text-blue-300"
                            : "border-gray-200 dark:border-gray-600 text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700"
                        }`}
                      >
                        {method}
                      </button>
                    ))}
                  </div>
                </div>
                <button className="btn-primary w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg text-sm font-medium">
                  Pay ${dueFees} via {selectedMethod}
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
