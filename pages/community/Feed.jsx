import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const categories = ['All', 'Homework', 'Notices', 'Achievements', 'Study Tips', 'Events']

export default function Feed() {
  const navigate = useNavigate()
  const [posts, setPosts] = useState([
    { id: 1, author: 'Dr. Sharma', role: 'Teacher', timestamp: '2h ago', category: 'Homework', title: 'Math Assignment', content: 'Complete Chapter 5 exercises by Friday.', attachments: ['hw_math.pdf'], likes: 12, comments: 4, image: null, liked: false },
    { id: 2, author: 'Principal Mehta', role: 'Admin', timestamp: '5h ago', category: 'Notices', title: 'School Holiday', content: 'School remains closed on 26th Jan on account of Republic Day.', attachments: [], likes: 45, comments: 8, image: null, liked: false },
    { id: 3, author: 'Sports Dept', role: 'Teacher', timestamp: '1d ago', category: 'Achievements', title: 'Inter-School Champions!', content: 'Our football team won the inter-school tournament.', attachments: ['trophy.jpg'], likes: 89, comments: 15, image: null, liked: false },
    { id: 4, author: 'Dr. Sharma', role: 'Teacher', timestamp: '3h ago', category: 'Study Tips', title: 'Memory Techniques', content: 'Use mnemonics and spaced repetition to improve memory retention.', attachments: [], likes: 33, comments: 6, image: null, liked: false },
    { id: 5, author: 'Cultural Committee', role: 'Admin', timestamp: '1d ago', category: 'Events', title: 'Annual Day Celebration', content: 'Annual Day function on 15th March. Register by 10th March.', attachments: ['event_poster.jpg'], likes: 67, comments: 12, image: null, liked: false },
  ])
  const [activeTab, setActiveTab] = useState('All')
  const [postText, setPostText] = useState('')
  const [postTitle, setPostTitle] = useState('')
  const [postCategory, setPostCategory] = useState('Notices')
  const [visibleCount, setVisibleCount] = useState(3)
  const [viewPost, setViewPost] = useState(null)
  const [editId, setEditId] = useState(null)
  const [editText, setEditText] = useState('')
  const [editTitle, setEditTitle] = useState('')

  const filteredPosts = activeTab === 'All' ? posts : posts.filter(p => p.category === activeTab)
  const visiblePosts = filteredPosts.slice(0, visibleCount)

  const handlePost = () => {
    if (!postText.trim()) return
    const newPost = {
      id: Date.now(),
      author: 'You',
      role: 'Teacher',
      timestamp: 'Just now',
      category: postCategory,
      title: postTitle || 'New Post',
      content: postText,
      attachments: [],
      likes: 0,
      comments: 0,
      image: null,
      liked: false
    }
    setPosts([newPost, ...posts])
    setPostText(''); setPostTitle(''); setPostCategory('Notices')
  }

  const toggleLike = (id) => {
    setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p))
  }

  const handleEdit = (p) => {
    setEditId(p.id); setEditTitle(p.title); setEditText(p.content)
  }

  const saveEdit = () => {
    if (!editTitle.trim()) return
    setPosts(posts.map(p => p.id === editId ? { ...p, title: editTitle, content: editText } : p))
    setEditId(null); setEditTitle(''); setEditText('')
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
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Educational Feed</h1>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <input value={postTitle} onChange={e => setPostTitle(e.target.value)} className="input-field w-full mb-3 p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white outline-none" placeholder="Post title..." />
          <textarea className="input-field w-full p-3 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none outline-none" rows="3" placeholder="Share an update, homework, notice..." value={postText} onChange={e => setPostText(e.target.value)} />
          <div className="flex items-center justify-between mt-3">
            <div className="flex gap-2">
              <select value={postCategory} onChange={e => setPostCategory(e.target.value)} className="input-field text-sm w-auto">
                {categories.filter(c => c !== 'All').map(c => <option key={c} value={c}>{c}</option>)}
              </select>
            </div>
            <button onClick={handlePost} className="btn-primary px-5 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Post</button>
          </div>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {categories.map(cat => (
            <button key={cat} onClick={() => setActiveTab(cat)} className={`px-4 py-1.5 rounded-full text-sm font-medium transition-colors ${activeTab === cat ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{cat}</button>
          ))}
        </div>

        <div className="space-y-4">
          {visiblePosts.map(post => (
            <div key={post.id} className="card card-hover bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 transition-shadow hover:shadow-md">
              {editId === post.id ? (
                <div className="space-y-3">
                  <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="input-field w-full p-2 border rounded text-sm" placeholder="Title" />
                  <textarea value={editText} onChange={e => setEditText(e.target.value)} className="input-field w-full p-2 border rounded text-sm" rows={3} />
                  <div className="flex gap-2">
                    <button onClick={saveEdit} className="btn-primary text-xs px-3 py-1">Save</button>
                    <button onClick={() => setEditId(null)} className="btn-outline text-xs px-3 py-1">Cancel</button>
                  </div>
                </div>
              ) : (
                <>
                  <div className="flex items-start justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-full bg-blue-100 dark:bg-blue-900 flex items-center justify-center text-blue-600 dark:text-blue-300 font-semibold text-sm">{post.author.charAt(0)}</div>
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-semibold text-gray-900 dark:text-white">{post.author}</span>
                          <span className={`text-xs px-2 py-0.5 rounded-full ${post.role === 'Admin' ? 'bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300' : 'bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300'}`}>{post.role}</span>
                        </div>
                        <span className="text-xs text-gray-500 dark:text-gray-400">{post.timestamp} · {post.category}</span>
                      </div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => handleEdit(post)} className="text-gray-400 hover:text-blue-500 text-xs">✏️</button>
                      <button onClick={() => { if (confirm('Delete this post?')) setPosts(posts.filter(x => x.id !== post.id)) }} className="text-gray-400 hover:text-red-500 text-xs">🗑️</button>
                    </div>
                  </div>
                  <h3 className="font-semibold text-gray-900 dark:text-white mt-3">{post.title}</h3>
                  <p className="text-gray-700 dark:text-gray-300 mt-1 text-sm">{post.content}</p>
                  {post.attachments.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {post.attachments.map((att, i) => <span key={i} className="text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-400 px-2 py-1 rounded">📎 {att}</span>)}
                    </div>
                  )}
                  <div className="flex items-center gap-4 mt-3 pt-3 border-t border-gray-100 dark:border-gray-700 text-sm text-gray-500 dark:text-gray-400">
                    <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 transition-colors ${post.liked ? 'text-red-500' : 'hover:text-red-500'}`}>{post.liked ? '❤️' : '🤍'} {post.likes}</button>
                    <button onClick={() => setViewPost(post)} className="flex items-center gap-1 hover:text-blue-500">💬 {post.comments}</button>
                  </div>
                </>
              )}
            </div>
          ))}
        </div>

        {visibleCount < filteredPosts.length && (
          <div className="text-center mt-6">
            <button onClick={() => setVisibleCount(prev => prev + 3)} className="btn-primary px-6 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">Load More</button>
          </div>
        )}

        {filteredPosts.length === 0 && (
          <div className="text-center py-12 text-gray-400">No posts in this category yet.</div>
        )}
      </div>

      {viewPost && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewPost(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{viewPost.title}</h3>
            <button onClick={() => setViewPost(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
          </div>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">{viewPost.content}</p>
          <div className="space-y-1 text-sm text-gray-500 dark:text-gray-400">
            <p><span className="font-medium">Author:</span> {viewPost.author} ({viewPost.role})</p>
            <p><span className="font-medium">Category:</span> {viewPost.category}</p>
            <p><span className="font-medium">Posted:</span> {viewPost.timestamp}</p>
            <p><span className="font-medium">Likes:</span> {viewPost.likes} · <span className="font-medium">Comments:</span> {viewPost.comments}</p>
          </div>
        </div>
      </div>}
    </div>
  )
}
