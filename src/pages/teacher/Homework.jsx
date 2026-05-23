import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, getDocs, setDoc, doc, updateDoc, deleteDoc, serverTimestamp, query, orderBy } from "../../services/firebase";

export default function Homework() {
  const navigate = useNavigate();
  const [homework, setHomework] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState(null);
  const [form, setForm] = useState({ class: "", section: "", subject: "", title: "", dueDate: "", description: "" });

  useEffect(() => { fetchHomework(); }, []);

  const fetchHomework = async () => {
    try {
      const q = query(collection(db, "homework"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setHomework(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error("Failed to load homework:", err); }
    finally { setLoading(false); }
  };

  const resetForm = () => {
    setForm({ class: "", section: "", subject: "", title: "", dueDate: "", description: "" });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      if (editingId) {
        await updateDoc(doc(db, "homework", editingId), form);
        setHomework(homework.map(h => h.id === editingId ? { ...h, ...form } : h));
      } else {
        const id = doc(collection(db, "homework")).id;
        await setDoc(doc(db, "homework", id), { ...form, createdAt: serverTimestamp() });
        setHomework([{ id, ...form, createdAt: new Date().toISOString() }, ...homework]);
      }
      resetForm();
    } catch (err) { console.error("Failed to save homework:", err); }
  };

  const handleEdit = (h) => {
    setForm({ class: h.class, section: h.section || "", subject: h.subject, title: h.title, dueDate: h.dueDate, description: h.description });
    setEditingId(h.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this homework?")) return;
    try {
      await deleteDoc(doc(db, "homework", id));
      setHomework(homework.filter(h => h.id !== id));
    } catch (err) { console.error("Failed to delete homework:", err); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-9 h-9 flex items-center justify-center rounded-xl bg-white dark:bg-gray-800 shadow-sm text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white hover:shadow-md transition-all">←</button>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Homework</h1>
          </div>
          <button onClick={() => { resetForm(); setShowForm(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm shadow-lg shadow-blue-600/20">+ Assign Homework</button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-5 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">{editingId ? "Edit Homework" : "New Homework"}</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Class</label>
                <select value={form.class} onChange={e => setForm({ ...form, class: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select class</option>
                  {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Class {i + 1}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Section</label>
                <select value={form.section} onChange={e => setForm({ ...form, section: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none">
                  <option value="">Select section</option>
                  {["A", "B", "C", "D", "E"].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Subject</label>
                <input type="text" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Title</label>
                <input type="text" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Due Date</label>
                <input type="date" value={form.dueDate} onChange={e => setForm({ ...form, dueDate: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Description</label>
              <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
            </div>
            <div className="flex gap-3">
              <button onClick={handleSubmit} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors shadow-lg shadow-blue-600/20">{editingId ? "Update" : "Create"}</button>
              <button onClick={resetForm} className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors">Cancel</button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {homework.length === 0 && <p className="text-sm text-gray-400 text-center py-8">No homework assigned yet</p>}
          {homework.map(h => (
            <div key={h.id} className="bg-white dark:bg-gray-800 rounded-xl shadow border border-gray-100 dark:border-gray-700 p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{h.title}</h3>
                <span className="text-xs px-2.5 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300 font-medium">Class {h.class} | Section {h.section || "—"}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">Subject: {h.subject} | Due: {h.dueDate}</p>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{h.description}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(h)} className="px-3 py-1.5 text-sm bg-blue-50 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 rounded-lg hover:bg-blue-100 dark:hover:bg-blue-900/50 transition-colors font-medium">Edit</button>
                <button onClick={() => handleDelete(h.id)} className="px-3 py-1.5 text-sm bg-red-50 dark:bg-red-900/30 text-red-600 dark:text-red-400 rounded-lg hover:bg-red-100 dark:hover:bg-red-900/50 transition-colors font-medium">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}