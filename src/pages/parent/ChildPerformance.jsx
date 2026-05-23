import { useNavigate } from "react-router-dom";

const subjects = [
  { name: "Mathematics", score: 90, color: "bg-blue-500" },
  { name: "Science", score: 85, color: "bg-green-500" },
  { name: "English", score: 88, color: "bg-yellow-500" },
  { name: "History", score: 80, color: "bg-purple-500" },
  { name: "Computer Science", score: 92, color: "bg-red-500" },
];

const comments = [
  { teacher: "Mr. Sharma", subject: "Mathematics", comment: "Excellent progress. Keep it up!" },
  { teacher: "Ms. Gupta", subject: "Science", comment: "Good understanding of concepts. Needs more practice in numericals." },
  { teacher: "Mrs. Rao", subject: "English", comment: "Writing skills have improved significantly." },
];

export default function ChildPerformance() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Child Performance</h1>
        </div>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Subject-wise Performance</h3>
            <div className="space-y-4">
              {subjects.map((s, i) => (
                <div key={i}>
                  <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                    <span>{s.name}</span><span>{s.score}%</span>
                  </div>
                  <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                    <div className={`${s.color} h-3 rounded-full`} style={{ width: `${s.score}%` }}></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Attendance</h3>
            <div className="flex items-center justify-center h-40">
              <div className="relative w-32 h-32">
                <svg className="w-full h-full" viewBox="0 0 36 36">
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#e5e7eb" strokeWidth="3" />
                  <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#22c55e" strokeWidth="3" strokeDasharray="92, 100" />
                </svg>
                <div className="absolute inset-0 flex items-center justify-center text-2xl font-bold text-gray-800 dark:text-white">92%</div>
              </div>
            </div>
          </div>
        </div>
        <div className="mt-6 bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Teacher Comments</h3>
          <div className="space-y-3">
            {comments.map((c, i) => (
              <div key={i} className="border-b dark:border-gray-700 pb-3 last:border-0">
                <p className="font-medium text-gray-800 dark:text-white">{c.teacher} <span className="text-sm text-gray-500">({c.subject})</span></p>
                <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{c.comment}</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
