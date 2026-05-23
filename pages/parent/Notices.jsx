import React, { useState } from "react";

const noticesData = [
  { id: 1, title: "Parent-Teacher Meeting", date: "25 May 2026", content: "Annual parent-teacher meeting scheduled. Please confirm your availability.", from: "Principal", type: "school", pinned: true },
  { id: 2, title: "Summer Vacation Announcement", date: "20 May 2026", content: "School will remain closed from 1 June to 30 June for summer break.", from: "Principal", type: "school", pinned: true },
  { id: 3, title: "Mathematics Test Next Week", date: "16 May 2026", content: "There will be a surprise test on Chapter 5 next Monday.", from: "Dr. Sharma", type: "class", pinned: false },
  { id: 4, title: "Science Exhibition", date: "15 May 2026", content: "Annual science exhibition on 28 May. Interested students please register.", from: "Mr. Verma", type: "school", pinned: false },
  { id: 5, title: "Urgent: School Closed Tomorrow", date: "14 May 2026", content: "Due to heavy rainfall, school will remain closed tomorrow.", from: "Admin", type: "urgent", pinned: true },
  { id: 6, title: "Homework Submission Reminder", date: "13 May 2026", content: "All pending homework must be submitted by Friday.", from: "Mrs. Gupta", type: "class", pinned: false },
  { id: 7, title: "PTA Committee Meeting", date: "12 May 2026", content: "PTA committee meeting on 20 May at 10 AM in the school auditorium.", from: "Principal", type: "school", pinned: false },
  { id: 8, title: "Sports Day Registration", date: "10 May 2026", content: "Annual Sports Day on 15 June. Registration open until 30 May.", from: "Admin", type: "school", pinned: false },
];

const filters = ["All", "School", "Class", "Urgent"];

const fromColors = {
  Principal: "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300",
  Admin: "bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300",
};

export default function Notices() {
  const [activeFilter, setActiveFilter] = useState("All");

  const filtered = activeFilter === "All"
    ? noticesData
    : noticesData.filter((n) => n.type === activeFilter.toLowerCase());

  const pinned = filtered.filter((n) => n.pinned);
  const normal = filtered.filter((n) => !n.pinned);

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Notices</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">School announcements and class notices</p>
        </div>

        <div className="flex gap-2 flex-wrap">
          {filters.map((filter) => (
            <button key={filter} onClick={() => setActiveFilter(filter)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
              activeFilter === filter
                ? "bg-blue-600 text-white"
                : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
            }`}>{filter}</button>
          ))}
        </div>

        <div className="space-y-4">
          {pinned.map((notice) => (
            <div key={notice.id} className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border-l-4 border-yellow-500 border border-gray-200 dark:border-gray-700 card-hover">
              <div className="flex items-start gap-3">
                <span className="text-yellow-500 text-lg flex-shrink-0">📌</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{notice.title}</h3>
                    <span className="badge bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 px-2 py-0.5 rounded text-xs">Pinned</span>
                    {notice.type === "urgent" && (
                      <span className="badge bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded text-xs">Urgent</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">From: <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${fromColors[notice.from] || "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>{notice.from}</span> | {notice.date}</p>
                  <p className="text-gray-700 dark:text-gray-300">{notice.content}</p>
                </div>
              </div>
            </div>
          ))}

          {normal.map((notice) => (
            <div key={notice.id} className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
              <div className="flex items-start gap-3">
                <span className="text-gray-400 text-lg flex-shrink-0">📋</span>
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-1">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{notice.title}</h3>
                    {notice.type === "urgent" && (
                      <span className="badge bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 px-2 py-0.5 rounded text-xs">Urgent</span>
                    )}
                  </div>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">From: <span className={`inline-block px-2 py-0.5 rounded text-xs font-medium ${fromColors[notice.from] || "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300"}`}>{notice.from}</span> | {notice.date}</p>
                  <p className="text-gray-700 dark:text-gray-300">{notice.content}</p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
