import { useNavigate } from "react-router-dom";

const achievements = [
  { id: 1, title: "Science Olympiad Winner", description: "First place in regional science olympiad", badge: "🏆", date: "2026-03-15", image: null },
  { id: 2, title: "Perfect Attendance", description: "100% attendance for the entire year", badge: "🥇", date: "2026-04-01", image: null },
  { id: 3, title: "Art Competition", description: "Second place in school art competition", badge: "🎨", date: "2026-02-10", image: null },
];

export default function ChildAchievements() {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Child's Achievements</h1>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {achievements.map(a => (
            <div key={a.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
              <div className="text-5xl mb-3">{a.badge}</div>
              {a.image && <img src={a.image} alt={a.title} className="w-full h-40 object-cover rounded mb-3" />}
              <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{a.title}</h3>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{a.description}</p>
              <p className="text-xs text-gray-400 mt-2">{a.date}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
