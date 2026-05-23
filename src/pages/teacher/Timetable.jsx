import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, doc, getDoc, setDoc } from "../../services/firebase";

const days = ["Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
const periods = Array.from({ length: 8 }, (_, i) => `Period ${i + 1}`);
const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "Hindi", "Sanskrit", "History", "Geography", "Computer Science", "Physical Education", "Art", "Music"];

export default function Timetable() {
  const navigate = useNavigate();
  const [entries, setEntries] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ days: [], periodIdx: -1, subject: "" });
  const [periodNames, setPeriodNames] = useState(periods);
  const [editPeriodIdx, setEditPeriodIdx] = useState(-1);
  const [editPeriodVal, setEditPeriodVal] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDoc(doc(db, "timetable", "teacher_timetable"))
        if (snap.exists()) {
          const data = snap.data()
          if (data.entries) setEntries(data.entries)
          if (data.periodNames) setPeriodNames(data.periodNames)
        }
      } catch (err) {
        console.error("Failed to load timetable:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const saveToFirebase = async (newEntries, newPeriodNames) => {
    try {
      await setDoc(doc(db, "timetable", "teacher_timetable"), {
        entries: newEntries ?? entries,
        periodNames: newPeriodNames ?? periodNames,
        updatedAt: new Date().toISOString()
      })
    } catch (err) {
      console.error("Failed to save timetable:", err)
    }
  }

  const toggleDay = (day) => {
    setForm(prev => ({
      ...prev,
      days: prev.days.includes(day) ? prev.days.filter(d => d !== day) : [...prev.days, day]
    }));
  };

  const handleAdd = () => {
    if (!form.days.length || form.periodIdx < 0 || !form.subject) return;
    const newEntry = { id: Date.now(), ...form };
    const newEntries = [...entries, newEntry];
    setEntries(newEntries);
    saveToFirebase(newEntries, null);
    setForm({ days: [], periodIdx: -1, subject: "" });
    setShowModal(false);
  };

  const deleteEntry = (entryId) => {
    if (!window.confirm("Remove this entry?")) return;
    const newEntries = entries.filter(e => e.id !== entryId);
    setEntries(newEntries);
    saveToFirebase(newEntries, null);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <button onClick={() => navigate(-1)} className="text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">&larr; Back</button>
            <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white mt-1">My Timetable</h1>
          </div>
          <button onClick={() => setShowModal(true)} className="px-4 py-2 bg-primary-500 text-white rounded-lg hover:bg-primary-600 text-sm font-medium transition-colors">+ Add Timetable Entry</button>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-sm bg-white dark:bg-gray-800 rounded-xl shadow">
            <thead>
              <tr className="border-b border-gray-200 dark:border-gray-700">
                <th className="p-3 text-left text-gray-500 dark:text-gray-400 font-medium min-w-[100px]">Period</th>
                {days.map(d => <th key={d} className="p-3 text-center text-gray-500 dark:text-gray-400 font-medium min-w-[130px]">{d}</th>)}
              </tr>
            </thead>
            <tbody>
              {periods.map((p, pi) => (
                <tr key={p} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                  <td className="p-3 text-gray-600 dark:text-gray-400 font-medium" onDoubleClick={() => { setEditPeriodIdx(pi); setEditPeriodVal(periodNames[pi]); }}>
                    {editPeriodIdx === pi ? (
                      <input type="text" value={editPeriodVal} autoFocus
                        onChange={e => setEditPeriodVal(e.target.value)}
                        onBlur={() => {
                          const updated = [...periodNames]
                          updated[pi] = editPeriodVal || p
                          setPeriodNames(updated)
                          saveToFirebase(null, updated)
                          setEditPeriodIdx(-1)
                        }}
                        onKeyDown={e => {
                          if (e.key === 'Enter') e.target.blur()
                          if (e.key === 'Escape') setEditPeriodIdx(-1)
                        }}
                        className="w-full px-2 py-1 border border-indigo-400 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm outline-none" />
                    ) : (
                      <span className="cursor-default">{periodNames[pi]}</span>
                    )}
                  </td>
                  {days.map(d => {
                    const entry = entries.find(e => e.days.includes(d) && e.periodIdx === pi);
                    const val = entry ? entry.subject : null;
                    return (
                      <td className="p-2 text-center" onClick={() => val && deleteEntry(entry.id)}>
                        <span className={`text-sm cursor-default ${val ? "text-blue-700 dark:text-blue-300 font-medium hover:bg-red-50 dark:hover:bg-red-900/20 px-2 py-1 rounded transition-colors" : "text-gray-400 dark:text-gray-500"}`}>
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
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">Add Timetable Entry</h2>
              <button onClick={() => { setShowModal(false); setForm({ days: [], periodIdx: -1, subject: "" }); }} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none">&times;</button>
            </div>

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Day(s)</label>
                <div className="grid grid-cols-2 gap-2">
                  {days.map(day => (
                    <label key={day} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300 cursor-pointer">
                      <input type="checkbox" checked={form.days.includes(day)} onChange={() => toggleDay(day)} className="rounded border-gray-300 dark:border-gray-600 text-primary-500 focus:ring-primary-500" />
                      {day}
                    </label>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Period</label>
                <select value={form.periodIdx} onChange={e => setForm(prev => ({ ...prev, periodIdx: Number(e.target.value) }))} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500">
                  <option value={-1}>Select Period</option>
                  {periodNames.map((p, i) => <option key={i} value={i}>{p}</option>)}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Subject</label>
                <select value={form.subject} onChange={e => setForm(prev => ({ ...prev, subject: e.target.value }))} className="w-full p-2.5 rounded-lg border border-gray-300 dark:border-gray-600 bg-white dark:bg-gray-700 text-sm text-gray-900 dark:text-gray-100 outline-none focus:ring-2 focus:ring-primary-500">
                  <option value="">Select Subject</option>
                  {subjects.map(s => <option key={s} value={s}>{s}</option>)}
                </select>
              </div>
            </div>

            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={() => { setShowModal(false); setForm({ days: [], periodIdx: -1, subject: "" }); }} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 transition-colors">Cancel</button>
              <button onClick={handleAdd} className="px-5 py-2 bg-primary-500 text-white text-sm font-medium rounded-lg hover:bg-primary-600 transition-colors">Add Entry</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}