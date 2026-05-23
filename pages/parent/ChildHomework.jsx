import React, { useState } from "react";

const children = [
  { id: 1, name: "Aarav Sharma", class: "10 - A" },
  { id: 2, name: "Ananya Sharma", class: "8 - B" },
];

const initialHomework = [
  { id: 1, subject: "Mathematics", teacher: "Dr. Sharma", assigned: "12 May 2026", due: "18 May 2026", priority: "High", description: "Solve 20 problems from Chapter 5: Quadratic Equations. Show all steps.", status: "Pending" },
  { id: 2, subject: "Physics", teacher: "Mrs. Gupta", assigned: "13 May 2026", due: "20 May 2026", priority: "Medium", description: "Write a lab report on the Laws of Motion experiment conducted in class.", status: "Pending" },
  { id: 3, subject: "Chemistry", teacher: "Mr. Verma", assigned: "10 May 2026", due: "17 May 2026", priority: "High", description: "Complete the Periodic Table worksheet and memorize first 30 elements.", status: "Submitted" },
  { id: 4, subject: "English", teacher: "Ms. Singh", assigned: "08 May 2026", due: "15 May 2026", priority: "Low", description: "Write an essay on 'The Importance of Education' (500 words).", status: "Submitted" },
  { id: 5, subject: "Biology", teacher: "Dr. Patel", assigned: "05 May 2026", due: "12 May 2026", priority: "Medium", description: "Draw and label the human digestive system.", status: "Overdue" },
  { id: 6, subject: "History", teacher: "Mr. Singh", assigned: "06 May 2026", due: "13 May 2026", priority: "Low", description: "Read Chapter 3 and answer the review questions.", status: "Overdue" },
];

const tabs = ["All", "Pending", "Submitted", "Overdue"];

const priorityColors = {
  High: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
  Medium: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  Low: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
};

const statusColors = {
  Pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  Submitted: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  Overdue: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
};

export default function ChildHomework() {
  const [selectedChild, setSelectedChild] = useState(children[0].id);
  const [activeTab, setActiveTab] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [homework, setHomework] = useState(initialHomework);

  const filtered = activeTab === "All" ? homework : homework.filter((h) => h.status === activeTab);

  const child = children.find((c) => c.id === selectedChild);

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Homework</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Monitor your child's homework assignments</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {children.map((c) => <option key={c.id} value={c.id}>{c.name} - {c.class}</option>)}
            </select>
          </div>
        </div>

        <div className="flex gap-2 flex-wrap">
          {tabs.map((tab) => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeTab === tab
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}>{tab}</button>
          ))}
        </div>

        <div className="grid grid-cols-1 gap-4">
          {filtered.map((hw) => (
            <div key={hw.id} className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{hw.subject}</h3>
                    <span className={`badge text-xs px-2 py-0.5 rounded-full ${priorityColors[hw.priority]}`}>{hw.priority}</span>
                    <span className={`badge text-xs px-2 py-0.5 rounded-full ${statusColors[hw.status]}`}>{hw.status}</span>
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-1">Teacher: {hw.teacher}</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">Assigned: {hw.assigned} | Due: {hw.due}</p>
                  <p className="text-gray-700 dark:text-gray-300 mb-3">{hw.description}</p>
                </div>
                <div className="flex-shrink-0">
                  <button
                    onClick={() => { setSelectedHomework(hw); setShowModal(true); }}
                    className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium"
                  >
                    View Details
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && selectedHomework && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-lg mx-4 shadow-xl">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white">{selectedHomework.subject} - Details</h2>
                <button onClick={() => setShowModal(false)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl">&times;</button>
              </div>
              <div className="space-y-4">
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Teacher</p>
                  <p className="text-gray-900 dark:text-white">{selectedHomework.teacher}</p>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Assigned Date</p>
                    <p className="text-gray-900 dark:text-white">{selectedHomework.assigned}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Due Date</p>
                    <p className="text-gray-900 dark:text-white">{selectedHomework.due}</p>
                  </div>
                </div>
                <div className="flex gap-2">
                  <span className={`badge text-xs px-2 py-0.5 rounded-full ${priorityColors[selectedHomework.priority]}`}>{selectedHomework.priority} Priority</span>
                  <span className={`badge text-xs px-2 py-0.5 rounded-full ${statusColors[selectedHomework.status]}`}>{selectedHomework.status}</span>
                </div>
                <div>
                  <p className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</p>
                  <p className="text-gray-700 dark:text-gray-300 mt-1">{selectedHomework.description}</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
