import { useState } from 'react'
import { useNavigate } from 'react-router-dom'

const fileTypes = ['All', 'PDF', 'JPG', 'PNG', 'DOCX', 'PPT']
const folders = ['My Files', 'Shared with me', 'Class files']
const typeColors = { PDF: 'text-red-500', JPG: 'text-green-500', PNG: 'text-blue-500', DOCX: 'text-purple-500', PPT: 'text-orange-500' }

export default function Files() {
  const navigate = useNavigate()
  const [files, setFiles] = useState([
    { id: 1, name: 'Math_Homework_Ch5.pdf', type: 'PDF', size: '2.4 MB', uploadedBy: 'Dr. Sharma', date: '15 Mar 2025', folder: 'Class files' },
    { id: 2, name: 'Science_Project_Guide.docx', type: 'DOCX', size: '1.1 MB', uploadedBy: 'Science Dept', date: '14 Mar 2025', folder: 'Shared with me' },
    { id: 3, name: 'School_Photo_Annual_Day.jpg', type: 'JPG', size: '4.8 MB', uploadedBy: 'Cultural Comm.', date: '12 Mar 2025', folder: 'My Files' },
    { id: 4, name: 'Exam_Schedule_March.pdf', type: 'PDF', size: '0.5 MB', uploadedBy: 'Admin', date: '10 Mar 2025', folder: 'Class files' },
    { id: 5, name: 'Presentation_Solar_System.pptx', type: 'PPT', size: '6.2 MB', uploadedBy: 'Rahul K.', date: '8 Mar 2025', folder: 'Shared with me' },
    { id: 6, name: 'Attendance_Report_Feb.png', type: 'PNG', size: '1.8 MB', uploadedBy: 'Admin', date: '5 Mar 2025', folder: 'My Files' },
  ])
  const [activeFolder, setActiveFolder] = useState('My Files')
  const [activeType, setActiveType] = useState('All')
  const [search, setSearch] = useState('')
  const [dragOver, setDragOver] = useState(false)
  const [viewFile, setViewFile] = useState(null)
  const [storage, setStorage] = useState({ used: 68, total: 100 })

  const addFile = (name, size) => {
    const ext = name.split('.').pop().toUpperCase()
    const type = ['PDF', 'DOCX', 'PPT', 'JPG', 'PNG'].includes(ext) ? ext : 'PDF'
    const sizeMB = (size / (1024 * 1024)).toFixed(1)
    setFiles([{ id: Date.now(), name, type, size: `${sizeMB} MB`, uploadedBy: 'You', date: new Date().toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' }), folder: activeFolder }, ...files])
    setStorage({ ...storage, used: Math.min(storage.used + Math.round(parseFloat(sizeMB)), storage.total) })
  }

  const handleUpload = (e) => {
    const file = e.target.files?.[0]
    if (file) addFile(file.name, file.size)
    e.target.value = ''
  }

  const handleDrop = (e) => {
    e.preventDefault(); setDragOver(false)
    const file = e.dataTransfer.files?.[0]
    if (file) addFile(file.name, file.size)
  }

  const filtered = files.filter(f => {
    const matchFolder = f.folder === activeFolder
    const matchType = activeType === 'All' || f.type === activeType
    const matchSearch = f.name.toLowerCase().includes(search.toLowerCase())
    return matchFolder && matchType && matchSearch
  })

  const storagePct = Math.round((storage.used / storage.total) * 100)

  return (
    <div className="page-container min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="p-2 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors">
            <svg className="w-5 h-5 text-gray-600 dark:text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
          </button>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Files</h1>
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 p-4 mb-6">
          <h3 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">Storage Usage</h3>
          <div className="flex items-center gap-4">
            <div className="flex-1">
              <div className="w-full h-2.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full transition-all" style={{ width: `${storagePct}%` }} />
              </div>
            </div>
            <span className="text-sm text-gray-500 dark:text-gray-400">{storage.used} MB / {storage.total} MB</span>
          </div>
        </div>

        <div
          className={`card bg-white dark:bg-gray-800 rounded-xl shadow-sm border-2 border-dashed p-6 mb-6 text-center transition-colors cursor-pointer ${dragOver ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-300 dark:border-gray-600'}`}
          onDragOver={e => { e.preventDefault(); setDragOver(true) }}
          onDragLeave={() => setDragOver(false)}
          onDrop={handleDrop}
          onClick={() => document.getElementById('file-input').click()}
        >
          <div className="text-4xl mb-2">📁</div>
          <p className="text-gray-500 dark:text-gray-400 text-sm">{dragOver ? 'Drop files here!' : 'Drag & drop files here or click to upload'}</p>
          <label className="mt-2 inline-block text-sm text-blue-600 dark:text-blue-400 hover:underline cursor-pointer">
            Browse Files
            <input id="file-input" type="file" className="hidden" onChange={handleUpload} />
          </label>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 mb-6">
          <div className="flex gap-2">
            {folders.map(f => (
              <button key={f} onClick={() => setActiveFolder(f)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${activeFolder === f ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>
                {f === 'My Files' ? '📄' : f === 'Shared with me' ? '👥' : '📚'} {f}
              </button>
            ))}
          </div>
          <input className="input-field flex-1 p-2.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 text-sm outline-none" placeholder="Search files..." value={search} onChange={e => setSearch(e.target.value)} />
        </div>

        <div className="flex flex-wrap gap-2 mb-4">
          {fileTypes.map(t => (
            <button key={t} onClick={() => setActiveType(t)} className={`px-3 py-1 rounded-full text-xs font-medium transition-colors ${activeType === t ? 'bg-blue-600 text-white' : 'bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-300 dark:hover:bg-gray-600'}`}>{t}</button>
          ))}
        </div>

        <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead>
                <tr className="border-b border-gray-200 dark:border-gray-700 text-xs text-gray-500 dark:text-gray-400 uppercase">
                  <th className="text-left p-3 font-medium">Name</th>
                  <th className="text-left p-3 font-medium">Type</th>
                  <th className="text-left p-3 font-medium">Size</th>
                  <th className="text-left p-3 font-medium hidden sm:table-cell">Uploaded By</th>
                  <th className="text-left p-3 font-medium hidden md:table-cell">Date</th>
                  <th className="text-right p-3 font-medium">Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.map(f => (
                  <tr key={f.id} className="border-b border-gray-100 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-750 transition-colors">
                    <td className="p-3 text-sm text-gray-900 dark:text-white">
                      <button onClick={() => setViewFile(f)} className="hover:underline text-left">{f.name}</button>
                    </td>
                    <td className={`p-3 text-sm font-medium ${typeColors[f.type] || ''}`}>{f.type}</td>
                    <td className="p-3 text-sm text-gray-500 dark:text-gray-400">{f.size}</td>
                    <td className="p-3 text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{f.uploadedBy}</td>
                    <td className="p-3 text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell">{f.date}</td>
                    <td className="p-3 text-right">
                      <button onClick={() => alert(`Downloading ${f.name}...`)} className="text-blue-600 dark:text-blue-400 hover:underline text-xs mr-2">⬇ Download</button>
                      <button onClick={() => { if (confirm('Delete this file?')) setFiles(files.filter(x => x.id !== f.id)) }} className="text-red-600 dark:text-red-400 hover:underline text-xs">Delete</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          {filtered.length === 0 && <div className="text-center py-8 text-gray-400">No files found.</div>}
        </div>
      </div>

      {viewFile && <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50" onClick={() => setViewFile(null)}>
        <div className="bg-white dark:bg-gray-800 rounded-xl p-6 max-w-md w-full mx-4 shadow-xl" onClick={e => e.stopPropagation()}>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-lg font-bold">{viewFile.name}</h3>
            <button onClick={() => setViewFile(null)} className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-xl leading-none">&times;</button>
          </div>
          <div className="space-y-2 text-sm">
            <p><span className="font-medium">Type:</span> <span className={typeColors[viewFile.type]}>{viewFile.type}</span></p>
            <p><span className="font-medium">Size:</span> {viewFile.size}</p>
            <p><span className="font-medium">Uploaded By:</span> {viewFile.uploadedBy}</p>
            <p><span className="font-medium">Date:</span> {viewFile.date}</p>
            <p><span className="font-medium">Folder:</span> {viewFile.folder}</p>
          </div>
        </div>
      </div>}
    </div>
  )
}
