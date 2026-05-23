import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, getDocs, setDoc, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp, query, orderBy } from "../../services/firebase";

export default function AchievementWall() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState({ title: "", description: "", image: "" });
  const [editId, setEditId] = useState(null);

  useEffect(() => { fetchAchievements(); }, []);

  const fetchAchievements = async () => {
    try {
      const q = query(collection(db, "achievements"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) { console.error("Failed to load achievements:", err); }
    finally { setLoading(false); }
  };

  const handleImageUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, image: reader.result });
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      if (editId) {
        const ref = doc(db, "achievements", editId);
        await updateDoc(ref, { title: form.title, description: form.description, image: form.image || null });
        setPosts(posts.map(p => p.id === editId ? { ...p, ...form, image: form.image || p.image } : p));
      } else {
        const id = doc(collection(db, "achievements")).id;
        const post = { author: "You", title: form.title, description: form.description, image: form.image || null, likes: 0, likedBy: [], createdAt: serverTimestamp() };
        await setDoc(doc(db, "achievements", id), post);
        setPosts([{ id, ...post, createdAt: new Date().toISOString() }, ...posts]);
      }
      setForm({ title: "", description: "", image: "" });
      setEditId(null);
      setShowForm(false);
    } catch (err) { console.error("Failed to save achievement:", err); }
  };

  const handleEdit = (post) => {
    setForm({ title: post.title, description: post.description, image: post.image || "" });
    setEditId(post.id);
    setShowForm(true);
  };

  const handleDelete = async (id) => {
    try {
      await deleteDoc(doc(db, "achievements", id));
      setPosts(posts.filter(p => p.id !== id));
    } catch (err) { console.error("Failed to delete achievement:", err); }
  };

  const toggleLike = async (id) => {
    try {
      const ref = doc(db, "achievements", id);
      const post = posts.find(p => p.id === id);
      const isLiked = post?.likedBy?.includes("currentUser");
      if (isLiked) {
        await updateDoc(ref, { likes: post.likes - 1, likedBy: arrayRemove("currentUser") });
      } else {
        await updateDoc(ref, { likes: (post?.likes || 0) + 1, likedBy: arrayUnion("currentUser") });
      }
      setPosts(posts.map(p => p.id === id ? { ...p, liked: !p.liked, likes: p.liked ? p.likes - 1 : p.likes + 1 } : p));
    } catch (err) { console.error("Failed to toggle like:", err); }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin h-8 w-8 border-4 border-indigo-500 border-t-transparent rounded-full"></div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
            <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Achievement Wall</h1>
          </div>
          <button onClick={() => { setShowForm(!showForm); setEditId(null); setForm({ title: "", description: "", image: "" }); }} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">{showForm ? "Cancel" : "Share Achievement"}</button>
        </div>
        {showForm && (
          <form onSubmit={handleSubmit} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6 space-y-3">
            <input placeholder="Title" value={form.title} onChange={e => setForm({ ...form, title: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required />
            <textarea placeholder="Description" value={form.description} onChange={e => setForm({ ...form, description: e.target.value })} rows={2} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" required />
            <input type="file" accept="image/*" onChange={handleImageUpload} className="w-full text-sm text-gray-600 dark:text-gray-300" />
            {form.image && <img src={form.image} alt="Preview" className="w-48 h-32 object-cover rounded" />}
            <button type="submit" className="px-4 py-2 bg-green-600 text-white rounded hover:bg-green-700 text-sm">{editId ? "Update" : "Share"}</button>
          </form>
        )}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {posts.map(post => (
            <div key={post.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
              <div className="flex items-center gap-2 mb-2">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center text-white text-sm font-semibold">{post.author[0]}</div>
                <span className="font-semibold text-gray-800 dark:text-white">{post.author}</span>
              </div>
              <h3 className="font-semibold text-gray-800 dark:text-white">{post.title}</h3>
              {post.image && <img src={post.image} alt={post.title} className="w-full h-40 object-cover rounded my-2" />}
              <p className="text-sm text-gray-600 dark:text-gray-400">{post.description}</p>
              <div className="flex items-center justify-between mt-3">
                <button onClick={() => toggleLike(post.id)} className={`flex items-center gap-1 text-sm ${post.liked ? "text-blue-600" : "text-gray-500 hover:text-blue-600"}`}>
                  {post.liked ? "❤️" : "🤍"} {post.likes}
                </button>
                <div className="flex gap-2">
                  <button onClick={() => handleEdit(post)} className="text-sm text-blue-500 hover:text-blue-700">Edit</button>
                  <button onClick={() => handleDelete(post.id)} className="text-sm text-red-500 hover:text-red-700">Delete</button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}