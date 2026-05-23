import { useNavigate } from "react-router-dom";

const homework = [
  { class: "10A", subject: "Mathematics", title: "Algebra Worksheet", due: "2026-05-20", status: "Pending" },
  { class: "10A", subject: "Science", title: "Lab Report", due: "2026-05-22", status: "Submitted" },
  { class: "10A", subject: "English", title: "Essay Writing", due: "2026-05-25", status: "Pending" },
  { class: "10A", subject: "History", title: "World War II Essay", due: "2026-05-28", status: "Submitted" },
];

export default function ChildHomework() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Child's Homework</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Class</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Subject</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Title</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Due Date</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {homework.map((h, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-3 text-gray-800 dark:text-white">{h.class}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{h.subject}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{h.title}</td>
                  <td className="p-3 text-gray-500">{h.due}</td>
                  <td className="p-3"><span className={`px-2 py-1 text-xs rounded ${h.status === "Submitted" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"}`}>{h.status}</span></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
