import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, collection, getDocs, query, where, updateDoc, doc } from "../../services/firebase";

export default function Assignments() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [assignments, setAssignments] = useState([]);
  const [loading, setLoading] = useState(true);

  const grade = userProfile?.grade || "1st Grade";
  const section = userProfile?.section || "A";

  useEffect(() => {
    const fetchAssignments = async () => {
      try {
        const q = query(collection(db, "assignments"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data(), status: "Not Submitted" }));
        setAssignments(data);
      } catch (err) {
        console.error("Failed to load assignments:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchAssignments();
  }, [grade, section]);

  const handleUpload = async (id) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = async (e) => {
      if (e.target.files[0]) {
        try {
          await updateDoc(doc(db, "assignments", id), { submitted: true });
          setAssignments(assignments.map(a => a.id === id ? { ...a, status: "Submitted" } : a));
        } catch (err) {
          console.error("Failed to submit assignment:", err);
        }
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Assignments</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{grade} | Section {section}</p>
        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading assignments...</p>
        ) : assignments.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No assignments yet.</p>
        ) : (
          <div className="grid grid-cols-1 gap-4">
            {assignments.map(a => (
              <div key={a.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div>
                  <p className="text-sm text-gray-500 dark:text-gray-400">{a.subject}</p>
                  <p className="text-lg font-semibold text-gray-800 dark:text-white">{a.title}</p>
                  <p className="text-sm text-gray-500">Due: {a.dueDate}</p>
                </div>
                <div className="flex items-center gap-3">
                  <span className={`px-3 py-1 text-xs rounded ${a.status === "Submitted" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"}`}>{a.status}</span>
                  {a.status === "Not Submitted" && <button onClick={() => handleUpload(a.id)} className="px-4 py-2 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Upload File</button>}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}