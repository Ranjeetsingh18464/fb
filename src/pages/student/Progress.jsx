import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, collection, getDocs, query, where } from "../../services/firebase";

export default function Progress() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [subjects, setSubjects] = useState([]);
  const [loading, setLoading] = useState(true);

  const grade = userProfile?.grade || "1st Grade";
  const section = userProfile?.section || "A";

  useEffect(() => {
    const fetchProgress = async () => {
      try {
        const q = query(collection(db, "results"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => {
          const d = doc.data();
          if (d.subjects) data.push(...d.subjects);
        });
        setSubjects(data.slice(0, 10));
      } catch (err) {
        console.error("Failed to load progress:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchProgress();
  }, [grade, section]);

  const avgScore = subjects.length ? Math.round(subjects.reduce((a, s) => a + (s.score || s.marks || 0), 0) / subjects.length) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Academic Progress</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{grade} | Section {section}</p>
        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading progress...</p>
        ) : subjects.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No results data yet.</p>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Subject-wise Performance</h3>
              <div className="space-y-4">
                {subjects.map((s, i) => {
                  const score = s.score || s.marks || 0;
                  const total = s.total || 100;
                  const pct = Math.round((score / total) * 100);
                  const colors = ["bg-blue-500", "bg-green-500", "bg-yellow-500", "bg-purple-500", "bg-red-500", "bg-indigo-500", "bg-pink-500", "bg-teal-500"];
                  return (
                    <div key={i}>
                      <div className="flex justify-between text-sm text-gray-600 dark:text-gray-300 mb-1">
                        <span>{s.name}</span><span>{pct}%</span>
                      </div>
                      <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3">
                        <div className={`${colors[i % colors.length]} h-3 rounded-full`} style={{ width: `${pct}%` }}></div>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Average Score</h3>
              <div className="flex items-center justify-center h-40">
                <div className="text-center">
                  <p className="text-5xl font-bold text-blue-600 dark:text-blue-400">{avgScore}%</p>
                  <p className="text-sm text-gray-500 mt-2">Overall average</p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}