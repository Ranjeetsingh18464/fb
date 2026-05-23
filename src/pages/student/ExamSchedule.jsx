import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, collection, getDocs, query, where } from "../../services/firebase";

export default function ExamSchedule() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [exams, setExams] = useState([]);
  const [loading, setLoading] = useState(true);

  const grade = userProfile?.grade || "1st Grade";
  const section = userProfile?.section || "A";

  useEffect(() => {
    const fetchExams = async () => {
      try {
        const q = query(collection(db, "examSchedule"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setExams(data);
      } catch (err) {
        console.error("Failed to load exam schedule:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchExams();
  }, [grade, section]);

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Exam Schedule</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{grade} | Section {section}</p>
        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading exam schedule...</p>
        ) : exams.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No exams scheduled yet.</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Subject</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Time</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Room</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {exams.map(e => (
                  <tr key={e.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="p-3 text-gray-800 dark:text-white">{e.date}</td>
                    <td className="p-3 font-semibold text-gray-800 dark:text-white">{e.subject}</td>
                    <td className="p-3 text-gray-500">{e.time}</td>
                    <td className="p-3 text-gray-500">{e.room}</td>
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