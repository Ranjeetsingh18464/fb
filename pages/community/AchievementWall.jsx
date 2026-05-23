import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const types = ['All', 'Certificate', 'Project', 'Quiz Score', 'Attendance', 'Sports']
const typeIcons = { Certificate: '🏅', Project: '🔬', 'Quiz Score': '📊', Attendance: '📋', Sports: '⚽' }

export default function AchievementWall() {
  const navigate = useNavigate()
  const [achievements, setAchievements] = useState([
    { id: 1, student: 'Rahul K.', type: 'Quiz Score', title: 'Math Quiz Topper', description: 'Scored 100% in weekly math quiz.', date: '15 Mar 2025', likes: 23, comments: ['Great job!', 'Well done!'] },
    { id: 2, student: 'Anjali M.', type: 'Certificate', title: 'Science Olympiad', description: 'Secured gold medal in district science olympiad.', date: '10 Mar 2025', likes: 45, comments: ['Amazing achievement!', 'Proud of you!'] },
    { id: 3, student: 'Vikram J.', type: 'Sports', title: 'Football Tournament MVP', description: 'Awarded MVP in inter-school football tournament.', date: '5 Mar 2025', likes: 67, comments: ['You are a star!'] },
    { id: 4, student: 'Priya S.', type: 'Project', title: 'Science Fair Winner', description: 'Won first place for renewable energy model.', date: '28 Feb 2025', likes: 34, comments: ['Innovative thinking!'] },
    { id: 5, student: 'Arjun T.', type: 'Attendance', title: 'Perfect Attendance', description: '100% attendance for the entire academic year.', date: '20 Feb 2025', likes: 19, comments: [] },
  ])
  const [activeType, setActiveType] = useState('All')
  const [showForm, setShowForm] = useState(false)
  const [newType, setNewType] = useState('Certificate')
  const [newTitle, setNewTitle] = useState('')
  const [newDesc, setNewDesc] = useState('')
  const [newImage, setNewImage] = useState(null)
  const [liked, setLiked] = useState({})
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')
  const [editDesc, setEditDesc] = useState('')

  const filtered = activeType === 'All' ? achievements : achievements.filter(a => a.type === activeType)

  const handlePost = () => {
    if (!newTitle.trim() || !newDesc.trim()) return
    setAchievements(prev => [{
      id: Date.now(), student: 'You', type: newType, title: newTitle, description: newDesc,
      date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }),
      likes: 0, comments: [], image: newImage,
    }, ...prev])
    setNewTitle(''); setNewDesc(''); setNewImage(null); setShowForm(false)
  }

  const toggleLike = (id) => {
    setLiked(prev => prev[id] ? { ...prev, [id]: false } : { ...prev, [id]: true })
  }

  const handleDelete = (id) => {
    if (confirm('Delete this achievement?')) setAchievements(achievements.filter(a => a.id !== id))
  }

  const saveEdit = (id) => {
    if (!editTitle.trim()) return
    setAchievements(achievements.map(a => a.id === id ? { ...a, title: editTitle, description: editDesc } : a))
    setEditId(null); setEditTitle(''); setEditDesc('')
  }

  return (
    <div className="page-container min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Achievement Wall</h1>
            <p className="text-sm text-gray-500 dark:text-gray-400">Celebrate your accomplishments!</p>
          </div>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setShowForm(!showForm)} className="btn-primary px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">+ Post Achievement</button>
          {showForm && <button onClick={() => setShowForm(false)} className="btn-outline">Cancel</button>}
        </div>

        {showForm && (
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Share Your Achievement</h3>
            <select className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2 outline-none" value={newType} onChange={e => setNewType(e.target.value)}>
              {types.filter(t => t !== 'All').map(t => <option key={t} value={t}>{t}</option>)}
            </select>
            <input className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2 outline-none" placeholder="Achievement title..." value={newTitle} onChange={e => setNewTitle(e.target.value)} />
            <textarea className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-3 resize-none outline-none" rows="3" placeholder="Describe your achievement..." value={newDesc} onChange={e => setNewDesc(e.target.value)} />
            {newImage && <div className="mb-3"><img src={newImage} alt="Preview" className="w-32 h-32 object-cover rounded-lg" /></div>}
            <div className="flex items-center justify-between">
              <label className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 cursor-pointer">📷 Upload Image
                <input type="file" accept="image/*" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) { const r = new FileReader(); r.onload = ev => setNewImage(ev.target.result); r.readAsDataURL(f) } }} />
              </label>
              <button onClick={handlePost} className="btn-primary px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Share</button>
            </div>
          </div>
        )}

        <div className="flex flex-wrap gap-2 mb-6">
          {types.map(type => (
            <button key={type} onClick={() => setActiveType(type)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeType === type ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{type}</button>
          ))}
        </div>

        <div className="space-y-4">
          {filtered.map(ach => (
            <div key={ach.id} className="card card-hover bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-5 transition-shadow hover:shadow-md">
              <div className="flex items-start gap-4">
                <div className="text-3xl">{typeIcons[ach.type] || '🏆'}</div>
                <div className="flex-1">
                  {editId === ach.id ? (
                    <div className="space-y-2">
                      <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="input-field text-sm" />
                      <textarea value={editDesc} onChange={e => setEditDesc(e.target.value)} className="input-field text-sm" rows={2} />
                      <div className="flex gap-2">
                        <button onClick={() => saveEdit(ach.id)} className="btn-primary text-xs px-3 py-1">Save</button>
                        <button onClick={() => setEditId(null)} className="btn-outline text-xs px-3 py-1">Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <>
                      <div className="flex items-center justify-between">
                        <h3 className="font-semibold text-gray-900 dark:text-white">{ach.title}</h3>
                        <span className="text-xs bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300 px-2 py-0.5 rounded-full">{ach.type}</span>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{ach.description}</p>
                      {ach.image && <div className="mt-2"><img src={ach.image} alt={ach.title} className="w-full max-h-48 object-cover rounded-lg" /></div>}
                      <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                        <span>👤 {ach.student}</span>
                        <span>📅 {ach.date}</span>
                      </div>
                      <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700">
                        <button onClick={() => toggleLike(ach.id)} className={`flex items-center gap-1 text-sm transition-colors ${liked[ach.id] ? 'text-red-500' : 'text-gray-500 dark:text-gray-400 hover:text-red-500'}`}>
                          {liked[ach.id] ? '❤️' : '🤍'} {ach.likes + (liked[ach.id] ? 1 : 0)}
                        </button>
                        <span className="flex items-center gap-1 text-sm text-gray-500 dark:text-gray-400">💬 {ach.comments.length}</span>
                        <button onClick={() => { setEditId(ach.id); setEditTitle(ach.title); setEditDesc(ach.description) }} className="text-gray-400 hover:text-blue-500 text-xs ml-auto">✏️</button>
                        <button onClick={() => handleDelete(ach.id)} className="text-gray-400 hover:text-red-500 text-xs">🗑️</button>
                      </div>
                    </>
                  )}
                  {ach.comments.length > 0 && (
                    <div className="mt-2 space-y-1">
                      {ach.comments.map((c, i) => <p key={i} className="text-xs text-gray-500 dark:text-gray-400">💬 {c}</p>)}
                    </div>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
