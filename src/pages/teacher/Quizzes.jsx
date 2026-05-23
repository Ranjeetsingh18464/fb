import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, doc, getDocs, setDoc, updateDoc, deleteDoc } from "../../services/firebase";

export default function Quizzes() {
  const navigate = useNavigate();
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ title: "", class: "", section: "", questions: [] });

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "quizzes"))
        const list = []
        snap.forEach(d => list.push({ id: d.id, ...d.data() }))
        setQuizzes(list)
      } catch (err) {
        console.error("Failed to load quizzes:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const resetForm = () => {
    setForm({ title: "", class: "", section: "", questions: [] });
    setEditing(null);
    setShowForm(false);
  };

  const addQuestion = () => {
    setForm({ ...form, questions: [...form.questions, { question: "", options: ["", "", "", ""], correct: 0 }] });
  };

  const removeQuestion = (idx) => {
    setForm({ ...form, questions: form.questions.filter((_, i) => i !== idx) });
  };

  const updateQuestion = (idx, field, value) => {
    const qs = [...form.questions];
    qs[idx] = { ...qs[idx], [field]: value };
    setForm({ ...form, questions: qs });
  };

  const updateOption = (qIdx, oIdx, value) => {
    const qs = [...form.questions];
    qs[qIdx].options[oIdx] = value;
    setForm({ ...form, questions: qs });
  };

  const handleSubmit = async () => {
    try {
      if (editing) {
        await setDoc(doc(db, "quizzes", editing.id), { ...form, updatedAt: new Date().toISOString() })
        setQuizzes(quizzes.map((q) => (q.id === editing.id ? { ...editing, ...form } : q)))
      } else {
        const id = doc(collection(db, "quizzes")).id
        await setDoc(doc(db, "quizzes", id), { ...form, published: false, createdAt: new Date().toISOString() })
        setQuizzes([...quizzes, { id, ...form, published: false }])
      }
      resetForm()
    } catch (err) {
      console.error("Failed to save quiz:", err)
    }
  };

  const handleEdit = (q) => {
    setForm({ title: q.title, class: q.class, section: q.section || "", questions: q.questions });
    setEditing(q);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this quiz?")) return;
    try {
      await deleteDoc(doc(db, "quizzes", id))
      setQuizzes(quizzes.filter((q) => q.id !== id))
    } catch (err) {
      console.error("Failed to delete quiz:", err)
    }
  };

  const togglePublish = async (id) => {
    const q = quizzes.find(q => q.id === id)
    if (!q) return
    try {
      await updateDoc(doc(db, "quizzes", id), { published: !q.published })
      setQuizzes(quizzes.map((q) => (q.id === id ? { ...q, published: !q.published } : q)))
    } catch (err) {
      console.error("Failed to toggle publish:", err)
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
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Quizzes</h1>
          <button
            onClick={() => { resetForm(); setShowForm(true); }}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm"
          >
            + Create Quiz
          </button>
        </div>

        {showForm && (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {editing ? "Edit Quiz" : "New Quiz"}
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
            </div>

            <div className="space-y-4 mb-4">
              {form.questions.map((q, qIdx) => (
                <div key={qIdx} className="p-4 border border-gray-200 dark:border-gray-700 rounded-lg">
                  <div className="flex items-start justify-between mb-3">
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Question {qIdx + 1}</span>
                    <button
                      onClick={() => removeQuestion(qIdx)}
                      className="text-xs text-red-600 dark:text-red-400 hover:underline"
                    >
                      Remove
                    </button>
                  </div>
                  <input
                    type="text"
                    placeholder="Enter question"
                    value={q.question}
                    onChange={(e) => updateQuestion(qIdx, "question", e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 mb-2"
                  />
                  <div className="grid grid-cols-2 gap-2">
                    {q.options.map((opt, oIdx) => (
                      <div key={oIdx} className="flex items-center gap-2">
                        <input
                          type="radio"
                          name={`correct-${qIdx}`}
                          checked={q.correct === oIdx}
                          onChange={() => updateQuestion(qIdx, "correct", oIdx)}
                        />
                        <input
                          type="text"
                          placeholder={`Option ${oIdx + 1}`}
                          value={opt}
                          onChange={(e) => updateOption(qIdx, oIdx, e.target.value)}
                          className="flex-1 px-2 py-1 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                        />
                      </div>
                    ))}
                  </div>
                </div>
              ))}
              <button
                onClick={addQuestion}
                className="px-4 py-2 text-sm border-2 border-dashed border-gray-300 dark:border-gray-600 text-gray-500 dark:text-gray-400 rounded-lg hover:border-gray-400 dark:hover:border-gray-500 transition-colors w-full"
              >
                + Add Question
              </button>
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

        <div className="space-y-4">
          {quizzes.map((q) => (
            <div key={q.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
              <div className="flex items-start justify-between mb-2">
                <div>
                  <h3 className="font-semibold text-gray-900 dark:text-white">{q.title}</h3>
                  <span className="text-xs px-2 py-1 rounded-full bg-purple-100 dark:bg-purple-900/30 text-purple-700 dark:text-purple-300">Class {q.class} | Section {q.section || "—"}</span>
                </div>
                <span className={`text-xs px-2 py-1 rounded-full ${
                  q.published
                    ? "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300"
                    : "bg-gray-100 dark:bg-gray-700 text-gray-500 dark:text-gray-400"
                }`}>
                  {q.published ? "Published" : "Draft"}
                </span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{q.questions.length} questions</p>
              <div className="flex gap-2 mt-4">
                <button onClick={() => handleEdit(q)} className="px-3 py-1 text-sm bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 rounded-lg hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors">Edit</button>
                <button onClick={() => togglePublish(q.id)} className={`px-3 py-1 text-sm rounded-lg transition-colors ${
                  q.published
                    ? "bg-yellow-100 dark:bg-yellow-900/30 text-yellow-700 dark:text-yellow-300 hover:bg-yellow-200 dark:hover:bg-yellow-900/50"
                    : "bg-green-100 dark:bg-green-900/30 text-green-700 dark:text-green-300 hover:bg-green-200 dark:hover:bg-green-900/50"
                }`}>
                  {q.published ? "Unpublish" : "Publish"}
                </button>
                <button onClick={() => handleDelete(q.id)} className="px-3 py-1 text-sm bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 rounded-lg hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors">Delete</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
