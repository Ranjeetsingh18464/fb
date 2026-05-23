import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialNotices = [
  { id: 1, title: "PTM on Saturday", date: "2026-05-15", content: "Parent-teacher meeting scheduled at 10 AM in the school auditorium.", archived: false },
  { id: 2, title: "Holiday Notice", date: "2026-05-14", content: "School will remain closed on Monday due to a public holiday.", archived: false },
  { id: 3, title: "Fee Reminder", date: "2026-05-10", content: "Tuition fee for June is due by June 15. Late payment will incur a penalty.", archived: true },
];

export default function Notices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState(initialNotices);

  const toggleArchive = (id) => {
    setNotices(notices.map(n => n.id === id ? { ...n, archived: !n.archived } : n));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">School Notices</h1>
        </div>
        <div className="space-y-4">
          {notices.filter(n => !n.archived).map(notice => (
            <div key={notice.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div>
                  <h3 className="font-semibold text-gray-800 dark:text-white">{notice.title}</h3>
                  <p className="text-xs text-gray-400">{notice.date}</p>
                </div>
                <button onClick={() => toggleArchive(notice.id)} className="text-sm text-gray-500 hover:text-gray-700 dark:hover:text-gray-300">Archive</button>
              </div>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{notice.content}</p>
            </div>
          ))}
        </div>
        {notices.some(n => n.archived) && (
          <>
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mt-6 mb-3">Archived</h3>
            <div className="space-y-4">
              {notices.filter(n => n.archived).map(notice => (
                <div key={notice.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 opacity-60">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-semibold text-gray-800 dark:text-white">{notice.title}</h3>
                      <p className="text-xs text-gray-400">{notice.date}</p>
                    </div>
                    <button onClick={() => toggleArchive(notice.id)} className="text-sm text-blue-500 hover:text-blue-700">Unarchive</button>
                  </div>
                  <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{notice.content}</p>
                </div>
              ))}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
