import { useState, useEffect } from "react"
import { useNavigate } from "react-router-dom"
import { db, collection, doc, getDoc, getDocs, setDoc, updateDoc, deleteDoc, query, where } from "../../services/firebase"

const normalizeGrade = (val) => {
  if (!val) return ""
  const m = String(val).match(/\d+/)
  return m ? m[0] : val.toString().trim()
}

const grades = ['Class 1', 'Class 2', 'Class 3', 'Class 4', 'Class 5', 'Class 6', 'Class 7', 'Class 8', 'Class 9', 'Class 10', 'Class 11', 'Class 12']
const sections = ['A', 'B', 'C', 'D', 'E']

export default function Marks() {
  const navigate = useNavigate()
  const [exams, setExams] = useState([])
  const [marks, setMarks] = useState([])
  const [students, setStudents] = useState([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('exams')

  const [showExamForm, setShowExamForm] = useState(false)
  const [examForm, setExamForm] = useState({ name: '', subject: '', grade: 'Class 1', section: 'A', date: new Date().toISOString().split('T')[0], maxMarks: 100 })

  const [selectedExam, setSelectedExam] = useState(null)
  const [markEntries, setMarkEntries] = useState({})
  const [proformaStudent, setProformaStudent] = useState('')
  const [proformaDirty, setProformaDirty] = useState(false)

  const defaultCols = ['Theory', 'Practical', 'Internal']
  const defaultMaxPerCol = 50

  const [proformaData, setProformaData] = useState(null)
  const [savedLayout, setSavedLayout] = useState(null)
  const [teacherClass, setTeacherClass] = useState(null)
  const [records, setRecords] = useState([])
  const [recordMsg, setRecordMsg] = useState('')

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [examSnap, studentSnap, markSnap, layoutSnap, classSnap, teacherSnap] = await Promise.all([
          getDocs(collection(db, 'exams')),
          getDocs(collection(db, 'students')),
          getDocs(collection(db, 'marks')),
          getDoc(doc(db, 'settings', 'proforma_layout')),
          getDocs(collection(db, 'classes')),
          getDocs(collection(db, 'teachers'))
        ])
        const e = []; examSnap.forEach(doc => e.push({ id: doc.id, ...doc.data() }))
        const s = []; studentSnap.forEach(doc => s.push({ id: doc.id, ...doc.data() }))
        const m = []; markSnap.forEach(doc => m.push({ id: doc.id, ...doc.data() }))
        setExams(e); setStudents(s); setMarks(m)
        if (layoutSnap.exists()) {
          setSavedLayout(layoutSnap.data())
        }

        const cls = []
        classSnap.forEach(d => cls.push({ id: d.id, ...d.data() }))
        const teachersList = []
        teacherSnap.forEach(d => teachersList.push({ id: d.id, ...d.data() }))
        const teacher = teachersList.find(t => t.name?.toLowerCase() === "mini" || t.teacherId?.toLowerCase() === "mini" || t.id?.toLowerCase() === "mini")
        let matched = null
        if (teacher) matched = cls.find(c => c.teacher === teacher.name)
        if (!matched) matched = cls.find(c => normalizeGrade(c.name) === "1" && c.section === "A")
        if (!matched) matched = cls.find(c => normalizeGrade(c.name) === "1")
        if (!matched) matched = cls[0] || null
        setTeacherClass(matched)

        const recordSnap = await getDocs(collection(db, 'records'))
        const r = []
        recordSnap.forEach(d => r.push({ id: d.id, ...d.data() }))
        setRecords(r)
      } catch (err) {
        console.error('Failed to load data:', err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
  }, [])

  const createExam = async () => {
    if (!examForm.name || !examForm.subject) return
    try {
      const id = doc(collection(db, 'exams')).id
      await setDoc(doc(db, 'exams', id), { ...examForm, createdAt: new Date().toISOString() })
      setExams([...exams, { id, ...examForm }])
      setShowExamForm(false)
      setExamForm({ name: '', subject: '', grade: 'Class 1', section: 'A', date: new Date().toISOString().split('T')[0], maxMarks: 100 })
    } catch (err) {
      console.error('Failed to create exam:', err)
    }
  }

  const deleteExam = async (id) => {
    if (!window.confirm('Delete this exam?')) return
    try {
      await deleteDoc(doc(db, 'exams', id))
      setExams(exams.filter(e => e.id !== id))
    } catch (err) {
      console.error('Failed to delete exam:', err)
    }
  }

  const openMarksheet = (exam) => {
    setSelectedExam(exam)
    const entries = {}
    marks.filter(m => m.examId === exam.id).forEach(m => { entries[m.studentId] = m.score })
    setMarkEntries(entries)
    setTab('marksheet')
  }

  const saveMarks = async () => {
    if (!selectedExam) return
    if (!window.confirm('Save marks for this exam?')) return
    try {
      for (const studentId of Object.keys(markEntries)) {
        const score = Number(markEntries[studentId])
        if (isNaN(score)) continue
        const existing = marks.find(m => m.examId === selectedExam.id && m.studentId === studentId)
        if (existing) {
          await updateDoc(doc(db, 'marks', existing.id), { score })
        } else {
          const id = doc(collection(db, 'marks')).id
          await setDoc(doc(db, 'marks', id), { examId: selectedExam.id, studentId, score })
          marks.push({ id, examId: selectedExam.id, studentId, score })
        }
      }
      setSelectedExam(null)
      setMarkEntries({})
      setTab('exams')
    } catch (err) {
      console.error('Failed to save marks:', err)
    }
  }

  const getGrade = (pct) => {
    if (pct >= 90) return 'A+'
    if (pct >= 80) return 'A'
    if (pct >= 70) return 'B+'
    if (pct >= 60) return 'B'
    if (pct >= 50) return 'C'
    if (pct >= 40) return 'D'
    return 'F'
  }

  const initProforma = () => {
    const student = students.find(s => s.id === proformaStudent)
    const layout = savedLayout
    const p = {
      studentId: proformaStudent,
      studentName: student ? student.name : '',
      rollNo: '',
      classSection: student ? `${student.grade || ''} - ${student.section || ''}` : '',
      examination: layout ? layout.examination : 'Annual Examination',
      academicYear: layout ? layout.academicYear : '2024 - 2025',
      dob: '',
      cols: layout ? [...layout.cols] : [...defaultCols],
      rows: layout ? layout.rows.map(r => ({ ...r, marks: {} })) : [
        { subject: 'Mathematics', marks: {} },
        { subject: 'Science', marks: {} },
        { subject: 'English', marks: {} },
        { subject: 'Social Studies', marks: {} },
        { subject: 'Hindi', marks: {} }
      ]
    }
    setProformaData(p)
    setProformaDirty(false)
  }

  const updateProformaRow = (idx, field, value) => {
    if (!proformaData) return
    const rows = [...proformaData.rows]
    if (field === 'subject') {
      rows[idx] = { ...rows[idx], subject: value }
    } else {
      rows[idx] = { ...rows[idx], marks: { ...rows[idx].marks, [field]: value } }
    }
    setProformaData({ ...proformaData, rows })
    setProformaDirty(true)
  }

  const addProformaRow = () => {
    if (!proformaData) return
    const marks = {}
    proformaData.cols.forEach(c => { marks[c] = '' })
    setProformaData({ ...proformaData, rows: [...proformaData.rows, { subject: '', marks }] })
    setProformaDirty(true)
  }

  const deleteProformaRow = (idx) => {
    if (!proformaData || proformaData.rows.length <= 1) return
    const rows = proformaData.rows.filter((_, i) => i !== idx)
    setProformaData({ ...proformaData, rows })
    setProformaDirty(true)
  }

  const addProformaColumn = () => {
    if (!proformaData) return
    const name = prompt('Column name:')
    if (!name) return
    const cols = [...proformaData.cols, name]
    const rows = proformaData.rows.map(r => ({ ...r, marks: { ...r.marks, [name]: '' } }))
    setProformaData({ ...proformaData, cols, rows })
    setProformaDirty(true)
  }

  const deleteProformaColumn = () => {
    if (!proformaData || proformaData.cols.length <= 1) return
    const last = proformaData.cols[proformaData.cols.length - 1]
    const cols = proformaData.cols.slice(0, -1)
    const rows = proformaData.rows.map(r => {
      const m = { ...r.marks }
      delete m[last]
      return { ...r, marks: m }
    })
    setProformaData({ ...proformaData, cols, rows })
    setProformaDirty(true)
  }

  const resetProforma = async () => {
    if (!window.confirm('Reset to default?')) return
    try {
      await deleteDoc(doc(db, 'settings', 'proforma_layout'))
      setSavedLayout(null)
    } catch (err) {
      console.error('Failed to reset proforma:', err)
    }
    if (proformaStudent) initProforma()
  }

  const saveProforma = async () => {
    if (!proformaData) return
    if (!window.confirm('Save proforma layout?')) return
    try {
      await setDoc(doc(db, 'settings', 'proforma_layout'), {
        cols: proformaData.cols,
        rows: proformaData.rows.map(r => ({ subject: r.subject })),
        examination: proformaData.examination,
        academicYear: proformaData.academicYear,
        updatedAt: new Date().toISOString()
      })
      setSavedLayout({
        cols: [...proformaData.cols],
        rows: proformaData.rows.map(r => ({ subject: r.subject })),
        examination: proformaData.examination,
        academicYear: proformaData.academicYear
      })
      setProformaDirty(false)
    } catch (err) {
      console.error('Failed to save proforma layout:', err)
    }
  }

  const saveRecord = async () => {
    if (!proformaData) return
    if (!window.confirm('Save this marksheet as a permanent record?')) return
    try {
      const { cols, rows } = proformaData
      const colSums = cols.map(() => 0)
      let grandTotal = 0, grandMax = 0
      rows.forEach(row => {
        let rt = 0
        cols.forEach((c, ci) => {
          const v = Number(row.marks[c]) || 0
          rt += v
          colSums[ci] += v
        })
        grandTotal += rt
        grandMax += cols.length * defaultMaxPerCol
      })
      const overallPct = grandMax > 0 ? (grandTotal / grandMax) * 100 : 0
      const id = doc(collection(db, 'records')).id
      const record = {
        ...proformaData,
        totalObtained: grandTotal,
        totalMax: grandMax,
        percentage: parseFloat(overallPct.toFixed(2)),
        grade: getGrade(overallPct),
        result: overallPct >= 33 ? 'PASS' : 'FAIL',
        teacherGrade: teacherClass ? teacherClass.name : '',
        teacherSection: teacherClass ? teacherClass.section : '',
        createdAt: new Date().toISOString()
      }
      await setDoc(doc(db, 'records', id), record)
      setRecords([...records, { id, ...record }])
      setRecordMsg('Marksheet saved to records!')
      setTimeout(() => setRecordMsg(''), 3000)
    } catch (err) {
      console.error('Failed to save record:', err)
    }
  }

  const deleteRecord = async (id) => {
    if (!window.confirm('Delete this record?')) return
    try {
      await deleteDoc(doc(db, 'records', id))
      setRecords(records.filter(r => r.id !== id))
    } catch (err) {
      console.error('Failed to delete record:', err)
    }
  }

  const viewRecord = (rec) => {
    setProformaStudent(rec.studentId || '')
    setProformaData({
      studentId: rec.studentId || '',
      studentName: rec.studentName || '',
      rollNo: rec.rollNo || '',
      classSection: rec.classSection || `${rec.teacherGrade || ''} - ${rec.teacherSection || ''}`,
      examination: rec.examination || 'Annual Examination',
      academicYear: rec.academicYear || '2024 - 2025',
      dob: rec.dob || '',
      cols: rec.cols ? [...rec.cols] : [...defaultCols],
      rows: rec.rows ? rec.rows.map(r => ({ subject: r.subject, marks: { ...r.marks } })) : []
    })
    setTab('report')
  }

  const calcRow = (row, cols) => {
    let total = 0
    cols.forEach(c => { total += Number(row.marks[c]) || 0 })
    const max = cols.length * defaultMaxPerCol
    const pct = max > 0 ? (total / max) * 100 : 0
    return { total, max, pct, grade: pct > 0 ? getGrade(pct) : '—' }
  }

  const examMarks = selectedExam ? marks.filter(m => m.examId === selectedExam.id) : []

  const teacherGrade = teacherClass ? normalizeGrade(teacherClass.name) : ""
  const teacherSection = teacherClass ? teacherClass.section : ""
  const filteredStudents = students.filter(s => {
    const matchGrade = !teacherGrade || normalizeGrade(s.grade || s.class) === teacherGrade
    const matchSection = !teacherSection || s.section === teacherSection
    return matchGrade && matchSection
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
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-sm text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-200 transition">&larr; Back</button>
          <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-white">&#128221; Exams &amp; Marks Management</h1>
        </div>

        <div className="flex gap-2 mb-6 border-b border-gray-200 dark:border-gray-700">
          {['exams', 'marksheet', 'report'].map(t => (
            <button key={t} onClick={() => setTab(t)}
              className={`px-4 py-2 text-sm font-medium border-b-2 transition -mb-px ${
                tab === t ? 'border-indigo-600 text-indigo-600 dark:text-indigo-400 dark:border-indigo-400' : 'border-transparent text-gray-500 dark:text-gray-400 hover:text-gray-700 dark:hover:text-gray-300'
              }`}
            >
              {t === 'exams' ? 'Exams' : t === 'marksheet' ? '&#128203; Marksheet' : 'Generate Report Card'}
            </button>
          ))}
        </div>

        {tab === 'exams' && (
          <>
            <div className="flex justify-end mb-4">
              <button onClick={() => setShowExamForm(true)} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition font-medium">+ Add Exam</button>
            </div>

            {showExamForm && (
              <div className="mb-6 rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Create Exam</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Exam Name</label>
                    <input type="text" placeholder="e.g. Midterm 2026" value={examForm.name} onChange={e => setExamForm({ ...examForm, name: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Subject</label>
                    <input type="text" placeholder="e.g. Physics" value={examForm.subject} onChange={e => setExamForm({ ...examForm, subject: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Class</label>
                    <select value={examForm.grade} onChange={e => setExamForm({ ...examForm, grade: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                      {grades.map(g => <option key={g}>{g}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Section</label>
                    <select value={examForm.section} onChange={e => setExamForm({ ...examForm, section: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                      {sections.map(s => <option key={s}>{s}</option>)}
                    </select>
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Date</label>
                    <input type="date" value={examForm.date} onChange={e => setExamForm({ ...examForm, date: e.target.value })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Max Marks</label>
                    <input type="number" value={examForm.maxMarks} onChange={e => setExamForm({ ...examForm, maxMarks: Number(e.target.value) })} className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  </div>
                </div>
                <div className="flex gap-2">
                  <button onClick={createExam} disabled={!examForm.name || !examForm.subject} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition disabled:opacity-50">Create Exam</button>
                  <button onClick={() => setShowExamForm(false)} className="px-4 py-2 bg-gray-200 dark:bg-gray-600 text-gray-700 dark:text-gray-200 rounded-lg text-sm hover:bg-gray-300 dark:hover:bg-gray-500 transition">Cancel</button>
                </div>
              </div>
            )}

            {exams.length === 0 ? (
              <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-8 text-center">
                <p className="text-gray-500 dark:text-gray-400 text-sm">No exams created yet</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {exams.map(exam => (
                  <div key={exam.id} className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
                    <div className="flex items-start justify-between mb-2">
                      <h3 className="font-semibold text-gray-900 dark:text-white">{exam.name}</h3>
                      <button onClick={() => deleteExam(exam.id)} className="text-red-500 hover:text-red-700 text-xs">&#10005;</button>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{exam.subject} &middot; {exam.grade}-{exam.section}</p>
                    <p className="text-xs text-gray-500 dark:text-gray-400">{exam.date} &middot; Max: {exam.maxMarks}</p>
                    <div className="mt-3">
                      <span className="text-xs text-gray-500 dark:text-gray-400">{marks.filter(m => m.examId === exam.id).length} marks recorded</span>
                    </div>
                    <button onClick={() => openMarksheet(exam)} className="mt-3 w-full px-3 py-1.5 bg-indigo-100 dark:bg-indigo-900 text-indigo-700 dark:text-indigo-300 rounded-lg text-xs hover:bg-indigo-200 dark:hover:bg-indigo-800 transition font-medium">&#128203; Open Marksheet</button>
                  </div>
                ))}
              </div>
            )}
          </>
        )}

        {tab === 'marksheet' && selectedExam && (
          <>
            <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{selectedExam.name}</h2>
              <p className="text-sm text-gray-500 dark:text-gray-400">{selectedExam.subject} &middot; {selectedExam.grade}-{selectedExam.section} &middot; {selectedExam.date} &middot; Max: {selectedExam.maxMarks}</p>
            </div>

            {filteredStudents.length === 0 ? (
              <p className="text-gray-500 dark:text-gray-400 text-sm">No students found.</p>
            ) : (
              <>
              <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 mb-4">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                      <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Student</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">Score / {selectedExam.maxMarks}</th>
                      <th className="text-left px-4 py-3 font-medium text-gray-500 dark:text-gray-400">%</th>
                    </tr>
                  </thead>
                  <tbody>
                    {filteredStudents.map(s => {
                      const score = markEntries[s.id]
                      const pct = score ? Math.round((Number(score) / selectedExam.maxMarks) * 100) : 0
                      return (
                        <tr key={s.id} className="border-b border-gray-100 dark:border-gray-700 last:border-0">
                          <td className="px-4 py-3 text-gray-900 dark:text-white font-medium">{s.name}</td>
                          <td className="px-4 py-3">
                            <input type="number" min="0" max={selectedExam.maxMarks} value={score ?? ''} onChange={e => setMarkEntries({ ...markEntries, [s.id]: e.target.value })}
                              className="w-24 px-3 py-1.5 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                          </td>
                          <td className="px-4 py-3 text-gray-500 dark:text-gray-400">{score ? `${pct}%` : '—'}</td>
                        </tr>
                      )
                    })}
                  </tbody>
                </table>
              </div>
              <button onClick={saveMarks} className="px-6 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition font-medium">Save Marks</button>
              </>
            )}
          </>
        )}

        {tab === 'report' && (
          <div className="rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 p-5">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white">&#128203; MARKSHEET PROFORMA</h2>
              <div className="flex gap-2">
                <button onClick={saveProforma} disabled={!proformaData} className="px-3 py-1.5 bg-indigo-600 text-white rounded-lg text-xs hover:bg-indigo-700 transition disabled:opacity-50">&#128190; Save Layout</button>
                <button onClick={saveRecord} disabled={!proformaData} className="px-3 py-1.5 bg-green-600 text-white rounded-lg text-xs hover:bg-green-700 transition disabled:opacity-50">&#128203; Save to Records</button>
                <button onClick={() => window.print()} className="px-3 py-1.5 bg-gray-600 text-white rounded-lg text-xs hover:bg-gray-700 transition">&#128424; Print / Save PDF</button>
                {proformaData && <button onClick={() => { setProformaData(null); setProformaStudent('') }} className="px-3 py-1.5 bg-red-100 dark:bg-red-900 text-red-700 dark:text-red-300 rounded-lg text-xs hover:bg-red-200 dark:hover:bg-red-800 transition">&#10005;</button>}
              </div>
            </div>

            <div className="flex flex-wrap items-center gap-2 mb-4 pb-4 border-b border-gray-200 dark:border-gray-700">
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400">ROWS:</span>
              <button onClick={addProformaRow} className="px-2 py-1 bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300 rounded text-xs hover:bg-green-200 dark:hover:bg-green-800 transition">+ Add Subject</button>
              <span className="text-xs font-medium text-gray-500 dark:text-gray-400 ml-3">COLUMNS:</span>
              <button onClick={addProformaColumn} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition">+ Add Column</button>
              <button onClick={deleteProformaColumn} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300 rounded text-xs hover:bg-blue-200 dark:hover:bg-blue-800 transition">- Delete Column</button>
              <button onClick={resetProforma} className="px-2 py-1 bg-yellow-100 dark:bg-yellow-900 text-yellow-700 dark:text-yellow-300 rounded text-xs hover:bg-yellow-200 dark:hover:bg-yellow-800 transition ml-3">&#8635; Reset Default</button>
            </div>

            <div className="mb-4">
              <label className="block text-xs font-medium text-gray-500 dark:text-gray-400 mb-1">Select Student</label>
              {teacherClass && (
                <div className="flex items-center gap-2 mb-2 px-3 py-1.5 rounded-lg bg-indigo-50 dark:bg-indigo-900/20 text-indigo-700 dark:text-indigo-300 text-xs w-fit">
                  <svg className="w-3.5 h-3.5" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21V5a2 2 0 00-2-2H7a2 2 0 00-2 2v16m14 0h2m-2 0h-5m-9 0H3m2 0h5M9 7h1m-1 4h1m4-4h1m-1 4h1m-5 10v-5a1 1 0 011-1h2a1 1 0 011 1v5m-4 0h4" /></svg>
                  Class {teacherClass.name} - Section {teacherClass.section}
                </div>
              )}
              <select value={proformaStudent} onChange={e => { setProformaStudent(e.target.value); setProformaData(null) }} className="w-full max-w-xs px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                <option value="">-- Select Student --</option>
                {filteredStudents.map(s => <option key={s.id} value={s.id}>{s.name} ({s.studentId || s.id})</option>)}
              </select>
            </div>

            {proformaStudent && !proformaData && (
              <button onClick={initProforma} className="px-4 py-2 bg-indigo-600 text-white rounded-lg text-sm hover:bg-indigo-700 transition font-medium">Generate Proforma</button>
            )}

            {proformaData && (() => {
              const { cols, rows } = proformaData
              const colSums = cols.map(() => 0)
              let grandTotal = 0, grandMax = 0

              rows.forEach(row => {
                let rt = 0
                cols.forEach((c, ci) => {
                  const v = Number(row.marks[c]) || 0
                  rt += v
                  colSums[ci] += v
                })
                const rm = cols.length * defaultMaxPerCol
                grandTotal += rt
                grandMax += rm
              })
              const overallPct = grandMax > 0 ? (grandTotal / grandMax) * 100 : 0
              const pass = overallPct >= 33

              return (
                <div className="border-2 border-gray-300 dark:border-gray-600 rounded-lg p-4 print:p-2 print:border-0">
                  <div className="text-center mb-4">
                    <div className="text-3xl mb-1">&#127891;</div>
                    <h2 className="text-xl font-bold text-gray-900 dark:text-white uppercase tracking-wide">DAV PUBLIC SCHOOL</h2>
                    <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-widest">Est. 1995 &middot; Excellence in Education</p>
                    <h3 className="text-base font-bold text-gray-900 dark:text-white mt-2 uppercase border-t border-b border-gray-300 dark:border-gray-600 py-1.5 inline-block px-6">&#128202; Progress Report Card &amp; Marksheet</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-x-4 gap-y-2 text-sm mb-4 p-3 bg-gray-50 dark:bg-gray-700 rounded-lg">
                    <div><span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Student Name</span><br/><span className="font-semibold text-gray-900 dark:text-white">{proformaData.studentName}</span></div>
                    <div><span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Roll Number</span><br/><input type="text" placeholder="e.g. 2024-001" value={proformaData.rollNo} onChange={e => { setProformaData({ ...proformaData, rollNo: e.target.value }); setProformaDirty(true) }} className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" /></div>
                    <div><span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Class &amp; Section</span><br/><span className="font-semibold text-gray-900 dark:text-white">{proformaData.classSection}</span></div>
                    <div><span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Examination</span><br/><select value={proformaData.examination} onChange={e => { setProformaData({ ...proformaData, examination: e.target.value }); setProformaDirty(true) }} className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                      <option>Annual Examination</option>
                      <option>Half-Yearly</option>
                      <option>Unit Test I</option>
                      <option>Unit Test II</option>
                      <option>Pre-Board</option>
                    </select></div>
                    <div><span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Academic Year</span><br/><input type="text" value={proformaData.academicYear} onChange={e => { setProformaData({ ...proformaData, academicYear: e.target.value }); setProformaDirty(true) }} className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" /></div>
                    <div><span className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Date of Birth</span><br/><input type="date" value={proformaData.dob} onChange={e => { setProformaData({ ...proformaData, dob: e.target.value }); setProformaDirty(true) }} className="w-full px-2 py-1 border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" /></div>
                  </div>

                  <div className="overflow-x-auto mb-4">
                    <table className="w-full text-sm border-collapse border border-gray-300 dark:border-gray-600">
                      <thead>
                        <tr className="bg-gray-800 dark:bg-gray-900 text-white">
                          <th className="border border-gray-700 px-3 py-2 text-xs font-medium w-8">#</th>
                          <th className="border border-gray-700 px-3 py-2 text-xs font-medium text-left min-w-[110px]">Subject</th>
                          {cols.map((c, ci) => (
                            <th key={ci} className="border border-gray-700 px-3 py-2 text-xs font-medium min-w-[64px]">
                              <input type="text" value={c} onChange={e => {
                                const newCols = [...cols]
                                newCols[ci] = e.target.value
                                setProformaData({ ...proformaData, cols: newCols })
                                setProformaDirty(true)
                              }} className="bg-transparent border-b border-white/40 text-white text-xs text-center w-full outline-none" />
                            </th>
                          ))}
                          <th className="border border-gray-700 px-3 py-2 text-xs font-medium w-[70px]">Total</th>
                          <th className="border border-gray-700 px-3 py-2 text-xs font-medium w-[60px]">Max</th>
                          <th className="border border-gray-700 px-3 py-2 text-xs font-medium w-[60px]">%</th>
                          <th className="border border-gray-700 px-3 py-2 text-xs font-medium w-[50px]">Grade</th>
                          <th className="border border-gray-700 px-3 py-2 w-8"></th>
                        </tr>
                      </thead>
                      <tbody>
                        {rows.map((row, idx) => {
                          const c = calcRow(row, cols)
                          return (
                            <tr key={idx} className="border-b border-gray-200 dark:border-gray-700 hover:bg-yellow-50 dark:hover:bg-yellow-900/10">
                              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center text-gray-500 dark:text-gray-400 text-xs">{idx + 1}</td>
                              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                                <input type="text" value={row.subject} placeholder="Subject Name" onChange={e => updateProformaRow(idx, 'subject', e.target.value)} className="w-full bg-transparent text-gray-900 dark:text-white outline-none text-sm font-medium" />
                              </td>
                              {cols.map((col, ci) => (
                                <td key={ci} className="border border-gray-200 dark:border-gray-700 px-3 py-2">
                                  <input type="number" min="0" max={defaultMaxPerCol} value={row.marks[col] || ''} onChange={e => updateProformaRow(idx, col, e.target.value)} className="w-full bg-transparent text-gray-900 dark:text-white outline-none text-sm text-center" />
                                </td>
                              ))}
                              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center font-bold text-blue-700 dark:text-blue-400">{Object.values(row.marks).some(v => v) ? c.total : '—'}</td>
                              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center text-gray-500 dark:text-gray-400">{c.max}</td>
                              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center text-gray-500 dark:text-gray-400">{Object.values(row.marks).some(v => v) ? `${c.pct.toFixed(1)}%` : '—'}</td>
                              <td className={`border border-gray-200 dark:border-gray-700 px-3 py-2 text-center font-bold ${c.grade === 'F' ? 'text-red-600' : 'text-green-600 dark:text-green-400'}`}>{Object.values(row.marks).some(v => v) ? c.grade : '—'}</td>
                              <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center">
                                <button onClick={() => deleteProformaRow(idx)} className="text-red-500 hover:text-red-700 opacity-40 hover:opacity-100 text-sm">&times;</button>
                              </td>
                            </tr>
                          )
                        })}
                        <tr className="bg-yellow-50 dark:bg-yellow-900/20 font-bold border-t-2 border-gray-300 dark:border-gray-600">
                          <td colSpan="2" className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-blue-700 dark:text-blue-400 tracking-wide text-xs">COLUMN TOTAL</td>
                          {colSums.map((s, i) => (
                            <td key={i} className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center text-blue-700 dark:text-blue-400 text-sm">{s || '—'}</td>
                          ))}
                          <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center text-blue-700 dark:text-blue-400">{grandTotal || '—'}</td>
                          <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center text-gray-500 dark:text-gray-400">{grandMax || '—'}</td>
                          <td className="border border-gray-200 dark:border-gray-700 px-3 py-2 text-center text-gray-500 dark:text-gray-400">{grandMax > 0 ? `${overallPct.toFixed(1)}%` : '—'}</td>
                          <td className={`border border-gray-200 dark:border-gray-700 px-3 py-2 text-center font-bold ${overallPct >= 33 ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`}>{grandMax > 0 ? getGrade(overallPct) : '—'}</td>
                          <td className="border border-gray-200 dark:border-gray-700 px-3 py-2"></td>
                        </tr>
                      </tbody>
                    </table>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3 mb-4">
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Total Marks</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{grandTotal || '—'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Obtained</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Maximum</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{grandMax || '—'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Full Marks</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Percentage</p>
                      <p className={`text-xl font-bold ${pass ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`}>{grandMax > 0 ? `${overallPct.toFixed(2)}%` : '—'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Overall</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Grade</p>
                      <p className={`text-xl font-bold ${overallPct >= 33 ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`}>{grandMax > 0 ? getGrade(overallPct) : '—'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Letter Grade</p>
                    </div>
                    <div className={`bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center ${pass ? '' : 'border-2 border-red-400'}`}>
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Result</p>
                      <p className={`text-xl font-bold ${pass ? 'text-green-600 dark:text-green-400' : 'text-red-600'}`}>{grandMax > 0 ? (pass ? 'PASS' : 'FAIL') : '—'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Declaration</p>
                    </div>
                    <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-3 text-center">
                      <p className="text-xs text-gray-500 dark:text-gray-400 uppercase tracking-wider">Rank</p>
                      <p className="text-xl font-bold text-gray-900 dark:text-white">{overallPct >= 90 ? '1st' : overallPct >= 75 ? '2nd' : overallPct >= 60 ? '3rd' : 'N/A'}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">Class Standing</p>
                    </div>
                  </div>

                  <div className="border-t border-gray-300 dark:border-gray-600 pt-4 text-xs text-gray-500 dark:text-gray-400 text-center">
                    <p className="mb-3">This is a computer-generated marksheet &middot; DAV PUBLIC SCHOOL &middot; Verified &amp; Authenticated</p>
                    <div className="flex justify-around mt-4 max-w-lg mx-auto">
                      <div className="text-center"><div className="border-t border-gray-400 pt-1 w-28 mx-auto mb-1"></div>Class Teacher</div>
                      <div className="text-center"><div className="border-t border-gray-400 pt-1 w-28 mx-auto mb-1"></div>Examination Controller</div>
                      <div className="text-center"><div className="border-t border-gray-400 pt-1 w-28 mx-auto mb-1"></div>Principal</div>
                    </div>
                  </div>
                </div>
              )
            })()}

            {recordMsg && (
              <div className="mt-4 px-4 py-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-green-700 dark:text-green-300 text-sm border border-green-200 dark:border-green-800">
                &#10003; {recordMsg}
              </div>
            )}

            <div className="mt-8 border-t border-gray-200 dark:border-gray-700 pt-6">
              <h3 className="text-base font-semibold text-gray-900 dark:text-white mb-3">&#128196; Saved Records ({records.length})</h3>
              {records.length === 0 ? (
                <p className="text-gray-500 dark:text-gray-400 text-sm">No records saved yet.</p>
              ) : (
                <div className="overflow-x-auto rounded-xl border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                  <table className="w-full text-sm">
                    <thead>
                      <tr className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-800">
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400 text-xs">Student</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400 text-xs">Class</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400 text-xs">Exam</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400 text-xs">Year</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400 text-xs">Total</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400 text-xs">%</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400 text-xs">Grade</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400 text-xs">Result</th>
                        <th className="text-left px-3 py-2 font-medium text-gray-500 dark:text-gray-400 text-xs">Date</th>
                        <th className="w-10"></th>
                      </tr>
                    </thead>
                    <tbody>
                      {records.filter(r => {
                        if (!teacherClass) return true
                        const rg = normalizeGrade(r.teacherGrade || r.classSection || '')
                        const rs = r.teacherSection || ''
                        return (!teacherGrade || rg === teacherGrade) && (!teacherSection || rs === teacherSection)
                      }).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt)).map(rec => (
                        <tr key={rec.id} onClick={() => viewRecord(rec)} className="border-b border-gray-100 dark:border-gray-700 last:border-0 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors cursor-pointer">
                          <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">{rec.studentName}</td>
                          <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{rec.teacherGrade || rec.classSection || '—'}</td>
                          <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{rec.examination || '—'}</td>
                          <td className="px-3 py-2 text-gray-500 dark:text-gray-400">{rec.academicYear || '—'}</td>
                          <td className="px-3 py-2 text-gray-900 dark:text-white font-medium">{rec.totalObtained ?? '—'}/{rec.totalMax ?? '—'}</td>
                          <td className="px-3 py-2 text-gray-900 dark:text-white">{rec.percentage != null ? `${rec.percentage}%` : '—'}</td>
                          <td className={`px-3 py-2 font-bold ${rec.grade === 'F' ? 'text-red-600' : 'text-green-600 dark:text-green-400'}`}>{rec.grade || '—'}</td>
                          <td className={`px-3 py-2 font-bold ${rec.result === 'FAIL' ? 'text-red-600' : 'text-green-600 dark:text-green-400'}`}>{rec.result || '—'}</td>
                          <td className="px-3 py-2 text-gray-400 text-xs">{rec.createdAt ? new Date(rec.createdAt).toLocaleDateString() : '—'}</td>
                          <td className="px-3 py-2">
                            <button onClick={(e) => { e.stopPropagation(); deleteRecord(rec.id) }} className="text-red-500 hover:text-red-700 text-xs">&#10005;</button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              )}
            </div>
          </div>
        )}
      </div>
    </div>
  )
}