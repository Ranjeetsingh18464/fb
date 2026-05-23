import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

export default function Groups() {
  const navigate = useNavigate()
  const [groups, setGroups] = useState([
    { id: 1, name: 'Class 10-A', description: 'Official group for Class 10-A students and teachers.', type: 'Private', members: 42, posts: 156, joined: true },
    { id: 2, name: 'Science Club', description: 'For all science enthusiasts. Discussions, experiments, and projects.', type: 'Public', members: 128, posts: 340, joined: false },
    { id: 3, name: 'Math Olympiad', description: 'Advanced math problem solving and contest preparation.', type: 'Public', members: 67, posts: 89, joined: false },
    { id: 4, name: 'Debate Society', description: 'Hone your argumentation and public speaking skills.', type: 'Public', members: 53, posts: 112, joined: true },
    { id: 5, name: 'Staff Room', description: 'Internal communication for school staff only.', type: 'Hidden', members: 24, posts: 203, joined: false },
    { id: 6, name: 'Sports Committee', description: 'Plan and coordinate school sports events.', type: 'Private', members: 18, posts: 47, joined: false },
  ])
  const [activeTab, setActiveTab] = useState('All Groups')
  const [search, setSearch] = useState('')
  const [showCreate, setShowCreate] = useState(false)
  const [form, setForm] = useState({ name: '', description: '', type: 'Public' })

  const filtered = groups.filter(g => {
    const matchSearch = g.name.toLowerCase().includes(search.toLowerCase()) || g.description.toLowerCase().includes(search.toLowerCase())
    if (activeTab === 'My Groups') return g.joined && matchSearch
    if (activeTab === 'Discover') return !g.joined && matchSearch
    return matchSearch
  })

  const toggleJoin = (id) => {
    setGroups(groups.map(g => g.id === id ? { ...g, joined: !g.joined, members: g.joined ? g.members - 1 : g.members + 1 } : g))
  }

  const handleCreate = () => {
    if (!form.name) return
    setGroups([...groups, { id: Date.now(), ...form, members: 1, posts: 0, joined: true }])
    setForm({ name: '', description: '', type: 'Public' }); setShowCreate(false)
  }

  return (
    <div className="page-container min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Groups</h1>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setShowCreate(!showCreate)} className="btn-primary px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">+ Create Group</button>
          {showCreate && <button onClick={() => setShowCreate(false)} className="btn-outline">Cancel</button>}
        </div>

        {showCreate && <div className="card mb-6 p-4">
          <h3 className="font-semibold mb-4">New Group</h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="input-field" placeholder="Group name" />
            <select value={form.type} onChange={e => setForm({ ...form, type: e.target.value })} className="input-field">
              <option value="Public">Public</option>
              <option value="Private">Private</option>
              <option value="Hidden">Hidden</option>
            </select>
            <div className="md:col-span-3">
              <textarea value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} className="input-field w-full" placeholder="Description" rows={2} />
            </div>
          </div>
          <button onClick={handleCreate} className="btn-primary mt-3">Create Group</button>
        </div>}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input className="input-field flex-1 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none" placeholder="Search groups..." value={search} onChange={e => setSearch(e.target.value)} />
          <div className="flex gap-2">
            {['All Groups', 'My Groups', 'Discover'].map(tab => (
              <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{tab}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map(group => (
            <div key={group.id} className="card card-hover bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start justify-between mb-3">
                <button onClick={() => navigate(`/dashboard/community/groups/${group.id}`)} className="w-12 h-12 rounded-xl bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white font-bold text-lg hover:opacity-90">{group.name.charAt(0)}</button>
                <span className={`text-xs px-2.5 py-1 rounded-full font-medium ${group.type === 'Public' ? 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300' : group.type === 'Private' ? 'bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300' : 'bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300'}`}>
                  {group.type === 'Hidden' ? '👁️ Hidden' : group.type === 'Private' ? '🔒 Private' : '🌐 Public'}
                </span>
              </div>
              <div className="flex items-center gap-2">
                <h3 className="font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                <button onClick={() => navigate(`/dashboard/community/groups/${group.id}`)} className="p-1 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
                  <svg className="w-3.5 h-3.5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </button>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">{group.description}</p>
              <div className="flex items-center gap-4 mt-3 text-xs text-gray-500 dark:text-gray-400">
                <span>👥 {group.members} members</span>
                <span>📝 {group.posts} posts</span>
              </div>
              <div className="mt-4">
                <button onClick={() => toggleJoin(group.id)} className={`w-full py-2 rounded-lg text-sm font-medium transition-colors ${group.joined ? 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300' : 'bg-blue-600 hover:bg-blue-700 text-white'}`}>
                  {group.joined ? 'Leave' : group.type === 'Public' ? 'Join' : 'Request to Join'}
                </button>
              </div>
            </div>
          ))}
        </div>

        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No groups found.</div>}
      </div>
    </div>
  )
}
