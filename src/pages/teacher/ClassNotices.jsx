import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, doc, getDocs, setDoc, deleteDoc } from "../../services/firebase";

export default function ClassNotices() {
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ class: "", section: "", title: "", content: "", active: true });
  const [file, setFile] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "notices"))
        const list = []
        snap.forEach(d => list.push({ id: d.id, ...d.data() }))
        setNotices(list)
      } catch (err) {
        console.error("Failed to load notices:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const resetForm = () => {
    setForm({ class: "", section: "", title: "", content: "", active: true });
    setFile(null);
    setEditing(null);
    setShowForm(false);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await setDoc(doc(db, "notices", editing.id), { ...form, updatedAt: new Date().toISOString() })
        setNotices(notices.map((n) => (n.id === editing.id ? { ...editing, ...form } : n)))
      } else {
        const id = doc(collection(db, "notices")).id
        await setDoc(doc(db, "notices", id), { ...form, createdAt: new Date().toISOString() })
        setNotices([...notices, { id, ...form }])
      }
      resetForm()
    } catch (err) {
      console.error("Failed to save notice:", err)
    }
  };

  const handleEdit = (n) => {
    setForm({ class: n.class, section: n.section || "", title: n.title, content: n.content, active: n.active });
    setEditing(n);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this notice?")) return;
    try {
      await deleteDoc(doc(db, "notices", id))
      setNotices(notices.filter((n) => n.id !== id))
    } catch (err) {
      console.error("Failed to delete notice:", err)
    }
  };

  const toggleActive = async (id) => {
    const n = notices.find(n => n.id === id)
    if (!n) return
    try {
      await setDoc(doc(db, "notices", id), { ...n, active: !n.active })
      setNotices(notices.map((n) => (n.id === id ? { ...n, active: !n.active } : n)))
    } catch (err) {
      console.error("Failed to toggle notice:", err)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          &larr; Back
        </button>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Class Notices</h1>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            + Post Notice
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editing ? "Edit Notice" : "New Notice"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Class</label>
                <select value={form.class} onChange={(e) => setForm({ ...form, class: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="">Select class</option>
                  {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Class {i + 1}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Section</label>
                <select value={form.section} onChange={(e) => setForm({ ...form, section: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500">
                  <option value="">Select section</option>
                  {["A", "B", "C", "D", "E"].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Content</label>
              <textarea
                rows={4}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Attach File (optional)</label>
              <input
                type="file"
                onChange={(e) => setFile(e.target.files[0])}
                className="w-full text-sm text-gray-500 dark:text-gray-400 file:mr-4 file:py-2 file:px-4 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50"
              />
              {file && <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Selected: {file.name}</p>}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editing ? "Update" : "Post"}
              </button>
              <button
                onClick={resetForm}
                className="px-4 py-2 bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        )}

        <div className="space-y-4">
          {notices.map((n) => (
            <div key={n.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{n.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Class {n.class} | Section {n.section || "—"}</span>
                </div>
                <button
                  onClick={() => toggleActive(n.id)}
                  className={`text-xs px-2 py-1 rounded-full transition-colors ${
                    n.active
                      ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                      : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                  }`}
                >
                  {n.active ? "Active" : "Archived"}
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{n.content}</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(n)} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">Edit</button>
                <button onClick={() => handleDelete(n.id)} className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
