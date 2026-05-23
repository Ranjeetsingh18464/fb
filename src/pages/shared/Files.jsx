import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, doc, getDocs, setDoc, deleteDoc } from "../../services/firebase";

const folders = ["Documents", "Images", "Videos", "Others"];

export default function Files() {
  const navigate = useNavigate();
  const [activeFolder, setActiveFolder] = useState("Documents");
  const [viewMode, setViewMode] = useState("grid");
  const [files, setFiles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [dragOver, setDragOver] = useState(false);

  useEffect(() => {
    const load = async () => {
      try {
        const snap = await getDocs(collection(db, "files"))
        const list = []
        snap.forEach(d => list.push({ id: d.id, ...d.data() }))
        setFiles(list)
      } catch (err) {
        console.error("Failed to load files:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const getFilesByFolder = (folder) => files.filter(f => f.folder === folder)

  const deleteFile = async (id) => {
    if (!window.confirm("Delete this file?")) return
    try {
      await deleteDoc(doc(db, "files", id))
      setFiles(files.filter(f => f.id !== id))
    } catch (err) {
      console.error("Failed to delete file:", err)
    }
  };

  const handleUpload = async (fileList) => {
    const newFiles = []
    for (const file of fileList) {
      const reader = new FileReader()
      const dataUrl = await new Promise((resolve) => {
        reader.onload = (e) => resolve(e.target.result)
        reader.readAsDataURL(file)
      })
      let folder = "Others"
      if (file.type.startsWith("image/")) folder = "Images"
      else if (file.type.startsWith("video/")) folder = "Videos"
      else if (file.type.includes("pdf") || file.type.includes("document") || file.type.includes("text")) folder = "Documents"

      const id = doc(collection(db, "files")).id
      const entry = {
        name: file.name,
        size: (file.size / (1024 * 1024)).toFixed(1) + " MB",
        date: new Date().toISOString().split("T")[0],
        folder,
        dataUrl,
        fileType: file.type
      }
      await setDoc(doc(db, "files", id), entry)
      newFiles.push({ id, ...entry })
    }
    setFiles([...files, ...newFiles])
  }

  const handleFileInput = (e) => {
    if (e.target.files.length > 0) {
      handleUpload(e.target.files)
      e.target.value = ""
    }
  }

  const handleDrop = (e) => {
    e.preventDefault();
    setDragOver(false);
    if (e.dataTransfer.files.length > 0) {
      handleUpload(e.dataTransfer.files)
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Files</h1>
        </div>
        <div className="flex gap-2 mb-6 flex-wrap">
          {folders.map(f => (
            <button key={f} onClick={() => setActiveFolder(f)} className={`px-4 py-2 text-sm rounded ${activeFolder === f ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              {f} ({getFilesByFolder(f).length})
            </button>
          ))}
          <div className="flex-1"></div>
          <button onClick={() => setViewMode(viewMode === "grid" ? "list" : "grid")} className="px-3 py-2 text-sm bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 rounded hover:bg-gray-100 dark:hover:bg-gray-700">
            {viewMode === "grid" ? "📋 List" : "🔲 Grid"}
          </button>
        </div>
        <div className={`border-2 border-dashed rounded-lg p-8 text-center mb-6 ${dragOver ? "border-blue-500 bg-blue-50 dark:bg-blue-900/20" : "border-gray-300 dark:border-gray-600"}`} onDragOver={e => { e.preventDefault(); setDragOver(true); }} onDragLeave={() => setDragOver(false)} onDrop={handleDrop}>
          <p className="text-gray-500 dark:text-gray-400 mb-2">Drag and drop files here</p>
          <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 text-sm inline-block">
            Browse Files
            <input type="file" multiple className="hidden" onChange={handleFileInput} />
          </label>
        </div>

        {viewMode === "grid" ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {getFilesByFolder(activeFolder).map(f => (
              <div key={f.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 text-center">
                {f.folder === "Images" && f.dataUrl ? (
                  <img src={f.dataUrl} alt={f.name} className="h-20 w-full object-cover rounded mb-2" />
                ) : (
                  <div className="text-4xl mb-2">📄</div>
                )}
                <p className="font-semibold text-sm text-gray-800 dark:text-white truncate">{f.name}</p>
                <p className="text-xs text-gray-400">{f.size}</p>
                <p className="text-xs text-gray-400">{f.date}</p>
                <button onClick={() => deleteFile(f.id)} className="mt-2 text-xs text-red-500 hover:text-red-700">Delete</button>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow overflow-hidden">
            <table className="w-full text-left">
              <thead className="bg-gray-100 dark:bg-gray-700">
                <tr>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Name</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Size</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Date</th>
                  <th className="p-3 text-sm font-semibold text-gray-600 dark:text-gray-300">Action</th>
                </tr>
              </thead>
              <tbody className="divide-y dark:divide-gray-700">
                {getFilesByFolder(activeFolder).map(f => (
                  <tr key={f.id} className="hover:bg-gray-50 dark:hover:bg-gray-700">
                    <td className="p-3 flex items-center gap-2 text-gray-800 dark:text-white">
                      {f.folder === "Images" && f.dataUrl ? <img src={f.dataUrl} alt={f.name} className="h-8 w-8 object-cover rounded" /> : <span>📄</span>}
                      {f.name}
                    </td>
                    <td className="p-3 text-gray-500">{f.size}</td>
                    <td className="p-3 text-gray-500">{f.date}</td>
                    <td className="p-3"><button onClick={() => deleteFile(f.id)} className="text-sm text-red-500 hover:text-red-700">Delete</button></td>
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
