// ChatLayout.jsx
import React, { useState } from "react";
import { FaUserCircle, FaBell, FaTimes } from "react-icons/fa";
import IsLogin from "./IsLogin";
/**
 * Sidebar (left)
 */
const ChatSidebar = ({ user, onSelectChat, activeTab }) => (
    <aside className="w-80 bg-white flex flex-col border-r border-gray-200">
        <div className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-2">
                <span className="font-bold text-lg">Chat App</span>
            </div>
            <button className="text-gray-500 hover:text-black" aria-label="Menu">
                <FaUserCircle />
            </button>
        </div>

        <div className="flex">
            <button
                onClick={() => onSelectChat("messages")}
                className={`flex-1 text-center py-3 font-semibold ${activeTab === "messages" ? "text-black border-b-2 border-black" : "text-gray-500"
                    }`}
            >
                Tin nhắn
            </button>
            <button
                onClick={() => onSelectChat("friends")}
                className={`flex-1 text-center py-3 font-semibold ${activeTab === "friends" ? "text-black border-b-2 border-black" : "text-gray-500"
                    }`}
            >
                Bạn bè
            </button>
        </div>

        <div className="flex-1 overflow-y-auto p-2">
            <ul>
                <li className="flex items-center gap-3 p-3 cursor-pointer rounded hover:bg-gray-100">
                    <img
                        src={user?.avatar || "https://via.placeholder.com/150"}
                        alt={user?.name || "avatar"}
                        className="w-12 h-12 rounded-full object-cover"
                    />
                    <div>
                        <p className="font-semibold">{user?.name || "Người dùng"}</p>
                        <p className="text-sm text-gray-500">Tin nhắn mới</p>
                    </div>
                </li>
            </ul>
        </div>
    </aside>
);

/**
 * Settings panel (right)
 * - Khi open === false thì width = 0 và nội dung không render -> tránh lỗi layout
 */
const ChatSettingsPanel = ({ user, open, onClose }) => (
    <aside
        className={`bg-gray-900 text-white border-l border-gray-700 transition-all duration-300 ${open ? "w-80" : "w-0 overflow-hidden"
            }`}
    >
        {open && (
            <div className="p-4 flex flex-col">
                <div className="flex justify-between items-center">
                    <h2 className="font-bold text-lg">Cài đặt chi tiết</h2>
                    <button onClick={onClose} className="text-gray-300 hover:text-gray-100" aria-label="Đóng">
                        <FaTimes />
                    </button>
                </div>

                <div className="flex flex-col items-center my-6">
                    <img
                        src={user?.avatar || "https://via.placeholder.com/150"}
                        alt={user?.name || "avatar"}
                        className="w-20 h-20 rounded-full mb-2"
                    />
                    <p className="font-semibold">{user?.name || "Người dùng"}</p>
                </div>

                <div className="space-y-2">
                    <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 w-full">
                        <FaUserCircle className="text-gray-400" />
                        <span>Xem hồ sơ</span>
                    </button>

                    <button className="flex items-center gap-3 p-2 rounded hover:bg-gray-800 w-full">
                        <FaBell className="text-gray-400" />
                        <span>Tắt thông báo</span>
                    </button>

                    <div className="border-t border-gray-700 mt-4 pt-4 text-gray-400 space-y-1">
                        <button className="w-full text-left py-2 hover:text-white">Chặn</button>
                        <button className="w-full text-left py-2 hover:text-white">Báo cáo</button>
                    </div>
                </div>
            </div>
        )}
    </aside>
);

/**
 * Main chat window (center)
 */
const ChatWindow = ({ user, onOpenSettings }) => (
    <main className="flex-1 flex flex-col bg-white">
        <header className="flex justify-between items-center p-4 border-b">
            <div className="flex items-center gap-3">
                <img
                    src={user?.avatar || "https://via.placeholder.com/150"}
                    alt={user?.name || "avatar"}
                    className="w-10 h-10 rounded-full"
                />
                <div>
                    <p className="font-semibold">{user?.name || "Người dùng"}</p>
                    <p className="text-sm text-gray-500">Online</p>
                </div>
            </div>

            <div className="flex gap-4">
                <button onClick={onOpenSettings} className="text-gray-500 hover:text-black" aria-label="Open settings">
                    <FaUserCircle />
                </button>
                <button className="text-gray-500 hover:text-black" aria-label="Notifications">
                    <FaBell />
                </button>
            </div>
        </header>

        <div className="flex-1 p-6 overflow-y-auto bg-gray-50">
            <div className="flex justify-end mb-4">
                <div className="max-w-xs bg-blue-500 text-white p-3 rounded-xl shadow">
                    <p>Xin chào!</p>
                    <span className="block text-xs text-blue-200 text-right mt-1">10:30 AM</span>
                </div>
            </div>
        </div>

        <div className="flex items-center gap-2 p-4 border-t">
            <input
                type="text"
                placeholder="Nhập tin nhắn..."
                className="flex-1 bg-gray-100 rounded-full px-4 py-2 text-sm focus:outline-none"
            />
            <button className="bg-blue-500 text-white px-4 py-2 rounded-full hover:bg-blue-600">Gửi</button>
        </div>
    </main>
);

/**
 * Export default layout
 */
export default function ChatLayout({ user }) {
    const [activeTab, setActiveTab] = useState("messages");
    const [settingsOpen, setSettingsOpen] = useState(false);

    return (
        <>
            <IsLogin />
            <div className="flex h-screen bg-gray-50 overflow-hidden">
                <ChatSidebar user={user} onSelectChat={setActiveTab} activeTab={activeTab} />

                <div className="flex-1 flex">
                    <ChatWindow user={user} onOpenSettings={() => setSettingsOpen(true)} />
                    <ChatSettingsPanel user={user} open={settingsOpen} onClose={() => setSettingsOpen(false)} />
                </div>
            </div>
        </>

    );
}
