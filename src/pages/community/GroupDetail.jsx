import { useState } from "react";
import { useNavigate } from "react-router-dom";

const tabs = ["Feed", "Members", "About", "Media", "Polls", "Assignments"];

const initialMembers = [
  { name: "Alice", role: "Admin" },
  { name: "Bob", role: "Moderator" },
  { name: "Charlie", role: "Member" },
  { name: "Diana", role: "Member" },
];

export default function GroupDetail() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState("Feed");
  const [posts, setPosts] = useState([
    { id: 1, author: "Alice", content: "Welcome to the group!", files: [] },
  ]);
  const [newPost, setNewPost] = useState("");
  const [pollQuestion, setPollQuestion] = useState("");
  const [pollOptions, setPollOptions] = useState(["", ""]);

  const createPost = () => {
    if (!newPost.trim()) return;
    setPosts([{ id: Date.now(), author: "You", content: newPost, files: [] }, ...posts]);
    setNewPost("");
  };

  const createPoll = () => {
    if (!pollQuestion.trim() || pollOptions.some(o => !o.trim())) return;
    setPosts([{ id: Date.now(), author: "You", content: `📊 Poll: ${pollQuestion}\nOptions: ${pollOptions.join(", ")}`, files: [] }, ...posts]);
    setPollQuestion("");
    setPollOptions(["", ""]);
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Math Enthusiasts</h1>
        </div>
        <div className="flex gap-2 mb-6 overflow-x-auto">
          {tabs.map(tab => (
            <button key={tab} onClick={() => setActiveTab(tab)} className={`px-4 py-2 text-sm rounded whitespace-nowrap ${activeTab === tab ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"}`}>
              {tab}
            </button>
          ))}
        </div>
        {activeTab === "Feed" && (
          <div>
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
              <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="Write a post..." rows={2} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" />
              <div className="flex justify-between items-center mt-3">
                <label className="px-3 py-1 text-sm text-gray-500 border rounded cursor-pointer hover:bg-gray-100 dark:hover:bg-gray-700">
                  📎 Attach File
                  <input type="file" className="hidden" />
                </label>
                <button onClick={createPost} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Post</button>
              </div>
            </div>
            <div className="space-y-4">
              {posts.map(post => (
                <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                  <div className="flex items-center gap-2 mb-2">
                    <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">{post.author[0]}</div>
                    <span className="font-semibold text-gray-800 dark:text-white">{post.author}</span>
                  </div>
                  <p className="text-gray-600 dark:text-gray-300">{post.content}</p>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "Members" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <div className="space-y-3">
              {initialMembers.map((m, i) => (
                <div key={i} className="flex items-center justify-between border-b dark:border-gray-700 pb-3 last:border-0">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gray-300 dark:bg-gray-600 rounded-full flex items-center justify-center text-gray-700 dark:text-gray-300 font-semibold">{m.name[0]}</div>
                    <div>
                      <p className="font-semibold text-gray-800 dark:text-white">{m.name}</p>
                      <p className="text-xs text-gray-500">{m.role}</p>
                    </div>
                  </div>
                  <span className={`px-2 py-0.5 text-xs rounded ${m.role === "Admin" ? "bg-purple-100 dark:bg-purple-900 text-purple-700" : m.role === "Moderator" ? "bg-blue-100 dark:bg-blue-900 text-blue-700" : "bg-gray-100 dark:bg-gray-700 text-gray-600"}`}>{m.role}</span>
                </div>
              ))}
            </div>
          </div>
        )}
        {activeTab === "About" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <h3 className="font-semibold text-lg text-gray-800 dark:text-white mb-2">About This Group</h3>
            <p className="text-gray-600 dark:text-gray-400">This is a group for math enthusiasts to share problems, solutions, and discuss mathematical concepts.</p>
            <div className="mt-4 text-sm text-gray-500"><span className="font-semibold">Created:</span> Jan 2026</div>
            <div className="text-sm text-gray-500"><span className="font-semibold">Members:</span> 45</div>
          </div>
        )}
        {activeTab === "Media" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <div className="border-2 border-dashed border-gray-300 dark:border-gray-600 rounded-lg p-8 text-center">
              <p className="text-gray-500 dark:text-gray-400 mb-2">Drag and drop files here</p>
              <label className="px-4 py-2 bg-blue-600 text-white rounded cursor-pointer hover:bg-blue-700 text-sm inline-block">
                Upload Files
                <input type="file" multiple className="hidden" />
              </label>
            </div>
          </div>
        )}
        {activeTab === "Polls" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
            <h3 className="font-semibold text-gray-800 dark:text-white mb-3">Create a Poll</h3>
            <input placeholder="Poll question" value={pollQuestion} onChange={e => setPollQuestion(e.target.value)} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 mb-2" />
            {pollOptions.map((opt, i) => (
              <input key={i} placeholder={`Option ${i + 1}`} value={opt} onChange={e => { const o = [...pollOptions]; o[i] = e.target.value; setPollOptions(o); }} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600 mb-2" />
            ))}
            <button onClick={() => setPollOptions([...pollOptions, ""])} className="text-sm text-blue-500 hover:text-blue-700 mr-3">+ Add Option</button>
            <button onClick={createPoll} className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">Create Poll</button>
          </div>
        )}
        {activeTab === "Assignments" && (
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
            <p className="text-gray-500 dark:text-gray-400">No assignments posted yet.</p>
          </div>
        )}
      </div>
    </div>
  );
}
