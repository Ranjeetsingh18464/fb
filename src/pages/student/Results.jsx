import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, collection, getDocs, query, where } from "../../services/firebase";

export default function Results() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [exams, setExams] = useState([]);
  const [examIdx, setExamIdx] = useState(0);
  const [loading, setLoading] = useState(true);

  const grade = userProfile?.grade || "1st Grade";
  const section = userProfile?.section || "A";

  useEffect(() => {
    const fetchResults = async () => {
      try {
        const q = query(collection(db, "results"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setExams(data);
      } catch (err) {
        console.error("Failed to load results:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [grade, section]);

  if (loading) return <div className="p-6 text-center text-gray-400">Loading results...</div>;

  if (exams.length === 0) return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
        <h1 className="text-2xl font-bold text-gray-800 dark:text-white mt-4">Results</h1>
        <p className="text-gray-400 dark:text-gray-500 mt-4">No results found.</p>
      </div>
    </div>
  );

  const selected = exams[examIdx] || exams[0];
  const subjects = selected.subjects || [];
  const totalMarks = subjects.reduce((a, s) => a + (s.marks || 0), 0);
  const totalPossible = subjects.reduce((a, s) => a + (s.total || 0), 0);
  const pct = totalPossible ? ((totalMarks / totalPossible) * 100).toFixed(1) : "0";
  const letterGrade = pct >= 90 ? "A" : pct >= 80 ? "B" : pct >= 70 ? "C" : "D";

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Results</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{grade} | Section {section}</p>
        <div className="flex items-center gap-3 mb-4">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Exam:</label>
          <select value={examIdx} onChange={e => setExamIdx(Number(e.target.value))} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
            {exams.map((e, i) => <option key={i} value={i}>{e.exam || e.name}</option>)}
          </select>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
          <table className="w-full text-left">
            <thead className="bg-gray-100 dark:bg-gray-700">
              <tr>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Subject</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Marks</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Total</th>
                <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Percentage</th>
              </tr>
            </thead>
            <tbody className="divide-y dark:divide-gray-700">
              {subjects.map((s, i) => (
                <tr key={i} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                  <td className="p-3 text-gray-800 dark:text-white">{s.name}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{s.marks}</td>
                  <td className="p-3 text-gray-500">{s.total}</td>
                  <td className="p-3 text-gray-800 dark:text-white">{s.total ? ((s.marks / s.total) * 100).toFixed(1) : "0"}%</td>
                </tr>
              ))}
              <tr className="bg-gray-50 dark:bg-gray-750 font-semibold">
                <td className="p-3 text-gray-800 dark:text-white">Total</td>
                <td className="p-3 text-gray-800 dark:text-white">{totalMarks}</td>
                <td className="p-3 text-gray-500">{totalPossible}</td>
                <td className="p-3 text-gray-800 dark:text-white">{pct}%</td>
              </tr>
            </tbody>
          </table>
        </div>
        <div className="mt-4 bg-white dark:bg-gray-800 rounded-lg shadow p-4">
          <p className="text-gray-600 dark:text-gray-300">Overall Grade: <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{letterGrade}</span></p>
        </div>
      </div>
    </div>
  );
}