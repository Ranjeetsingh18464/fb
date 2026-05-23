import { useState } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";

const groupData = {
  1: { name: "Science Department", members: 12, description: "Science faculty discussion group" },
  2: { name: "Grade 10 Teachers", members: 8, description: "All Grade 10 teachers" },
  3: { name: "Curriculum Committee", members: 6, description: "Curriculum planning and review" },
  4: { name: "Sports Coordinators", members: 5, description: "Sports event coordination" },
  5: { name: "Exam Board", members: 10, description: "Exam scheduling and results" },
  6: { name: "PTA Liaison", members: 4, description: "Parent-teacher coordination" },
};

export default function GroupDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const joined = location.state?.joined ?? false;
  const group = groupData[id];
  const [posts, setPosts] = useState([]);
  const [text, setText] = useState("");

  const handlePost = () => {
    if (!text.trim()) return;
    setPosts([{ id: Date.now(), text, author: "You", time: new Date().toLocaleString() }, ...posts]);
    setText("");
  };

  if (!group) return <div className="p-6 text-gray-500">Group not found</div>;

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <button onClick={() => navigate(-1)} className="mb-4 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200">&larr; Back to Groups</button>
        <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-6 mb-6">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white">{group.name}</h1>
          <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">{group.members} members</p>
          {group.description && <p className="text-sm text-gray-600 dark:text-gray-400 mt-2">{group.description}</p>}
        </div>

        {joined ? (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6">
            <textarea value={text} onChange={e => setText(e.target.value)} placeholder="Write something..." rows={3} className="w-full p-3 border border-gray-200 dark:border-gray-700 rounded-lg bg-gray-50 dark:bg-gray-700 text-gray-900 dark:text-white resize-none outline-none focus:ring-2 focus:ring-blue-500 text-sm" />
            <div className="flex justify-end mt-3">
              <button onClick={handlePost} className="px-4 py-2 bg-blue-600 text-white text-sm rounded-lg hover:bg-blue-700">Post</button>
            </div>
          </div>
        ) : (
          <div className="bg-white dark:bg-gray-800 rounded-xl shadow p-4 mb-6 text-center">
            <p className="text-sm text-gray-500 dark:text-gray-400">Join this group to post.</p>
          </div>
        )}

        <div className="space-y-4">
          {posts.length === 0 && <p className="text-center text-gray-400 dark:text-gray-500 text-sm py-8">No posts yet. Be the first to post!</p>}
          {posts.map(p => (
            <div key={p.id} className="bg-white dark:bg-gray-800 rounded-xl shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-bold">{p.author[0]}</div>
                <div>
                  <p className="text-sm font-medium text-gray-900 dark:text-white">{p.author}</p>
                  <p className="text-xs text-gray-400">{p.time}</p>
                </div>
              </div>
              <p className="text-sm text-gray-700 dark:text-gray-300 whitespace-pre-wrap">{p.text}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}