import { useState, useEffect, useMemo } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, collection, getDocs, query, where } from "../../services/firebase";

const months = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];

function getDaysInMonth(year, month) {
  return new Date(year, month + 1, 0).getDate();
}

export default function Attendance() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [month, setMonth] = useState(new Date().getMonth());
  const [year, setYear] = useState(2026);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);

  const grade = userProfile?.grade || "1st Grade";
  const section = userProfile?.section || "A";

  useEffect(() => {
    const fetchAttendance = async () => {
      setLoading(true);
      try {
        const q = query(
          collection(db, "attendance"),
          where("grade", "==", grade),
          where("section", "==", section),
          where("month", "==", month + 1),
          where("year", "==", year)
        );
        const snapshot = await getDocs(q);
        const data = {};
        snapshot.forEach(doc => {
          const d = doc.data();
          if (d.date) data[d.date] = d.status;
        });
        setRecords(data);
      } catch (err) {
        console.error("Failed to load attendance:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAttendance();
  }, [grade, section, month, year]);

  const daysCount = getDaysInMonth(year, month);
  const days = Array.from({ length: daysCount }, (_, i) => ({
    date: i + 1,
    status: records[i + 1] || "Absent",
  }));

  const present = days.filter(d => d.status === "Present").length;
  const pct = daysCount ? Math.round((present / daysCount) * 100) : 0;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Attendance</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{grade} | Section {section}</p>
        <div className="flex items-center gap-3 mb-4 flex-wrap">
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300">Month:</label>
          <select value={month} onChange={e => setMonth(Number(e.target.value))} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
            {months.map((m, i) => <option key={i} value={i}>{m}</option>)}
          </select>
          <label className="text-sm font-medium text-gray-600 dark:text-gray-300 ml-2">Year:</label>
          <select value={year} onChange={e => setYear(Number(e.target.value))} className="px-3 py-2 border rounded-lg bg-white dark:bg-gray-800 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
            {Array.from({ length: 12 }, (_, i) => <option key={2024 + i} value={2024 + i}>{2024 + i}</option>)}
          </select>
        </div>
        {loading ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">Loading attendance...</p>
        ) : (
          <>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6 mb-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Attendance Percentage</h3>
              <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-4">
                <div className="bg-green-500 h-4 rounded-full text-xs text-white text-center leading-4" style={{ width: `${pct}%` }}>{pct}%</div>
              </div>
              <p className="mt-2 text-sm text-gray-500">{present} / {daysCount} days present</p>
            </div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
              <h3 className="text-lg font-semibold text-gray-800 dark:text-white mb-3">Daily Record</h3>
              <div className="grid grid-cols-5 sm:grid-cols-10 gap-2">
                {days.map(d => (
                  <div key={d.date} className={`text-center p-2 rounded text-sm ${d.status === "Present" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300"}`}>
                    <div className="font-semibold">{d.date}</div>
                    <div className="text-xs">{d.status}</div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}