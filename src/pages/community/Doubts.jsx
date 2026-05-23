import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, getDocs, setDoc, doc, updateDoc, deleteDoc, arrayUnion, serverTimestamp, query, orderBy } from "../../services/firebase";

const categories = ["Mathematics", "Science", "English", "History", "Computer Science", "General"];

export default function Doubts() {
  const navigate = useNavigate();
  const [doubts, setDoubts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", question: "" });
  const [replyText, setReplyText] = useState({});

  useEffect(() => { fetchDoubts(); }, []);

  const fetchDoubts = async () => {
    try {
      const q = query(collection(db, "doubts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setDoubts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error("Failed to load doubts:", err); }
    finally { setLoading(false); }
  };

  const askDoubt = async (e) => {
    e.preventDefault();
    const id = doc(collection(db, "doubts")).id;
    const doubt = { author: "You", subject: form.subject, question: form.question, upvotes: 0, answers: [], createdAt: serverTimestamp() };
    try {
      await setDoc(doc(db, "doubts", id), doubt);
      setDoubts([{ id, ...doubt, createdAt: new Date().toISOString() }, ...doubts]);
      setForm({ subject: "", question: "" });
      setShowForm(false);
    } catch (err) { console.error("Failed to post doubt:", err); }
  };

  const upvote = async (id) => {
    try {
      const ref = doc(db, "doubts", id);
      await updateDoc(ref, { upvotes: (doubts.find(d => d.id === id)?.upvotes || 0) + 1 });
      setDoubts(doubts.map(d => d.id === id ? { ...d, upvotes: d.upvotes + 1 } : d));
    } catch (err) { console.error("Failed to upvote:", err); }
  };

  const addReply = async (id) => {
    if (!replyText[id]?.trim()) return;
    try {
      const ref = doc(db, "doubts", id);
      await updateDoc(ref, { answers: arrayUnion(replyText[id]) });
      setDoubts(doubts.map(d => d.id === id ? { ...d, answers: [...d.answers, replyText[id]] } : d));
      setReplyText({ ...replyText, [id]: "" });
    } catch (err) { console.error("Failed to reply:", err); }
  };

  const deleteDoubt = async (id) => {
    try {
      await deleteDoc(doc(db, "doubts", id));
      setDoubts(doubts.filter(d => d.id !== id));
    } catch (err) { console.error("Failed to delete doubt:", err); }
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
            <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Doubts & Q&A</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">{showForm ? "Cancel" : "Ask Doubt"}</button>
        </div>
        {showForm && (
          <form onSubmit={askDoubt} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 space-y-3">
            <select value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required>
              <option value="">Select Category</option>
              {categories.map((c, i) => <option key={i} value={c}>{c}</option>)}
            </select>
            <textarea placeholder="Your question..." value={form.question} onChange={e => setForm({ ...form, question: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required />
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Post Question</button>
          </form>
        )}
        <div className="space-y-4">
          {doubts.map(doubt => (
            <div key={doubt.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex justify-between items-start">
                <div className="flex-1">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="font-semibold text-gray-800 dark:text-white">{doubt.author}</span>
                    <span className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">{doubt.subject}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{doubt.question}</p>
                </div>
                <div className="flex items-center gap-3 ml-3">
                  <button onClick={() => upvote(doubt.id)} className="flex items-center gap-1 text-sm text-gray-500 hover:text-blue-600">▲ {doubt.upvotes}</button>
                  {doubt.author === "You" && <button onClick={() => deleteDoubt(doubt.id)} className="text-sm text-red-500 hover:text-red-700">Delete</button>}
                </div>
              </div>
              {doubt.answers?.length > 0 && (
                <div className="mt-3 ml-4 space-y-2 border-l-2 border-gray-200 dark:border-gray-700 pl-4">
                  {doubt.answers.map((ans, i) => (
                    <p key={i} className="text-sm text-gray-500 dark:text-gray-400">{ans}</p>
                  ))}
                </div>
              )}
              <div className="mt-3 flex gap-2">
                <input value={replyText[doubt.id] || ""} onChange={e => setReplyText({ ...replyText, [doubt.id]: e.target.value })} placeholder="Write a reply..." className="flex-1 px-3 py-1 text-sm border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" />
                <button onClick={() => addReply(doubt.id)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Reply</button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}