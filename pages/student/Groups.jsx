import React, { useState } from "react";

const myGroups = [
  { id: 1, name: "Math Study Circle", type: "Private", members: 12, activity: "New problem posted today", joined: true },
  { id: 2, name: "Science Olympiad", type: "Public", members: 45, activity: "Quiz scheduled for Friday", joined: true },
  { id: 3, name: "English Literature Club", type: "Public", members: 28, activity: "Discussion on Shakespeare", joined: true },
];

const browseGroups = [
  { id: 4, name: "Physics Enthusiasts", type: "Public", members: 34, activity: "Lab experiment discussion", joined: false },
  { id: 5, name: "Coding Warriors", type: "Public", members: 56, activity: "Weekly coding challenge", joined: false },
  { id: 6, name: "History Buffs", type: "Private", members: 18, activity: "Debate on World War II", joined: false },
  { id: 7, name: "Chemistry Lab Partners", type: "Public", members: 22, activity: "Periodic table quiz", joined: false },
  { id: 8, name: "Debate Society", type: "Public", members: 41, activity: "New debate topic posted", joined: false },
  { id: 9, name: "Art & Creativity", type: "Private", members: 15, activity: "Art contest announced", joined: false },
];

export default function Groups() {
  const [joinedGroups, setJoinedGroups] = useState(myGroups.map((g) => g.id));
  const [activeTab, setActiveTab] = useState("my-groups");

  const handleJoinToggle = (groupId) => {
    setJoinedGroups((prev) =>
      prev.includes(groupId) ? prev.filter((id) => id !== groupId) : [...prev, groupId]
    );
  };

  return (
    <div className="page-container min-h-screen p-6 bg-gray-50 dark:bg-gray-900">
      <div className="max-w-7xl mx-auto space-y-6">
        <div className="page-header">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Groups</h1>
          <p className="text-gray-500 dark:text-gray-400 mt-1">Join educational groups and collaborate with peers</p>
        </div>

        <div className="flex gap-2">
          <button onClick={() => setActiveTab("my-groups")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "my-groups" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}>My Groups</button>
          <button onClick={() => setActiveTab("browse")} className={`px-4 py-2 rounded-lg text-sm font-medium transition-all ${
            activeTab === "browse" ? "bg-blue-600 text-white" : "bg-white dark:bg-gray-800 text-gray-600 dark:text-gray-400 border border-gray-200 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-700"
          }`}>Browse Groups</button>
        </div>

        {activeTab === "my-groups" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {myGroups.map((group) => (
              <div key={group.id} className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
                <div className="flex items-start justify-between mb-3">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                    <span className={`text-xs px-2 py-0.5 rounded-full ${
                      group.type === "Public" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                    }`}>{group.type}</span>
                  </div>
                </div>
                <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                  <p>👥 {group.members} members</p>
                  <p>💬 {group.activity}</p>
                </div>
                <button onClick={() => handleJoinToggle(group.id)} className="mt-4 w-full px-4 py-2 rounded-lg text-sm font-medium border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700">
                  Leave Group
                </button>
              </div>
            ))}
          </div>
        )}

        {activeTab === "browse" && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {browseGroups.map((group) => {
              const isJoined = joinedGroups.includes(group.id);
              return (
                <div key={group.id} className="card bg-white dark:bg-gray-800 rounded-xl p-5 shadow-sm border border-gray-200 dark:border-gray-700 card-hover">
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">{group.name}</h3>
                      <span className={`text-xs px-2 py-0.5 rounded-full ${
                        group.type === "Public" ? "bg-green-100 dark:bg-green-900 text-green-700 dark:text-green-300" : "bg-purple-100 dark:bg-purple-900 text-purple-700 dark:text-purple-300"
                      }`}>{group.type}</span>
                    </div>
                    <span className="text-xs text-gray-400">ID: {group.id}</span>
                  </div>
                  <div className="space-y-2 text-sm text-gray-500 dark:text-gray-400">
                    <p>👥 {group.members} members</p>
                    <p>💬 {group.activity}</p>
                  </div>
                  <button onClick={() => handleJoinToggle(group.id)} className={`mt-4 w-full px-4 py-2 rounded-lg text-sm font-medium ${
                    isJoined
                      ? "border border-gray-300 dark:border-gray-600 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                      : "btn-primary bg-blue-600 hover:bg-blue-700 text-white"
                  }`}>
                    {isJoined ? "Joined ✅" : "Join Group"}
                  </button>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
