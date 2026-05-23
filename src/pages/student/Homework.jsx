import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, collection, getDocs, query, where } from "../../services/firebase";

export default function Homework() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [homeworks, setHomeworks] = useState([]);
  const [loading, setLoading] = useState(true);

  const grade = userProfile?.grade || "1st Grade";
  const section = userProfile?.section || "A";

  useEffect(() => {
    const fetchHomework = async () => {
      try {
        const q = query(collection(db, "homework"), where("grade", "==", grade), where("section", "==", section));
        const snapshot = await getDocs(q);
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data(), status: "Pending" }));
        setHomeworks(data);
      } catch (err) {
        console.error("Failed to load homework:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchHomework();
  }, [grade, section]);

  const handleSubmit = (id) => {
    const input = document.createElement("input");
    input.type = "file";
    input.onchange = (e) => {
      if (e.target.files[0]) {
        setHomeworks(homeworks.map(h => h.id === id ? { ...h, status: "Submitted" } : h));
      }
    };
    input.click();
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Homework</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{grade} | Section {section}</p>
        {loading ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">Loading homework...</p>
        ) : homeworks.length === 0 ? (
          <p className="text-center text-gray-400 dark:text-gray-500 py-12">No homework assigned.</p>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Subject</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Title</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Due Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Status</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {homeworks.map(h => (
                  <tr key={h.id} className="hover:bg-gray-50 dark:hover:bg-gray-750">
                    <td className="p-3 text-gray-800 dark:text-white">{h.subject}</td>
                    <td className="p-3 text-gray-800 dark:text-white">{h.title}</td>
                    <td className="p-3 text-gray-500">{h.dueDate}</td>
                    <td className="p-3">
                      <span className={`px-2 py-1 text-xs rounded ${h.status === "Submitted" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300"}`}>{h.status}</span>
                    </td>
                    <td className="p-3">
                      {h.status === "Submitted" ? (
                        <button className="px-3 py-1 text-sm bg-gray-400 text-white rounded cursor-not-allowed" disabled>Done</button>
                      ) : (
                        <button onClick={() => handleSubmit(h.id)} className="px-3 py-1 text-sm bg-blue-600 text-white rounded hover:bg-blue-700">Submit</button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
}