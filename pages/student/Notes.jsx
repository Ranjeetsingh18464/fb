import React, { useState } from "react";

const subjects = ["All", "Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer"];

const notes = [
  { id: 1, title: "Quadratic Equations Summary", subject: "Mathematics", teacher: "Dr. Sharma", uploaded: "10 May 2026", preview: "A comprehensive summary of quadratic equations including formulas, solved examples, and practice problems.", file: "quadratics_summary.pdf" },
  { id: 2, title: "Newton's Laws of Motion", subject: "Physics", teacher: "Mrs. Gupta", uploaded: "08 May 2026", preview: "Detailed notes on Newton's three laws with real-life examples and diagrams.", file: "newtons_laws.pdf" },
  { id: 3, title: "Periodic Table Guide", subject: "Chemistry", teacher: "Mr. Verma", uploaded: "05 May 2026", preview: "Complete guide to the periodic table including element properties and trends.", file: "periodic_table_guide.pdf" },
  { id: 4, title: "Human Digestive System", subject: "Biology", teacher: "Dr. Patel", uploaded: "03 May 2026", preview: "Step-by-step breakdown of the human digestive system with labeled diagrams.", file: "digestive_system.pdf" },
  { id: 5, title: "Essay Writing Techniques", subject: "English", teacher: "Ms. Singh", uploaded: "01 May 2026", preview: "Tips and techniques for writing compelling essays with example structures.", file: "essay_writing.pdf" },
  { id: 6, title: "World War II Overview", subject: "History", teacher: "Mr. Singh", uploaded: "28 April 2026", preview: "Timeline and key events of World War II with important dates and figures.", file: "wwII_overview.pdf" },
  { id: 7, title: "Climate & Geography", subject: "Geography", teacher: "Mrs. Nair", uploaded: "25 April 2026", preview: "Notes on climate zones, weather patterns, and geographical formations.", file: "climate_geo.pdf" },
  { id: 8, title: "Python Programming Basics", subject: "Computer", teacher: "Mr. Kumar", uploaded: "22 April 2026", preview: "Introduction to Python programming including variables, loops, and functions.", file: "python_basics.pdf" },
];

export default function Notes() {
  const [selectedSubject, setSelectedSubject] = useState("All");
  const [searchQuery, setSearchQuery] = useState("");

  const filtered = notes.filter((n) => {
    const matchesSubject = selectedSubject === "All" || n.subject === selectedSubject;
    const matchesSearch = n.title.toLowerCase().includes(searchQuery.toLowerCase()) || n.preview.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesSubject && matchesSearch;
  });

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Study Notes</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Browse and download study notes</p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1">
            <input type="text" placeholder="Search notes..." value={searchQuery} onChange={(e) => setSearchQuery(e.target.value)} className="input-field w-full px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
          </div>
          <div className="flex gap-2 flex-wrap">
            {subjects.map((s) => (
              <button key={s} onClick={() => setSelectedSubject(s)} className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-all ${
                selectedSubject === s
                  ? "bg-blue-600 text-white"
                  : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
              }`}>{s}</button>
            ))}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {filtered.map((note) => (
            <div key={note.id} className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover flex flex-col">
              <div className="flex-1">
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-xs px-2 py-0.5 rounded-full bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-300">{note.subject}</span>
                </div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">{note.title}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400 mb-2">👨‍🏫 {note.teacher} · 📅 {note.uploaded}</p>
                <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-3">{note.preview}</p>
              </div>
              <button className="mt-4 w-full btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium flex items-center justify-center gap-2">
                📥 Download
              </button>
            </div>
          ))}
        </div>

        {filtered.length === 0 && (
          <div className="text-center py-12 text-gray-500 dark:text-gray-400">
            No notes found matching your criteria.
          </div>
        )}
      </div>
    </div>
  );
}
