import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const subjects = ['All', 'Math', 'Physics', 'Chemistry', 'Biology', 'Geography', 'History', 'English']

export default function Doubts() {
  const navigate = useNavigate()
  const [questions, setQuestions] = useState([
    { id: 1, title: 'How to solve quadratic equations?', subject: 'Math', askedBy: 'Rahul K.', answers: 3, time: '2h ago', role: 'Student' },
    { id: 2, title: "Explain Newton's third law with examples", subject: 'Physics', askedBy: 'Anjali M.', answers: 2, time: '5h ago', role: 'Student' },
    { id: 3, title: 'What is the capital of France?', subject: 'Geography', askedBy: 'Vikram J.', answers: 1, time: '1d ago', role: 'Student' },
    { id: 4, title: 'Difference between mitosis and meiosis', subject: 'Biology', askedBy: 'Priya S.', answers: 4, time: '3h ago', role: 'Student' },
    { id: 5, title: 'Explain redox reactions', subject: 'Chemistry', askedBy: 'Arjun T.', answers: 2, time: '6h ago', role: 'Student' },
  ])
  const [answersData, setAnswersData] = useState({
    1: [
      { author: 'Dr. Sharma', role: 'Teacher', content: 'Use the formula: x = (-b ± √(b² - 4ac)) / 2a' },
      { author: 'Meera D.', role: 'Student', content: 'Try factoring method first, it is easier for simple equations.' },
    ],
    3: [{ author: 'Dr. Sharma', role: 'Teacher', content: 'Paris has been the capital of France since the 10th century.' }],
  })
  const [activeSubject, setActiveSubject] = useState('All')
  const [search, setSearch] = useState('')
  const [sortBy, setSortBy] = useState('recent')
  const [expanded, setExpanded] = useState(null)
  const [showAskForm, setShowAskForm] = useState(false)
  const [askTitle, setAskTitle] = useState('')
  const [askSubject, setAskSubject] = useState('')
  const [askDesc, setAskDesc] = useState('')
  const [replyText, setReplyText] = useState({})
  const [editId, setEditId] = useState(null)
  const [editTitle, setEditTitle] = useState('')

  const filtered = questions
    .filter(q => {
      const matchSubj = activeSubject === 'All' || q.subject === activeSubject
      const matchSearch = q.title.toLowerCase().includes(search.toLowerCase()) || q.subject.toLowerCase().includes(search.toLowerCase())
      return matchSubj && matchSearch
    })
    .sort((a, b) => sortBy === 'recent' ? (a.time > b.time ? -1 : 1) : b.answers - a.answers)

  const handleAsk = () => {
    if (!askTitle.trim() || !askSubject.trim()) return
    const newQ = { id: Date.now(), title: askTitle, subject: askSubject, askedBy: 'You', answers: 0, time: 'Just now', role: 'Student' }
    setQuestions([newQ, ...questions])
    setAskTitle(''); setAskSubject(''); setAskDesc(''); setShowAskForm(false)
  }

  const addReply = (qId) => {
    const text = replyText[qId]
    if (!text || !text.trim()) return
    const newReply = { author: 'You', role: 'Student', content: text }
    setAnswersData({ ...answersData, [qId]: [...(answersData[qId] || []), newReply] })
    setQuestions(questions.map(q => q.id === qId ? { ...q, answers: q.answers + 1 } : q))
    setReplyText({ ...replyText, [qId]: '' })
  }

  const deleteQuestion = (id) => {
    if (confirm('Delete this question and all its answers?')) {
      setQuestions(questions.filter(q => q.id !== id))
      const { [id]: _, ...rest } = answersData
      setAnswersData(rest)
    }
  }

  return (
    <div className="page-container min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Doubts & Discussion</h1>
        </div>

        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => setShowAskForm(!showAskForm)} className="btn-primary px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg font-medium transition-colors">+ Ask a Question</button>
          {showAskForm && <button onClick={() => setShowAskForm(false)} className="btn-outline">Cancel</button>}
        </div>

        {showAskForm && (
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-3">Ask Your Question</h3>
            <input className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2 outline-none" placeholder="Question title..." value={askTitle} onChange={e => setAskTitle(e.target.value)} />
            <select className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-2 outline-none" value={askSubject} onChange={e => setAskSubject(e.target.value)}>
              <option value="">Select subject</option>
              {subjects.filter(s => s !== 'All').map(s => <option key={s} value={s}>{s}</option>)}
            </select>
            <textarea className="input-field w-full p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white mb-3 resize-none outline-none" rows="3" placeholder="Describe your doubt in detail..." value={askDesc} onChange={e => setAskDesc(e.target.value)} />
            <div className="flex items-center justify-between">
              <button onClick={() => alert('File attachment coming soon!')} className="text-sm text-gray-500 dark:text-gray-400 hover:text-blue-600 dark:hover:text-blue-400">📎 Attach file</button>
              <button onClick={handleAsk} className="btn-primary px-4 py-1.5 bg-blue-600 hover:bg-blue-700 text-white rounded-lg text-sm font-medium">Submit</button>
            </div>
          </div>
        )}

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <input className="input-field flex-1 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 outline-none" placeholder="Search questions..." value={search} onChange={e => setSearch(e.target.value)} />
          <select className="input-field p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white outline-none" value={sortBy} onChange={e => setSortBy(e.target.value)}>
            <option value="recent">Most Recent</option>
            <option value="popular">Most Answered</option>
          </select>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {subjects.map(sub => (
            <button key={sub} onClick={() => setActiveSubject(sub)} className={`px-3 py-1.5 rounded-full text-xs font-medium transition-colors ${activeSubject === sub ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{sub}</button>
          ))}
        </div>

        <div className="space-y-3">
          {filtered.map(q => (
            <div key={q.id} className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
              <div className="p-4">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      {editId === q.id ? (
                        <div className="flex gap-2 flex-1">
                          <input value={editTitle} onChange={e => setEditTitle(e.target.value)} className="input-field text-sm flex-1" />
                          <button onClick={() => { setQuestions(questions.map(x => x.id === q.id ? { ...x, title: editTitle } : x)); setEditId(null) }} className="text-green-600 text-xs">Save</button>
                          <button onClick={() => setEditId(null)} className="text-gray-500 text-xs">Cancel</button>
                        </div>
                      ) : (
                        <>
                          <h3 className="font-semibold text-gray-900 dark:text-white">{q.title}</h3>
                          <span className="text-xs bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 px-2 py-0.5 rounded-full">{q.subject}</span>
                        </>
                      )}
                    </div>
                    <div className="flex items-center gap-3 mt-1 text-xs text-gray-500 dark:text-gray-400">
                      <span>👤 {q.askedBy}</span>
                      <span>💬 {q.answers} answers</span>
                      <span>🕐 {q.time}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => { setEditId(q.id); setEditTitle(q.title) }} className="text-gray-400 hover:text-blue-500 text-xs">✏️</button>
                    <button onClick={() => deleteQuestion(q.id)} className="text-gray-400 hover:text-red-500 text-xs">🗑️</button>
                    <button onClick={() => setExpanded(expanded === q.id ? null : q.id)} className={`text-sm transition-transform ${expanded === q.id ? 'rotate-180' : ''}`}>▾</button>
                  </div>
                </div>
              </div>
              {expanded === q.id && (
                <div className="border-t border-gray-100 dark:border-gray-700 p-4">
                  {(answersData[q.id] || []).map((ans, i) => (
                    <div key={i} className="mb-3 last:mb-0 p-3 rounded-lg bg-gray-50 dark:bg-gray-700">
                      <div className="flex items-center gap-2 mb-1">
                        <span className="text-sm font-medium text-gray-900 dark:text-white">{ans.author}</span>
                        {ans.role === 'Teacher' && <span className="text-xs bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 px-2 py-0.5 rounded-full">Teacher</span>}
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-400">{ans.content}</p>
                    </div>
                  ))}
                  {(answersData[q.id] || []).length === 0 && <p className="text-sm text-gray-400 mb-2">No answers yet.</p>}
                  <div className="flex gap-2">
                    <input value={replyText[q.id] || ''} onChange={e => setReplyText({ ...replyText, [q.id]: e.target.value })} className="input-field text-sm flex-1" placeholder="Write a reply..." />
                    <button onClick={() => addReply(q.id)} className="btn-primary text-sm px-3">Reply</button>
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>

        {filtered.length === 0 && <div className="text-center py-12 text-gray-400">No questions found.</div>}
      </div>
    </div>
  )
}
