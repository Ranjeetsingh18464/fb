import React, { useState } from "react";

const children = [
  { id: 1, name: "Aarav Sharma", class: "10 - A" },
  { id: 2, name: "Ananya Sharma", class: "8 - B" },
];

const teachers = [
  { id: 1, name: "Dr. Sharma", subject: "Mathematics", online: true, lastMessage: "Aarav is doing well in class.", time: "10 min ago", unread: 2 },
  { id: 2, name: "Mrs. Gupta", subject: "Physics", online: false, lastMessage: "Please check the homework.", time: "1 hour ago", unread: 0 },
  { id: 3, name: "Mr. Verma", subject: "Chemistry", online: true, lastMessage: "Lab report submitted.", time: "3 hours ago", unread: 1 },
  { id: 4, name: "Ms. Singh", subject: "English", online: false, lastMessage: "Essay topic shared.", time: "1 day ago", unread: 0 },
  { id: 5, name: "Dr. Patel", subject: "Biology", online: false, lastMessage: "Project work discussed.", time: "2 days ago", unread: 0 },
];

const messages = [
  { id: 1, sender: "Dr. Sharma", text: "Good morning! Aarav has been performing well in Mathematics.", time: "10:15 AM", type: "received" },
  { id: 2, sender: "You", text: "Thank you, doctor! Is there any area he needs to improve?", time: "10:17 AM", type: "sent" },
  { id: 3, sender: "Dr. Sharma", text: "He could practice more on quadratic equations. I'll share some worksheets.", time: "10:18 AM", type: "received" },
  { id: 4, sender: "You", text: "That would be very helpful. Please share them.", time: "10:20 AM", type: "sent" },
  { id: 5, sender: "Dr. Sharma", text: "Sure! I'll send them via the school portal.", time: "10:25 AM", type: "received" },
];

export default function Communication() {
  const [selectedChild, setSelectedChild] = useState(children[0].id);
  const [selectedTeacher, setSelectedTeacher] = useState(null);
  const [messageText, setMessageText] = useState("");

  const handleSend = (e) => {
    e.preventDefault();
    setMessageText("");
  };

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <div>
            <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Communication</h1>
            <p className="text-gray-500 dark:text-gray-400 mt-1">Message your child's teachers</p>
          </div>
          <div className="mt-4 sm:mt-0">
            <select
              value={selectedChild}
              onChange={(e) => setSelectedChild(Number(e.target.value))}
              className="px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
            >
              {children.map((c) => <option key={c.id} value={c.id}>{c.name} - {c.class}</option>)}
            </select>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6" style={{ minHeight: "calc(100vh - 250px)" }}>
          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 overflow-y-auto p-4 lg:col-span-1">
            <div className="mb-4">
              <input type="text" placeholder="Search teachers..." className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
            </div>
            <div className="space-y-2">
              {teachers.map((t) => (
                <div
                  key={t.id}
                  className={`flex items-center gap-3 p-3 rounded-lg cursor-pointer transition ${
                    selectedTeacher === t.id
                      ? "bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800"
                      : "hover:bg-gray-50 dark:hover:bg-gray-700 border border-transparent"
                  }`}
                  onClick={() => setSelectedTeacher(t.id)}
                >
                  <div className="relative">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold text-sm">
                      {t.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    {t.online && <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white dark:border-gray-800" />}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center justify-between">
                      <p className="font-medium text-sm text-gray-900 dark:text-white truncate">{t.name}</p>
                      <span className="text-xs text-gray-400">{t.time}</span>
                    </div>
                    <p className="text-xs text-gray-500 dark:text-gray-400 truncate">{t.subject} &bull; {t.lastMessage}</p>
                  </div>
                  {t.unread > 0 && (
                    <span className="bg-blue-600 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">{t.unread}</span>
                  )}
                </div>
              ))}
            </div>
          </div>

          <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 lg:col-span-2 flex flex-col p-4">
            {selectedTeacher ? (
              <>
                <div className="border-b border-gray-200 dark:border-gray-700 pb-4 mb-4">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-600 rounded-full flex items-center justify-center text-white font-semibold">
                      {teachers.find((t) => t.id === selectedTeacher)?.name.split(" ").map((n) => n[0]).join("")}
                    </div>
                    <div>
                      <p className="font-medium text-gray-900 dark:text-white">{teachers.find((t) => t.id === selectedTeacher)?.name}</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400">{teachers.find((t) => t.id === selectedTeacher)?.subject} Teacher</p>
                    </div>
                    <span className="ml-auto flex items-center gap-1 text-xs text-green-600">
                      <span className="w-2 h-2 bg-green-500 rounded-full"></span> Online
                    </span>
                  </div>
                </div>

                <div className="flex-1 overflow-y-auto space-y-4 mb-4" style={{ maxHeight: "400px" }}>
                  {messages.map((msg) => (
                    <div key={msg.id} className={`flex ${msg.type === "sent" ? "justify-end" : "justify-start"}`}>
                      <div className={`max-w-[70%] p-3 rounded-lg ${
                        msg.type === "sent"
                          ? "bg-blue-600 text-white rounded-br-none"
                          : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                      }`}>
                        <p className="text-sm">{msg.text}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <span className={`text-xs ${msg.type === "sent" ? "text-blue-200" : "text-gray-400"}`}>{msg.time}</span>
                          {msg.type === "sent" && <span className="text-blue-200 text-xs">✓✓</span>}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>

                <form onSubmit={handleSend} className="border-t border-gray-200 dark:border-gray-700 pt-4">
                  <div className="flex gap-2">
                    <button type="button" className="text-gray-500 hover:text-blue-600 dark:hover:text-blue-400 p-2">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                      </svg>
                    </button>
                    <input
                      type="text"
                      className="flex-1 px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm"
                      placeholder="Type your message..."
                      value={messageText}
                      onChange={(e) => setMessageText(e.target.value)}
                    />
                    <button type="submit" className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Send</button>
                  </div>
                </form>
              </>
            ) : (
              <div className="flex items-center justify-center h-full text-gray-400">
                <div className="text-center">
                  <span className="text-5xl block mb-4">💬</span>
                  <p className="text-lg mb-2">Select a Teacher</p>
                  <p className="text-sm">Choose a teacher from the list to start messaging</p>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
