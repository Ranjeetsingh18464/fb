import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'

const allGroups = [
  { id: 1, name: 'Class 10-A', description: 'Official group for Class 10-A students and teachers. This group is for daily announcements, homework discussions, and class coordination.', type: 'Private', members: 42, posts: 156, joined: true },
  { id: 2, name: 'Science Club', description: 'For all science enthusiasts. Discussions, experiments, and projects. This group is open to all students from grades 8-12 with an interest in science.', type: 'Public', members: 128, posts: 340, joined: false },
  { id: 3, name: 'Math Olympiad', description: 'Advanced math problem solving and contest preparation.', type: 'Public', members: 67, posts: 89, joined: false },
  { id: 4, name: 'Debate Society', description: 'Hone your argumentation and public speaking skills.', type: 'Public', members: 53, posts: 112, joined: true },
  { id: 5, name: 'Staff Room', description: 'Internal communication for school staff only.', type: 'Hidden', members: 24, posts: 203, joined: false },
  { id: 6, name: 'Sports Committee', description: 'Plan and coordinate school sports events.', type: 'Private', members: 18, posts: 47, joined: false },
]

const mockPosts = [
  { id: 1, author: 'Rahul K.', timestamp: '1h ago', content: 'Can someone explain quadratic equations?', likes: 5, comments: 3, liked: false },
  { id: 2, author: 'Dr. Sharma', role: 'Teacher', timestamp: '3h ago', content: 'Reminder: Project submissions due Friday.', likes: 8, comments: 2, liked: false },
  { id: 3, author: 'Priya S.', timestamp: '5h ago', content: 'Here is the link to the study material we discussed today.', likes: 12, comments: 4, liked: false },
  { id: 4, author: 'Dr. Sharma', role: 'Teacher', timestamp: '1d ago', content: 'Great session everyone! Keep up the good work.', likes: 25, comments: 6, liked: false },
]

const mockMembers = [
  { name: 'Dr. Sharma', role: 'Admin', avatar: 'DS' },
  { name: 'Priya S.', role: 'Moderator', avatar: 'PS' },
  { name: 'Rahul K.', role: 'Member', avatar: 'RK' },
  { name: 'Anjali M.', role: 'Member', avatar: 'AM' },
  { name: 'Vikram J.', role: 'Member', avatar: 'VJ' },
]

const mockPolls = [
  { id: 1, question: 'Which day for the next class test?', options: ['Monday', 'Wednesday', 'Friday'], votes: [12, 8, 15] },
]

const mockAssignments = [
  { id: 1, title: 'Chapter 5 Exercises', due: '20 Mar', submissions: 18 },
  { id: 2, title: 'Science Project Report', due: '25 Mar', submissions: 10 },
]

const tabs = ['Feed', 'Members', 'About', 'Media', 'Polls', 'Assignments']

export default function GroupDetail() {
  const navigate = useNavigate()
  const { groupId } = useParams()
  const group = allGroups.find(g => g.id === Number(groupId)) || allGroups[0]
  const [activeTab, setActiveTab] = useState('Feed')
  const [posts, setPosts] = useState(mockPosts)
  const [newPostText, setNewPostText] = useState('')
  const [postFile, setPostFile] = useState(null)
  const [postFilePreview, setPostFilePreview] = useState('')
  const [newPollQ, setNewPollQ] = useState('')
  const [newPollOpt, setNewPollOpt] = useState('')
  const [polls, setPolls] = useState(mockPolls)
  const [votedPolls, setVotedPolls] = useState({})
  const [mediaFiles, setMediaFiles] = useState([])

  const handlePost = () => {
    if (!newPostText.trim() && !postFile) return
    setPosts([{ id: Date.now(), author: 'You', timestamp: 'Just now', content: newPostText, file: postFile ? { name: postFile.name, url: postFilePreview, type: postFile.type } : null, likes: 0, comments: 0, liked: false }, ...posts])
    setNewPostText(''); setPostFile(null); setPostFilePreview('')
  }

  const toggleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p))
  }

  const handleVote = (pollId, optIdx) => {
    if (votedPolls[pollId] !== undefined) return
    setVotedPolls(prev => ({ ...prev, [pollId]: optIdx }))
    setPolls(prev => prev.map(p => p.id === pollId ? { ...p, votes: p.votes.map((v, i) => i === optIdx ? v + 1 : v) } : p))
  }

  const addPoll = () => {
    if (!newPollQ.trim() || !newPollOpt.trim()) return
    const opts = newPollOpt.split(',').map(s => s.trim()).filter(Boolean)
    if (opts.length < 2) return
    setPolls(prev => [...prev, { id: Date.now(), question: newPollQ, options: opts, votes: opts.map(() => 0) }])
    setNewPollQ(''); setNewPollOpt('')
  }

  return (
    <div className="page-container min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <button onClick={() => navigate(-1)} className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white mb-4">
          <svg className="w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" /></svg>
          Back to Groups
        </button>

        <div className="bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden mb-6">
          <div className="h-32 bg-gradient-to-r from-blue-500 to-purple-600" />
          <div className="p-6">
            <div className="flex items-center gap-4">
              <div className="w-16 h-16 rounded-xl bg-white dark:bg-gray-700 flex items-center justify-center text-2xl font-bold text-blue-600 dark:text-blue-400 -mt-10 shadow-lg">{group.name.charAt(0)}</div>
              <div>
                <h1 className="text-xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
                <p className="text-sm text-gray-500 dark:text-gray-400">{group.type === 'Public' ? '🌐' : group.type === 'Private' ? '🔒' : '👁️'} {group.type} · {group.members} members</p>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 mt-3 text-sm">{group.description}</p>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${activeTab === tab ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{tab}</button>
          ))}
        </div>

        {activeTab === 'Feed' && (
          <div>
            <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
              <textarea className="input-field w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none outline-none" rows="2" placeholder={`Write something in ${group.name}...`} value={newPostText} onChange={e => setNewPostText(e.target.value)} />
              {postFilePreview && <div className="mt-2 relative inline-block">
                {postFile && postFile.type.startsWith('image/') ? <img src={postFilePreview} className="max-h-32 rounded-lg" /> : <div className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">📎 {postFile?.name}</div>}
                <button onClick={() => { setPostFile(null); setPostFilePreview('') }} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs leading-none">&times;</button>
              </div>}
              <div className="flex items-center justify-between mt-2">
                <label className="flex items-center gap-2 cursor-pointer text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400 text-sm">
                  <svg className="w-5 h-5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" /></svg>
                  <span>Attach</span>
                  <input type="file" accept="image/*,.pdf,.doc,.docx" className="hidden" onChange={e => { const f = e.target.files[0]; if (f) { setPostFile(f); const reader = new FileReader(); reader.onload = () => setPostFilePreview(reader.result); reader.readAsDataURL(f) } }} />
                </label>
                <button onClick={handlePost} className="btn-primary px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Post</button>
              </div>
            </div>
            {posts.map(post => (
              <div key={post.id} className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center text-green-600 dark:text-green-300 text-xs font-semibold">{post.author.charAt(0)}</div>
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-semibold text-gray-900 dark:text-white text-sm">{post.author}</span>
                      {post.role && <span className="text-xs px-1.5 py-0.5 rounded bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300">{post.role}</span>}
                    </div>
                    <span className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp}</span>
                  </div>
                </div>
                <p className="text-gray-700 dark:text-gray-300 mt-2 text-sm">{post.content}</p>
                {post.file && <div className="mt-2">
                  {post.file.type.startsWith('image/') ? <img src={post.file.url} className="max-h-48 rounded-lg border border-gray-200 dark:border-gray-700" /> : <a href={post.file.url} target="_blank" className="flex items-center gap-2 p-2 bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-blue-600 dark:text-blue-400 hover:underline">📎 {post.file.name}</a>}
                </div>}
                <div className="flex items-center gap-3 mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 ${post.liked ? 'text-red-500' : 'hover:text-red-500'}`}>{post.liked ? '❤️' : '🤍'} {post.likes}</button>
                  <span>💬 {post.comments}</span>
                </div>
              </div>
            ))}
          </div>
        )}

        {activeTab === 'Members' && (
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-3">Members ({mockMembers.length})</h2>
            <div className="space-y-3">
              {mockMembers.map((m, i) => (
                <div key={i} className="flex items-center justify-between py-2">
                  <div className="flex items-center gap-3">
                    <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 text-xs font-semibold">{m.avatar}</div>
                    <div>
                      <span className="text-sm font-medium text-gray-900 dark:text-white">{m.name}</span>
                      <span className={`ml-2 text-xs ${m.role === 'Admin' ? 'text-red-500' : m.role === 'Moderator' ? 'text-blue-500' : 'text-gray-400'}`}>({m.role})</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'About' && (
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
            <h2 className="font-semibold text-gray-900 dark:text-white mb-2">About This Group</h2>
            <p className="text-gray-600 dark:text-gray-400 text-sm">{group.description}</p>
            <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 space-y-1">
              <p>📅 Created: January 2025</p>
              <p>👤 Created by: Dr. Sharma</p>
              <p>🏷️ Type: {group.type}</p>
              <p>👥 Members: {group.members}</p>
              <p>📝 Posts: {group.posts}</p>
            </div>
          </div>
        )}

        {activeTab === 'Media' && (
          <MediaUpload mediaFiles={mediaFiles} setMediaFiles={setMediaFiles} />
        )}

        {activeTab === 'Polls' && (
          <div>
            <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-4">
              <h3 className="font-semibold text-gray-900 dark:text-white mb-2">Create a Poll</h3>
              <input className="input-field w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2 outline-none" placeholder="Poll question..." value={newPollQ} onChange={e => setNewPollQ(e.target.value)} />
              <input className="input-field w-full p-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2 outline-none" placeholder="Options (comma separated)..." value={newPollOpt} onChange={e => setNewPollOpt(e.target.value)} />
              <button onClick={addPoll} className="btn-primary px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Add Poll</button>
            </div>
            {polls.map(poll => {
              const total = poll.votes.reduce((a, b) => a + b, 0)
              return (
                <div key={poll.id} className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-3">
                  <h4 className="font-medium text-gray-900 dark:text-white mb-3">{poll.question}</h4>
                  {poll.options.map((opt, i) => {
                    const pct = total ? Math.round((poll.votes[i] / total) * 100) : 0
                    return (
                      <button key={i} onClick={() => handleVote(poll.id, i)} disabled={votedPolls[poll.id] !== undefined} className={`w-full text-left p-2 rounded-lg mb-1 transition-colors ${votedPolls[poll.id] === i ? 'bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300' : 'bg-gray-50 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-600'}`}>
                        <div className="flex justify-between text-sm">
                          <span>{opt}</span>
                          <span>{poll.votes[i]} ({pct}%)</span>
                        </div>
                        <div className="w-full h-1.5 bg-gray-200 dark:bg-gray-600 rounded-full mt-1 overflow-hidden">
                          <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${pct}%` }} />
                        </div>
                      </button>
                    )
                  })}
                </div>
              )
            })}
          </div>
        )}

        {activeTab === 'Assignments' && (
          <div className="space-y-3">
            {mockAssignments.map(a => (
              <div key={a.id} className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 flex items-center justify-between">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">{a.title}</h4>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Due: {a.due} · {a.submissions} submissions</p>
                </div>
                <button onClick={() => alert(`Viewing ${a.title}`)} className="btn-primary px-3 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-xs font-medium">View</button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function MediaUpload({ mediaFiles, setMediaFiles }) {
  const [dragOver, setDragOver] = useState(false)

  const processFiles = (files) => {
    Array.from(files).forEach(f => {
      const reader = new FileReader()
      reader.onload = () => setMediaFiles(prev => [...prev, { name: f.name, url: reader.result, type: f.type }])
      reader.readAsDataURL(f)
    })
  }

  return (
    <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-6">
      <h2 className="font-semibold text-gray-900 dark:text-white mb-4">Shared Files & Media</h2>
      {mediaFiles.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 mb-4">
          {mediaFiles.map((f, i) => (
            <div key={i} className="relative group">
              {f.type?.startsWith('image/') ? (
                <img src={f.url} className="w-full h-24 object-cover rounded-lg border border-gray-200 dark:border-gray-700" />
              ) : (
                <div className="w-full h-24 flex items-center justify-center bg-gray-100 dark:bg-gray-700 rounded-lg text-sm text-gray-600 dark:text-gray-400">📎 {f.name}</div>
              )}
              <button onClick={() => setMediaFiles(mediaFiles.filter((_, j) => j !== i))} className="absolute top-1 right-1 w-5 h-5 bg-red-500 text-white rounded-full text-xs leading-none opacity-0 group-hover:opacity-100 transition-opacity">&times;</button>
            </div>
          ))}
        </div>
      )}
      <div
        onDragOver={e => { e.preventDefault(); setDragOver(true) }}
        onDragEnter={e => { e.preventDefault(); setDragOver(true) }}
        onDragLeave={e => { e.preventDefault(); setDragOver(false) }}
        onDrop={e => { e.preventDefault(); setDragOver(false); processFiles(e.dataTransfer.files) }}
        className={`border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-colors ${dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600 hover:border-blue-400 dark:hover:border-blue-500'}`}
        onClick={() => document.getElementById('media-upload-input').click()}
      >
        <p className="text-gray-500 dark:text-gray-400 text-sm">{dragOver ? '📂 Release to upload' : '📁 Drag & drop files here or click to browse'}</p>
        <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Images, PDFs, DOCs</p>
        <input id="media-upload-input" type="file" accept="image/*,.pdf,.doc,.docx" multiple className="hidden" onChange={e => { processFiles(e.target.files); e.target.value = '' }} />
      </div>
    </div>
  )
}
