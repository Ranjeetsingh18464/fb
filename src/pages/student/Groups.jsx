import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../contexts/AuthContext";
import { db, collection, getDocs, getDoc, doc, updateDoc } from "../../services/firebase";

export default function Groups() {
  const navigate = useNavigate();
  const { userProfile } = useAuth();
  const [groups, setGroups] = useState([]);
  const [loading, setLoading] = useState(true);

  const grade = userProfile?.grade || "1st Grade";
  const section = userProfile?.section || "A";

  useEffect(() => {
    const fetchGroups = async () => {
      try {
        const snapshot = await getDocs(collection(db, "groups"));
        const data = [];
        snapshot.forEach(doc => data.push({ id: doc.id, ...doc.data(), joined: false }));
        setGroups(data);
      } catch (err) {
        console.error("Failed to load groups:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchGroups();
  }, []);

  const toggleJoin = async (id, currentlyJoined) => {
    try {
      const ref = doc(db, "groups", id);
      const snap = await getDoc(ref);
      const currentMembers = snap.data()?.members || 0;
      const newMembers = currentlyJoined ? currentMembers - 1 : currentMembers + 1;
      await updateDoc(ref, { members: newMembers });
      setGroups(groups.map(g => g.id === id ? { ...g, joined: !g.joined, members: newMembers } : g));
    } catch (err) {
      console.error("Failed to toggle join:", err);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Groups</h1>
        </div>
        <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">{grade} | Section {section}</p>
        {loading ? (
          <p className="text-center text-gray-400 py-12">Loading groups...</p>
        ) : groups.length === 0 ? (
          <p className="text-center text-gray-400 py-12">No groups available.</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {groups.map(g => (
              <div key={g.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md" onClick={() => navigate(`/dashboard/community/groups/${g.id}`)}>
                <h3 className="font-semibold text-lg text-gray-800 dark:text-white">{g.name}</h3>
                <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{g.description}</p>
                <div className="flex items-center justify-between mt-3">
                  <span className="text-xs text-gray-400">{g.members} members</span>
                  <button onClick={(e) => { e.stopPropagation(); toggleJoin(g.id, g.joined); }} className={`px-3 py-1 text-xs rounded ${g.joined ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                    {g.joined ? "Leave" : "Join"}
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}