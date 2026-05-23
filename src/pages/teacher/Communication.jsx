import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, doc, getDocs, setDoc } from "../../services/firebase";

const grades = Array.from({ length: 12 }, (_, i) => `Class ${i + 1}`);
const sections = ["A", "B", "C", "D", "E"];
const typeFilters = ["All", "Teacher", "Student", "Parent"];

export default function Communication() {
  const navigate = useNavigate();
  const [recipients, setRecipients] = useState([]);
  const [sentMessages, setSentMessages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedRecipients, setSelectedRecipients] = useState([]);
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [showHistory, setShowHistory] = useState(false);
  const [typeFilter, setTypeFilter] = useState("All");
  const [classFilter, setClassFilter] = useState("");
  const [sectionFilter, setSectionFilter] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [studentSnap, teacherSnap, sentSnap] = await Promise.all([
          getDocs(collection(db, "students")),
          getDocs(collection(db, "teachers")),
          getDocs(collection(db, "sent_messages"))
        ])
        const list = []
        studentSnap.forEach(d => {
          const s = d.data()
          list.push({ id: `s_${d.id}`, name: s.name, type: "Student", grade: s.grade || s.class || "", section: s.section || "" })
          if (s.parent || s.parentPhone) {
            list.push({ id: `p_${d.id}`, name: s.parent || s.parentPhone, type: "Parent", grade: s.grade || s.class || "", section: s.section || "" })
          }
        })
        teacherSnap.forEach(d => {
          const t = d.data()
          list.push({ id: `t_${d.id}`, name: t.name, type: "Teacher", grade: "", section: "" })
        })
        setRecipients(list)

        const sent = []
        sentSnap.forEach(d => sent.push({ id: d.id, ...d.data() }))
        setSentMessages(sent.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)))
      } catch (err) {
        console.error("Failed to load:", err)
      } finally {
        setLoading(false)
      }
    }
    load()
  }, [])

  const toggleRecipient = (id) => {
    setSelectedRecipients((prev) =>
      prev.includes(id) ? prev.filter((r) => r !== id) : [...prev, id]
    );
  };

  const handleSend = async () => {
    if (selectedRecipients.length === 0 || !subject || !message) return
    const selectedNames = selectedRecipients.map(id => recipients.find(r => r.id === id)?.name).filter(Boolean)
    try {
      const id = doc(collection(db, "sent_messages")).id
      await setDoc(doc(db, "sent_messages", id), {
        to: selectedNames,
        subject,
        message,
        createdAt: new Date().toISOString()
      })
      setSentMessages([{ id, to: selectedNames, subject, message, createdAt: new Date().toISOString() }, ...sentMessages])
      setSelectedRecipients([]);
      setSubject("");
      setMessage("");
    } catch (err) {
      console.error("Failed to send:", err)
    }
  };

  const filteredRecipients = recipients.filter(r => {
    if (typeFilter !== "All" && r.type !== typeFilter) return false
    if (classFilter && r.grade && r.grade !== classFilter) return false
    if (sectionFilter && r.section && r.section !== sectionFilter) return false
    return true
  })

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
        <button
          onClick={() => navigate(-1)}
          className="mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200"
        >
          &larr; Back
        </button>
        <div className="flex items-center justify-between mb-8">
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">Communication</h1>
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="px-4 py-2 text-sm bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
          >
            {showHistory ? "New Message" : "Sent History"}
          </button>
        </div>

        {showHistory ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
            <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Sent Messages</h2>
            {sentMessages.length === 0 ? (
              <p className="text-sm text-gray-400 dark:text-gray-500">No sent messages yet.</p>
            ) : (
              <div className="space-y-3">
                {sentMessages.map((s) => (
                  <div key={s.id} className="border-b border-gray-100 dark:border-gray-700 pb-3 last:border-0">
                    <p className="font-medium text-gray-900 dark:text-white">{s.subject}</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">To: {Array.isArray(s.to) ? s.to.join(", ") : s.to} | {s.createdAt ? new Date(s.createdAt).toLocaleDateString() : ""}</p>
                    <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">{s.message}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <div className="lg:col-span-2 space-y-6">
              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Select Recipients</h2>

                <div className="flex flex-wrap gap-2 mb-4">
                  {typeFilters.map(t => (
                    <button key={t} onClick={() => setTypeFilter(t)}
                      className={`px-3 py-1 text-xs rounded-full transition-colors ${typeFilter === t ? "bg-indigo-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"}`}>
                      {t}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-2 mb-4">
                  <select value={classFilter} onChange={e => setClassFilter(e.target.value)} className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">All Classes</option>
                    {grades.map(g => <option key={g} value={g}>{g}</option>)}
                  </select>
                  <select value={sectionFilter} onChange={e => setSectionFilter(e.target.value)} className="px-2 py-1 text-xs border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white">
                    <option value="">All Sections</option>
                    {sections.map(s => <option key={s} value={s}>Section {s}</option>)}
                  </select>
                  <span className="text-xs text-gray-400 self-center ml-2">{filteredRecipients.length} recipients</span>
                </div>

                <div className="flex flex-wrap gap-2 max-h-48 overflow-y-auto">
                  {filteredRecipients.map((r) => (
                    <button
                      key={r.id}
                      onClick={() => toggleRecipient(r.id)}
                      className={`px-3 py-1.5 text-sm rounded-lg transition-colors ${
                        selectedRecipients.includes(r.id)
                          ? "bg-blue-600 text-white"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600"
                      }`}
                    >
                      {r.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6">
                <div className="mb-4">
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Subject</label>
                  <input
                    type="text"
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500"
                  />
                </div>
                <div className="mb-4">
                  <label className="block text-sm text-gray-500 dark:text-gray-400 mb-1">Message</label>
                  <textarea
                    rows={6}
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-blue-500 resize-none"
                  />
                </div>
                <button
                  onClick={handleSend}
                  disabled={selectedRecipients.length === 0 || !subject || !message}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Send Message
                </button>
              </div>
            </div>

            <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 lg:self-start">
              <h3 className="font-medium text-gray-900 dark:text-white mb-2">Selected</h3>
              {selectedRecipients.length === 0 ? (
                <p className="text-sm text-gray-400 dark:text-gray-500">No recipients selected</p>
              ) : (
                <ul className="text-sm text-gray-600 dark:text-gray-400 space-y-1">
                  {selectedRecipients.map((id) => (
                    <li key={id}>{recipients.find((r) => r.id === id)?.name}</li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
