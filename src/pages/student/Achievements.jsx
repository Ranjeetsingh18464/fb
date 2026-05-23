import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, collection, getDocs, query, where } from "../../services/firebase";

export default function Achievements() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [achievements, setAchievements] = useState([]);
  const [loading, setLoading] = useState(true);

  const grade = userProfile?.grade || "1st Grade";
  const section = userProfile?.section || "A";

  useEffect(() => {
    const fetchAchievements = async () => {
      try {
        const q = query(collection(db, "achievements"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setAchievements(data);
      } catch (err) {
        console.error("Failed to load achievements:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAchievements();
  }, [grade, section]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Achievements</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{grade} | Section {section}</p>
        {loading ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">Loading achievements...</p>
        ) : achievements.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">No achievements yet.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {achievements.map(a => (
              <div key={a.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                <h3 className="font-semibold text-gray-800 dark:text-white mb-2">{a.title}</h3>
                {a.badge && <div className="text-3xl mb-2">{a.badge}</div>}
                {a.image && <img src={a.image} alt={a.title} className="w-full h-40 object-cover rounded mb-2" />}
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-1">{a.description}</p>
                <p className="text-xs text-gray-400">{a.date}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}