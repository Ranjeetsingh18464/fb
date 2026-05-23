import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, collection, getDocs, query, where, doc, setDoc, updateDoc, deleteDoc } from "../../services/firebase";

export default function StudyPlanner() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ subject: "", topic: "", date: "", duration: "" });

  const grade = userProfile?.grade || "1st Grade";
  const section = userProfile?.section || "A";

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const q = query(collection(db, "studyPlanner"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data() }));
        setTasks(data);
      } catch (err) {
        console.error("Failed to load study tasks:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchTasks();
  }, [grade, section]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const newId = doc(collection(db, "studyPlanner")).id;
      await setDoc(doc(db, "studyPlanner", newId), { ...form, grade, section, completed: false });
      setTasks([...tasks, { id: newId, ...form, completed: false }]);
      setForm({ subject: "", topic: "", date: "", duration: "" });
      setShowForm(false);
    } catch (err) {
      console.error("Failed to add task:", err);
    }
  };

  const toggleComplete = async (id, completed) => {
    try {
      await updateDoc(doc(db, "studyPlanner", id), { completed: !completed });
      setTasks(tasks.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
    } catch (err) {
      console.error("Failed to update task:", err);
    }
  };

  const deleteTask = async (id) => {
    try {
      await deleteDoc(doc(db, "studyPlanner", id));
      setTasks(tasks.filter(t => t.id !== id));
    } catch (err) {
      console.error("Failed to delete task:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div>
            <div className="flex items-center gap-4">
              <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
              <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Study Planner</h1>
            </div>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{grade} | Section {section}</p>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">{showForm ? "Cancel" : "Add Task"}</button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 space-y-3">
            <input placeholder="Subject" value={form.subject} onChange={e => setForm({ ...form, subject: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required />
            <input placeholder="Topic" value={form.topic} onChange={e => setForm({ ...form, topic: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required />
            <input type="date" value={form.date} onChange={e => setForm({ ...form, date: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required />
            <input placeholder="Duration (e.g. 1h, 1.5h)" value={form.duration} onChange={e => setForm({ ...form, duration: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required />
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Add</button>
          </form>
        )}
        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading tasks...</p>
        ) : tasks.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No study tasks yet.</p>
        ) : (
          <div className="space-y-3">
            {tasks.map(task => (
              <div key={task.id} className={`bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex items-center justify-between ${task.completed ? "opacity-60" : ""}`}>
                <div className="flex items-center gap-3">
                  <input type="checkbox" checked={task.completed} onChange={() => toggleComplete(task.id, task.completed)} className="w-5 h-5" />
                  <div>
                    <p className={`font-semibold text-gray-800 dark:text-white ${task.completed ? "line-through" : ""}`}>{task.topic}</p>
                    <p className="text-sm text-gray-500">{task.subject} &middot; {task.date} &middot; {task.duration}</p>
                  </div>
                </div>
                <button onClick={() => deleteTask(task.id)} className="text-red-500 hover:text-red-700 text-sm">Delete</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}