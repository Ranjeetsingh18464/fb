import { useState } from "react";
import { useNavigate } from "react-router-dom";

const suggestions = ["Explain quadratic equations", "What is photosynthesis?", "Help me with history homework"];

export default function AiAssistant() {
  const navigate = useNavigate();
  const [messages, setMessages] = useState([
    { role: "assistant", text: "Hello! I'm your AI study assistant. How can I help you today?" },
  ]);
  const [input, setInput] = useState("");

  const sendMessage = (text) => {
    if (!text.trim()) return;
    setMessages([...messages, { role: "user", text }]);
    setInput("");
    setTimeout(() => {
      setMessages(prev => [...prev, { role: "assistant", text: "That's a great question! Let me help you with that." }]);
    }, 500);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-4xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">AI Assistant</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow flex flex-col h-[600px]">
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {messages.map((m, i) => (
              <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                <div className={`max-w-[75%] p-3 rounded-lg ${m.role === "user" ? "bg-blue-600 text-white" : "bg-gray-100 dark:bg-gray-700 text-gray-800 dark:text-white"}`}>
                  {m.text}
                </div>
              </div>
            ))}
          </div>
          <div className="p-4 border-t dark:border-gray-700">
            <div className="flex gap-2 mb-3">
              {suggestions.map((s, i) => (
                <button key={i} onClick={() => sendMessage(s)} className="px-3 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-600">{s}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input value={input} onChange={e => setInput(e.target.value)} onKeyDown={e => e.key === "Enter" && sendMessage(input)} placeholder="Type your message..." className="flex-1 px-4 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" />
              <button onClick={() => sendMessage(input)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">Send</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
