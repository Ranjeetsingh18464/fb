import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, collection, getDocs, query, where } from "../../services/firebase";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = Array.from({ length: 8 }, (_, i) => `Period ${i + 1}`);

export default function Timetable() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);

  const grade = userProfile?.grade || "1st Grade";
  const section = userProfile?.section || "A";

  useEffect(() => {
    const fetchTimetable = async () => {
      try {
        const q = query(collection(db, "timetables"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setEntries(data);
      } catch (err) {
        console.error("Failed to load timetable:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTimetable();
  }, [grade, section]);

  const getSubjectForCell = (day, period) => {
    const entry = entries.find(e => e.days?.includes(day) && e.period === period);
    return entry ? entry.subject : null;
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">&larr; Back</button>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mb-6">My Timetable</h1>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{grade} | Section {section}</p>

        {loading ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">Loading timetable...</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm bg-white dark:bg-gray-800 rounded-xl shadow">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700">
                  <th className="p-3 text-left text-gray-500 dark:text-gray-400 font-medium min-w-[100px]">Period</th>
                  {days.map(d => <th key={d} className="p-3 text-center text-gray-500 dark:text-gray-400 font-medium min-w-[130px]">{d}</th>)}
                </tr>
              </thead>
              <tbody>
                {periods.map(p => (
                  <tr key={p} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                    <td className="p-3 text-gray-600 dark:text-gray-400 font-medium">{p}</td>
                    {days.map(d => {
                      const val = getSubjectForCell(d, p);
                      return (
                        <td className="p-2 text-center">
                          <span className={`text-sm ${val ? "text-blue-700 dark:text-blue-300 font-medium" : "text-gray-400 dark:text-gray-500"}`}>
                            {val || "—"}
                          </span>
                        </td>
                      );
                    })}
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}