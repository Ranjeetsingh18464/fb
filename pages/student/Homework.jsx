import React, { useState } from "react";

const initialHomework = [
  { id: 1, subject: "Mathematics", teacher: "Dr. Sharma", assigned: "12 May 2026", due: "18 May 2026", priority: "High", description: "Solve 20 problems from Chapter 5: Quadratic Equations. Show all steps.", attachments: ["quadratics_worksheet.pdf"], status: "Pending" },
  { id: 2, subject: "Physics", teacher: "Mrs. Gupta", assigned: "13 May 2026", due: "20 May 2026", priority: "Medium", description: "Write a lab report on the Laws of Motion experiment conducted in class.", attachments: [], status: "Pending" },
  { id: 3, subject: "Chemistry", teacher: "Mr. Verma", assigned: "10 May 2026", due: "17 May 2026", priority: "High", description: "Complete the Periodic Table worksheet and memorize first 30 elements.", attachments: ["periodic_table_worksheet.pdf", "elements_list.docx"], status: "Submitted" },
  { id: 4, subject: "English", teacher: "Ms. Singh", assigned: "08 May 2026", due: "15 May 2026", priority: "Low", description: "Write an essay on 'The Importance of Education' (500 words).", attachments: ["essay_guidelines.pdf"], status: "Submitted" },
  { id: 5, subject: "Biology", teacher: "Dr. Patel", assigned: "05 May 2026", due: "12 May 2026", priority: "Medium", description: "Draw and label the human digestive system.", attachments: [], status: "Overdue" },
  { id: 6, subject: "History", teacher: "Mr. Singh", assigned: "06 May 2026", due: "13 May 2026", priority: "Low", description: "Read Chapter 3 and answer the review questions.", attachments: ["chapter3_notes.pdf"], status: "Overdue" },
];

const tabs = ["All", "Pending", "Submitted", "Overdue"];

export default function Homework() {
  const [activeTab, setActiveTab] = useState("All");
  const [showModal, setShowModal] = useState(false);
  const [selectedHomework, setSelectedHomework] = useState(null);
  const [homework, setHomework] = useState(initialHomework);

  const filtered = activeTab === "All" ? homework : homework.filter((h) => h.status === activeTab);

  const handleSubmit = (id) => {
    setSelectedHomework(homework.find((h) => h.id === id));
    setShowModal(true);
  };

  const handleModalSubmit = (e) => {
    e.preventDefault();
    setHomework(homework.map((h) => h.id === selectedHomework.id ? { ...h, status: "Submitted" } : h));
    setShowModal(false);
    setSelectedHomework(null);
  };

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

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Homework</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Track and submit your homework assignments</p>
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
                  {hw.attachments.length > 0 && (
                    <div className="flex flex-wrap gap-2">
                      {hw.attachments.map((file) => (
                        <span key={file} className="inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">
                          📎 {file}
                        </span>
                      ))}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0">
                  {hw.status === "Pending" && (
                    <button onClick={() => handleSubmit(hw.id)} className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Submit
                    </button>
                  )}
                  {hw.status === "Submitted" && (
                    <span className="inline-flex items-center gap-1 text-green-600 dark:text-green-400 text-sm font-medium">
                      ✅ Submitted
                    </span>
                  )}
                  {hw.status === "Overdue" && (
                    <span className="inline-flex items-center gap-1 text-red-600 dark:text-red-400 text-sm font-medium">
                      ⚠️ Overdue
                    </span>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showModal && selectedHomework && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Submit Homework</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">{selectedHomework.subject} - {selectedHomework.description}</p>
              <form onSubmit={handleModalSubmit} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload File</label>
                  <input type="file" className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Notes (optional)</label>
                  <textarea rows="3" className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" placeholder="Add any notes..."></textarea>
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowModal(false)} className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
                  <button type="submit" className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Submit</button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
