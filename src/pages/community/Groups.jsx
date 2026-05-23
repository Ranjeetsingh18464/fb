import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialGroups = [
  { id: 1, name: "Math Enthusiasts", description: "For math lovers", type: "Public", members: 45, joined: false },
  { id: 2, name: "Science Club", description: "Experiments and discussions", type: "Private", members: 22, joined: true },
  { id: 3, name: "Book Readers", description: "Monthly book club", type: "Public", members: 18, joined: false },
  { id: 4, name: "Art Studio", description: "Share your artwork", type: "Hidden", members: 12, joined: false },
];

const typeColors = {
  Public: "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300",
  Private: "bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300",
  Hidden: "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300",
};

export default function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState(initialGroups);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ name: "", description: "", type: "Public" });

  const toggleJoin = (id) => {
    setGroups(groups.map(g => g.id === id ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 } : g));
  };

  const createGroup = (e) => {
    e.preventDefault();
    setGroups([{ id: Date.now(), ...form, members: 1, joined: true }, ...groups]);
    setForm({ name: "", description: "", type: "Public" });
    setShowForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Community Groups</h1>
          </div>
          <button onClick={() => setShowForm(!showForm)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">{showForm ? "Cancel" : "Create Group"}</button>
        </div>
        {showForm && (
          <form onSubmit={createGroup} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 space-y-3">
            <input placeholder="Group Name" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required />
            <input placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600">
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Hidden">Hidden</option>
            </select>
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Create</button>
          </form>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map(g => (
            <div key={g.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 cursor-pointer hover:shadow-md" onClick={() => navigate(`/dashboard/community/groups/${g.id}`)}>
              <div className="flex justify-between items-start mb-2">
                <h3 className="font-semibold text-gray-800 dark:text-white">{g.name}</h3>
                <span className={`px-2 py-0.5 text-xs rounded ${typeColors[g.type]}`}>{g.type}</span>
              </div>
              <p className="text-sm text-gray-500 dark:text-gray-400">{g.description}</p>
              <div className="flex items-center justify-between mt-3">
                <span className="text-xs text-gray-400">{g.members} members</span>
                <button onClick={(e) => { e.stopPropagation(); toggleJoin(g.id); }} className={`px-3 py-1 text-xs rounded ${g.joined ? "bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 hover:bg-red-200" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                  {g.joined ? "Leave" : "Join"}
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
