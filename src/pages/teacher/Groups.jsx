import { useState } from "react";
import { useNavigate } from "react-router-dom";

const initialGroups = [
  { id: 1, name: "Science Department", description: "Science faculty discussion group", members: 12, joined: true },
  { id: 2, name: "Grade 10 Teachers", description: "All Grade 10 teachers", members: 8, joined: true },
  { id: 3, name: "Curriculum Committee", description: "Curriculum planning and review", members: 6, joined: false },
  { id: 4, name: "Sports Coordinators", description: "Sports event coordination", members: 5, joined: false },
  { id: 5, name: "Exam Board", description: "Exam scheduling and results", members: 10, joined: true },
  { id: 6, name: "PTA Liaison", description: "Parent-teacher coordination", members: 4, joined: false },
];

export default function Groups() {
  const navigate = useNavigate();
  const [groups, setGroups] = useState(initialGroups);
  const [showModal, setShowModal] = useState(false);
  const [editing, setEditing] = useState(null);
  const [form, setForm] = useState({ name: "", description: "" });

  const resetForm = () => {
    setForm({ name: "", description: "" });
    setEditing(null);
    setShowModal(false);
  };

  const handleSubmit = () => {
    if (!form.name.trim()) return;
    if (editing) {
      setGroups(groups.map(g => g.id === editing.id ? { ...g, name: form.name, description: form.description } : g));
    } else {
      setGroups([...groups, { id: Date.now(), name: form.name, description: form.description, members: 1, joined: true }]);
    }
    resetForm();
  };

  const handleEdit = (g) => {
    setForm({ name: g.name, description: g.description || "" });
    setEditing(g);
    setShowModal(true);
  };

  const handleDelete = (id) => {
    if (window.confirm("Delete this group?")) {
      setGroups(groups.filter(g => g.id !== id));
    }
  };

  const toggleJoin = (id) => {
    setGroups(groups.map(g => g.id === id ? { ...g, joined: !g.joined } : g));
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">&larr; Back</button>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Groups</h1>
          <button onClick={() => { resetForm(); setShowModal(true); }} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors text-sm">+ Create Group</button>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {groups.map((g) => (
            <div key={g.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-5">
              <div className="flex items-start justify-between mb-1">
                <h3 className="font-semibold text-gray-900 dark:text-white cursor-pointer hover:text-blue-600 dark:hover:text-blue-400" onClick={() => navigate(`/dashboard/teacher/groups/${g.id}`, { state: { joined: g.joined } })}>{g.name}</h3>
                <div className="flex gap-1">
                  <button onClick={(e) => { e.stopPropagation(); handleEdit(g); }} className="p-1 text-gray-400 hover:text-blue-600 dark:hover:text-blue-400" title="Edit">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" /></svg>
                  </button>
                  <button onClick={(e) => { e.stopPropagation(); handleDelete(g.id); }} className="p-1 text-gray-400 hover:text-red-600 dark:hover:text-red-400" title="Delete">
                    <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" /></svg>
                  </button>
                </div>
              </div>
              {g.description && <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">{g.description}</p>}
              <p className="text-sm text-gray-500 dark:text-gray-400">{g.members} members</p>
              <button onClick={() => toggleJoin(g.id)} className={`mt-4 w-full px-4 py-2 text-sm rounded-lg transition-colors ${g.joined ? "bg-red-100 dark:bg-red-900/30 text-red-700 dark:text-red-300 hover:bg-red-200 dark:hover:bg-red-900/50" : "bg-blue-600 text-white hover:bg-blue-700"}`}>
                {g.joined ? "Leave" : "Join"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {showModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow-xl w-full max-w-md mx-4 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">{editing ? "Edit Group" : "Create Group"}</h2>
              <button onClick={resetForm} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 text-xl leading-none">&times;</button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Group Name</label>
                <input type="text" value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none" />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Description</label>
                <textarea rows={3} value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 outline-none resize-none" />
              </div>
            </div>
            <div className="flex items-center justify-end gap-3 mt-6">
              <button onClick={resetForm} className="px-4 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">Cancel</button>
              <button onClick={handleSubmit} className="px-5 py-2 bg-blue-600 text-white text-sm font-medium rounded-lg hover:bg-blue-700">{editing ? "Update" : "Create"}</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}