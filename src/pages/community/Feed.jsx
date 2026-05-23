import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";
import { db, collection, getDocs, setDoc, doc, updateDoc, deleteDoc, arrayUnion, arrayRemove, serverTimestamp, query, orderBy } from "../../services/firebase";

export default function Feed() {
  const navigate = useNavigate();
  const [posts, setPosts] = useState([]);
  const [newPost, setNewPost] = useState("");
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(true);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImagePreview(URL.createObjectURL(file));
    }
  };

  const removeImage = () => {
    setImagePreview(null);
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "feed_posts"), orderBy("createdAt", "desc"));
      const snap = await getDocs(q);
      setPosts(snap.docs.map(d => ({ id: d.id, ...d.data() })));
    } catch (err) {
      console.error("Failed to load posts:", err);
    } finally {
      setLoading(false);
    }
  };

  const createPost = async () => {
    if (!newPost.trim()) return;
    const id = doc(collection(db, "feed_posts")).id;
    const post = { content: newPost, author: "You", likes: 0, likedBy: [], comments: [], image: imagePreview || null, createdAt: serverTimestamp() };
    try {
      await setDoc(doc(db, "feed_posts", id), post);
      setPosts([{ id, ...post, createdAt: new Date().toISOString() }, ...posts]);
      setNewPost("");
      setImagePreview(null);
      if (fileInputRef.current) fileInputRef.current.value = "";
    } catch (err) {
      console.error("Failed to create post:", err);
    }
  };

  const toggleLike = async (post) => {
    try {
      const ref = doc(db, "feed_posts", post.id);
      const isLiked = post.likedBy?.includes("currentUser");
      if (isLiked) {
        await updateDoc(ref, { likes: post.likes - 1, likedBy: arrayRemove("currentUser") });
        setPosts(posts.map(p => p.id === post.id ? { ...p, likes: p.likes - 1, likedBy: (p.likedBy || []).filter(u => u !== "currentUser") } : p));
      } else {
        await updateDoc(ref, { likes: post.likes + 1, likedBy: arrayUnion("currentUser") });
        setPosts(posts.map(p => p.id === post.id ? { ...p, likes: p.likes + 1, likedBy: [...(p.likedBy || []), "currentUser"] } : p));
      }
    } catch (err) {
      console.error("Failed to toggle like:", err);
    }
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
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Community Feed</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-4 mb-6">
          <textarea value={newPost} onChange={e => setNewPost(e.target.value)} placeholder="What's on your mind?" rows={3} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" />
          {imagePreview && (
            <div className="mt-3 relative inline-block">
              <img src={imagePreview} alt="Preview" className="h-24 rounded-lg object-cover" />
              <button onClick={removeImage} className="absolute -top-2 -right-2 w-5 h-5 bg-red-500 text-white rounded-full text-xs flex items-center justify-center hover:bg-red-600">&times;</button>
            </div>
          )}
          <div className="flex justify-between items-center mt-3">
            <button onClick={() => fileInputRef.current?.click()} className="px-3 py-1 text-sm text-gray-500 border rounded hover:bg-gray-100 dark:hover:bg-gray-700 flex items-center gap-2">
              <span>📎</span> Attach Image
            </button>
            <input ref={fileInputRef} type="file" accept="image/*" className="hidden" onChange={handleImageSelect} />
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
              <p className="text-gray-600 dark:text-gray-300 mb-3">{post.content}</p>
              {post.image && <img src={post.image} alt="Post image" className="w-full max-h-80 object-cover rounded-lg mb-3" />}
              <div className="flex items-center gap-4 text-sm">
                <button onClick={() => toggleLike(post)} className={`flex items-center gap-1 ${post.likedBy?.includes("currentUser") ? "text-blue-600" : "text-gray-500 hover:text-blue-600"}`}>
                  👍 {post.likes || 0}
                </button>
                <span className="text-gray-500">💬 {post.comments?.length || 0} Comments</span>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}