import { useState } from "react";
import { useNavigate } from "react-router-dom";

const teachers = ["Mr. Sharma (Maths)", "Ms. Gupta (Physics)", "Dr. Singh (Chemistry)", "Mrs. Rao (English)"];

export default function Communication() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ teacher: "", subject: "", message: "" });
  const [sent, setSent] = useState([
    { id: 1, teacher: "Mr. Sharma (Maths)", subject: "Homework Query", message: "My child is struggling with algebra homework.", date: "2026-05-16" },
  ]);
  const [showForm, setShowForm] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSent([{ id: Date.now(), ...form, date: new Date().toISOString().split("T")[0] }, ...sent]);
    setForm({ teacher: "", subject: "", message: "" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Communication</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">{showForm ? "Cancel" : "New Message"}</button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 space-y-3">
            <select value={form.teacher} onChange={e => setForm({ ...form, teacher: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required>
              <option value="">Select Teacher</option>
              {teachers.map((t, i) => <option key={i} value={t}>{t}</option>)}
            </select>
            <input placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required />
            <textarea placeholder="Message" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} rows={4} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required />
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Send</button>
          </form>
        )}
        <div className="space-y-3">
          {sent.map(msg => (
            <div key={msg.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex justify-between items-start mb-1">
                <h3 className="font-semibold text-gray-800 dark:text-white">{msg.subject}</h3>
                <span className="text-xs text-gray-400">{msg.date}</span>
              </div>
              <p className="text-sm text-gray-500">To: {msg.teacher}</p>
              <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">{msg.message}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
