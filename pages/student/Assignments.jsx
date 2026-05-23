import React, { useState } from "react";

const assignments = [
  { id: 1, title: "Quadratic Equations Practice", subject: "Mathematics", teacher: "Dr. Sharma", due: "20 May 2026", status: "Pending", submittedWork: null, grade: null },
  { id: 2, title: "Newton's Laws Lab Report", subject: "Physics", teacher: "Mrs. Gupta", due: "22 May 2026", status: "Submitted", submittedWork: "newtons_laws_report.pdf", grade: "A" },
  { id: 3, title: "Periodic Table Mnemonics", subject: "Chemistry", teacher: "Mr. Verma", due: "18 May 2026", status: "Submitted", submittedWork: "periodic_mnemonics.docx", grade: "A+" },
  { id: 4, title: "Essay on Climate Change", subject: "English", teacher: "Ms. Singh", due: "25 May 2026", status: "Pending", submittedWork: null, grade: null },
  { id: 5, title: "Digestive System Diagram", subject: "Biology", teacher: "Dr. Patel", due: "15 May 2026", status: "Submitted", submittedWork: "digestive_diagram.pdf", grade: "B+" },
  { id: 6, title: "World War II Timeline", subject: "History", teacher: "Mr. Singh", due: "28 May 2026", status: "Pending", submittedWork: null, grade: null },
  { id: 7, title: "Programming Basics", subject: "Computer", teacher: "Mr. Kumar", due: "12 May 2026", status: "Submitted", submittedWork: "programming_basics.py", grade: "A" },
];

const statusColors = {
  Pending: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  Submitted: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  Graded: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
};

export default function Assignments() {
  const [showSubmitModal, setShowSubmitModal] = useState(null);

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Assignments</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Manage and submit your assignments</p>
        </div>

        <div className="grid grid-cols-1 gap-4">
          {assignments.map((a) => (
            <div key={a.id} className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
              <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{a.title}</h3>
                    <span className={`badge text-xs px-2 py-0.5 rounded-full ${statusColors[a.status]}`}>{a.status}</span>
                  </div>
                  <div className="flex flex-wrap items-center gap-3 text-sm text-gray-500 dark:text-gray-400">
                    <span>📖 {a.subject}</span>
                    <span>👨‍🏫 {a.teacher}</span>
                    <span>📅 Due: {a.due}</span>
                    {a.grade && <span className="font-semibold text-green-600 dark:text-green-400">⭐ Grade: {a.grade}</span>}
                  </div>
                  {a.submittedWork && (
                    <div className="mt-2 inline-flex items-center gap-1 px-3 py-1 rounded-lg bg-gray-100 dark:bg-gray-700 text-xs text-gray-600 dark:text-gray-400">
                      📎 {a.submittedWork}
                    </div>
                  )}
                </div>
                <div className="flex-shrink-0 flex gap-2">
                  {a.status === "Pending" && (
                    <button onClick={() => setShowSubmitModal(a.id)} className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">
                      Submit
                    </button>
                  )}
                  {a.submittedWork && (
                    <button className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                      View Work
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>

        {showSubmitModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
            <div className="bg-white dark:bg-gray-800 rounded-xl p-6 w-full max-w-md mx-4 shadow-xl">
              <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">Submit Assignment</h2>
              <form className="space-y-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Upload File</label>
                  <input type="file" className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                </div>
                <div>
                  <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Comments</label>
                  <textarea rows="3" className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" placeholder="Add any comments..."></textarea>
                </div>
                <div className="flex gap-3 justify-end">
                  <button type="button" onClick={() => setShowSubmitModal(null)} className="px-4 py-2 rounded-lg text-sm border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">Cancel</button>
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
