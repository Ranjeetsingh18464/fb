import { useState } from "react";
import { useNavigate } from "react-router-dom";

export default function Profile() {
  const navigate = useNavigate();
  const [editing, setEditing] = useState(false);
  const [profile, setProfile] = useState({
    name: "John Doe",
    email: "john.doe@example.com",
    role: "Student",
    bio: "A passionate learner exploring the world of science and mathematics.",
    avatar: null,
  });
  const [form, setForm] = useState({ ...profile });

  const handleSave = () => {
    setProfile({ ...form });
    setEditing(false);
  };

  const handleCancel = () => {
    setForm({ ...profile });
    setEditing(false);
  };

  const handleAvatarUpload = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setForm({ ...form, avatar: reader.result });
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-gray-900 p-4 md:p-6">
      <div className="max-w-3xl mx-auto">
        <div className="flex items-center gap-4 mb-6">
          <button onClick={() => navigate(-1)} className="text-gray-600 dark:text-gray-300 hover:text-gray-800 dark:hover:text-white text-xl">&larr;</button>
          <h1 className="text-2xl font-bold text-gray-800 dark:text-white">Profile</h1>
        </div>
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow p-6">
          <div className="flex flex-col items-center mb-6">
            <div className="relative mb-4">
              {form.avatar ? (
                <img src={form.avatar} alt="Avatar" className="w-24 h-24 rounded-full object-cover" />
              ) : (
                <div className="w-24 h-24 bg-blue-500 rounded-full flex items-center justify-center text-white text-3xl font-bold">{profile.name[0]}</div>
              )}
              {editing && (
                <label className="absolute bottom-0 right-0 bg-blue-600 text-white rounded-full w-8 h-8 flex items-center justify-center cursor-pointer text-sm">
                  ✏️
                  <input type="file" accept="image/*" onChange={handleAvatarUpload} className="hidden" />
                </label>
              )}
            </div>
          </div>
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Name</label>
              {editing ? (
                <input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" />
              ) : (
                <p className="text-gray-800 dark:text-white">{profile.name}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Email</label>
              {editing ? (
                <input value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" />
              ) : (
                <p className="text-gray-800 dark:text-white">{profile.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Role</label>
              <p className="text-gray-800 dark:text-white">{profile.role}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-600 dark:text-gray-300 mb-1">Bio</label>
              {editing ? (
                <textarea value={form.bio} onChange={e => setForm({ ...form, bio: e.target.value })} rows={3} className="w-full px-3 py-2 border rounded bg-white dark:bg-gray-700 text-gray-800 dark:text-white border-gray-300 dark:border-gray-600" />
              ) : (
                <p className="text-gray-600 dark:text-gray-400">{profile.bio}</p>
              )}
            </div>
          </div>
          <div className="mt-6 flex gap-3 justify-end">
            {editing ? (
              <>
                <button onClick={handleCancel} className="px-4 py-2 bg-gray-200 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-300 dark:hover:bg-gray-600 text-sm">Cancel</button>
                <button onClick={handleSave} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Save</button>
              </>
            ) : (
              <button onClick={() => setEditing(true)} className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700 text-sm">Edit Profile</button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
