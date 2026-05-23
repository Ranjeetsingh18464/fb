import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, doc, getDocs, setDoc, deleteDoc } from "../../services/firebase";

export default function Notes() {
  const navigate = useNavigate();
  const [notes, setNotes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", subject: "", class: "", section: "", content: "", file: null, fileType: null });
  const [filePreview, setFilePreview] = useState(null);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "notes"))
        const list = []
        snap.forEach(d => list.push({ id: d.id, ...d.data() }))
        setNotes(list)
      } catch (err) {
        console.error("Failed to load notes:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const resetForm = () => {
    setForm({ title: "", subject: "", class: "", section: "", content: "", file: null, fileType: null });
    setFilePreview(null);
    setEditing(null);
    setShowForm(false);
  };

  const handleFileUpload = (e) => {
    const f = e.target.files[0];
    if (!f) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      setForm(prev => ({ ...prev, file: ev.target.result, fileType: f.type }));
      setFilePreview(ev.target.result);
    };
    reader.readAsDataURL(f);
  };

  const removeFile = () => {
    setForm(prev => ({ ...prev, file: null, fileType: null }));
    setFilePreview(null);
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await setDoc(doc(db, "notes", editing.id), { ...form, updatedAt: new Date().toISOString() })
        setNotes(notes.map((n) => (n.id === editing.id ? { ...editing, ...form } : n)))
      } else {
        const id = doc(collection(db, "notes")).id
        await setDoc(doc(db, "notes", id), { ...form, createdAt: new Date().toISOString() })
        setNotes([...notes, { id, ...form }])
      }
      resetForm()
    } catch (err) {
      console.error("Failed to save note:", err)
    }
  };

  const handleEdit = (n) => {
    setForm({ title: n.title, subject: n.subject, class: n.class, section: n.section || "", content: n.content, file: n.file, fileType: n.fileType });
    setFilePreview(n.file);
    setEditing(n);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this note?")) return;
    try {
      await deleteDoc(doc(db, "notes", id))
      setNotes(notes.filter((n) => n.id !== id))
    } catch (err) {
      console.error("Failed to delete note:", err)
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Study Notes</h1>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            + Add Note
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editing ? "Edit Note" : "New Note"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Title</label>
                <input
                  type="text"
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Subject</label>
                <input
                  type="text"
                  value={form.subject}
                  onChange={(e) => setForm({ ...form, subject: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                />
              </div>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Class</label>
                <select
                  value={form.class}
                  onChange={(e) => setForm({ ...form, class: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select class</option>
                  {Array.from({ length: 12 }, (_, i) => <option key={i + 1} value={i + 1}>Class {i + 1}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Section</label>
                <select
                  value={form.section || ""}
                  onChange={(e) => setForm({ ...form, section: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Select section</option>
                  {["A", "B", "C", "D", "E"].map(s => <option key={s} value={s}>Section {s}</option>)}
                </select>
              </div>
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Content</label>
              <textarea
                rows={6}
                value={form.content}
                onChange={(e) => setForm({ ...form, content: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none font-mono"
              />
            </div>
            <div className="mb-4">
              <label className="block text-sm text-gray-500 dark:text-gray-400 mb-2">Attachment (image or file)</label>
              <input type="file" accept="image/*,.pdf,.doc,.docx,.txt" onChange={handleFileUpload} className="w-full text-sm text-gray-600 dark:text-gray-300 file:mr-3 file:py-1.5 file:px-3 file:rounded-lg file:border-0 file:text-sm file:font-medium file:bg-blue-50 dark:file:bg-blue-900/30 file:text-blue-700 dark:file:text-blue-300 hover:file:bg-blue-100 dark:hover:file:bg-blue-900/50" />
              {filePreview && (
                <div className="relative mt-2 inline-block">
                  {form.fileType?.startsWith("image/") ? (
                    <img src={filePreview} alt="Preview" className="h-24 w-auto rounded-lg border border-gray-200 dark:border-gray-600" />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-700 dark:text-gray-300">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      <span>Attached file</span>
                    </div>
                  )}
                  <button onClick={removeFile} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">&times;</button>
                </div>
              )}
            </div>
            <div className="flex gap-3">
              <button
                onClick={handleSubmit}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                {editing ? "Update" : "Create"}
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {notes.map((n) => (
            <div key={n.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
              <div className="flex items-start justify-between mb-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{n.title}</h3>
                <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Class {n.class} | Section {n.section || "—"}</span>
              </div>
              <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{n.subject}</p>
              <pre className="text-sm text-gray-600 dark:text-gray-400 whitespace-pre-wrap font-sans">{n.content}</pre>
              {n.file && (
                <div className="mt-3">
                  {n.fileType?.startsWith("image/") ? (
                    <img src={n.file} alt={n.title} className="h-32 w-auto rounded-lg border border-gray-200 dark:border-gray-600 object-cover" />
                  ) : (
                    <div className="flex items-center gap-2 px-3 py-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400 inline-block">
                      <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z" /></svg>
                      <span>Attached file</span>
                    </div>
                  )}
                </div>
              )}
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
