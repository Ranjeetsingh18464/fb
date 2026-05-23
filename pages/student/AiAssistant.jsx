import React, { useState } from "react";

const subjects = ["Mathematics", "Physics", "Chemistry", "Biology", "English", "History", "Geography", "Computer"];

const quickActions = [
  { label: "Explain this topic", icon: "🧠" },
  { label: "Help with homework", icon: "📚" },
  { label: "Create practice questions", icon: "✍️" },
];

export default function AiAssistant() {
  const [messages, setMessages] = useState([
    { role: "ai", text: "Hello! I'm your AI study assistant. How can I help you today? You can ask me to explain topics, help with homework, or create practice questions." },
  ]);
  const [input, setInput] = useState("");
  const [selectedSubject, setSelectedSubject] = useState("Mathematics");

  const handleSend = (e) => {
    e.preventDefault();
    if (!input.trim()) return;
    setMessages((prev) => [...prev, { role: "user", text: input }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: "ai",
        text: `Great question about ${selectedSubject}! I'd be happy to help you with "${input}". Here's a brief explanation:\n\nThis is a key concept in ${selectedSubject}. I recommend breaking it down into smaller parts and practicing regularly. Would you like me to elaborate on any specific aspect?`,
      }]);
    }, 1000);
    setInput("");
  };

  const handleQuickAction = (action) => {
    setMessages((prev) => [...prev, { role: "user", text: action }]);
    setTimeout(() => {
      setMessages((prev) => [...prev, {
        role: "ai",
        text: `Sure! Let me help you with "${action}" for ${selectedSubject}.\n\nHere's what I recommend:\n1. Review the core concepts first\n2. Try practice problems\n3. Check your understanding with self-assessment\n\nWould you like me to go deeper into any specific area?`,
      }]);
    }, 1000);
  };

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">🤖 AI Study Assistant</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Your intelligent study companion</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          <div className="lg:col-span-3 space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700 flex flex-col h-[500px]">
              <div className="p-4 border-b border-gray-200 dark:border-gray-700 flex items-center gap-3">
                <span className="w-8 h-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center text-white text-sm">AI</span>
                <div>
                  <h2 className="font-semibold text-gray-900 dark:text-white">Study Assistant</h2>
                  <p className="text-xs text-gray-500 dark:text-gray-400">Subject: {selectedSubject}</p>
                </div>
              </div>

              <div className="flex-1 overflow-y-auto p-4 space-y-4">
                {messages.map((msg, i) => (
                  <div key={i} className={`flex ${msg.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className={`max-w-[80%] p-3 rounded-xl text-sm ${
                      msg.role === "user"
                        ? "bg-blue-600 text-white rounded-br-none"
                        : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-gray-200 rounded-bl-none"
                    }`}>
                      <p className="whitespace-pre-wrap">{msg.text}</p>
                    </div>
                  </div>
                ))}
              </div>

              <form onSubmit={handleSend} className="p-4 border-t border-gray-200 dark:border-gray-700">
                <div className="flex gap-2">
                  <input type="text" value={input} onChange={(e) => setInput(e.target.value)} placeholder="Ask me anything about your studies..." className="input-field flex-1 px-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" />
                  <button type="submit" className="btn-primary bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Send</button>
                </div>
              </form>
            </div>

            <div className="grid grid-cols-3 gap-3">
              {quickActions.map((action) => (
                <button key={action.label} onClick={() => handleQuickAction(action.label)} className="card bg-white dark:bg-gray-800 rounded-xl p-4 shadow-sm border border-gray-200 dark:border-gray-700 card-hover text-center">
                  <span className="text-2xl block mb-1">{action.icon}</span>
                  <span className="text-xs font-medium text-gray-700 dark:text-gray-300">{action.label}</span>
                </button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">Subject Context</h2>
              <select value={selectedSubject} onChange={(e) => setSelectedSubject(e.target.value)} className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm">
                {subjects.map((s) => <option key={s} value={s}>{s}</option>)}
              </select>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📝 Grammar Checker</h2>
              <textarea rows="4" className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" placeholder="Paste your text here to check grammar..."></textarea>
              <button className="mt-3 w-full btn-primary bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Check Grammar</button>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">📄 Note Summarizer</h2>
              <textarea rows="4" className="input-field w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white text-sm" placeholder="Paste your notes to summarize..."></textarea>
              <button className="mt-3 w-full btn-primary bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-lg text-sm font-medium">Summarize</button>
            </div>

            <div className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700">
              <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">💡 Study Recommendations</h2>
              <div className="space-y-3">
                <div className="p-3 rounded-lg bg-blue-50 dark:bg-blue-900/20 text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">📐 Practice Math daily</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">15 min of problem solving</p>
                </div>
                <div className="p-3 rounded-lg bg-green-50 dark:bg-green-900/20 text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">🔬 Review Science concepts</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Focus on weak topics</p>
                </div>
                <div className="p-3 rounded-lg bg-purple-50 dark:bg-purple-900/20 text-sm">
                  <p className="font-medium text-gray-900 dark:text-white">📖 Read English passages</p>
                  <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">Improve comprehension</p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
