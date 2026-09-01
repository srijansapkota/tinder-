"use client";

import Link from "next/link";
import Image from "next/image";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import { formatTime } from "@/lib/helpers/format-time";
import { EmptyChat } from "@/components/chat/EmptyChat";
import { useChatDetails } from "@/lib/hooks/useChatDetails";

export default function ChatPage() {
  const { chats, loading } = useChatDetails();

  if (loading) {
    return <LoadingSpinner />;
  }

  if (chats.length === 0) {
    return <EmptyChat />;
  }

  return (
    <div className="min-h-screen bg-app-gradient">
      <div className="container mx-auto px-4 py-8">
        <header className="text-center mb-8">
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
            Messages
          </h1>
          <p className="text-gray-600 dark:text-gray-400">
            {chats.length} conversation{chats.length !== 1 ? "s" : ""}
          </p>
        </header>

        <div className="max-w-2xl mx-auto">
          <div className="bg-white dark:bg-gray-800 rounded-2xl shadow-lg overflow-hidden">
            {chats.map((chat, key) => (
              <Link
                key={key}
                href={`/chat/${chat.id}`}
                className="block hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors duration-200"
              >
                <div className="flex items-center p-6 border-b border-gray-200 dark:border-gray-700 last:border-b-0">
                  <div className="relative w-16 h-16 rounded-full overflow-hidden flex-shrink-0">
                    <Image
                      src={chat.user.avatar_url || "/default-avatar.png"}
                      alt={chat.user.full_name}
                      className="w-full h-full object-cover"
                      width={64}
                      height={64}
                    />
                    {chat.unreadCount > 0 && (
                      <div className="absolute -top-1 -right-1 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                        {chat.unreadCount}
                      </div>
                    )}
                  </div>

                  <div className="flex-1 min-w-0 ml-4">
                    <div className="flex items-center justify-between mb-1">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white truncate">
                        {chat.user.full_name}
                      </h3>
                      <span className="text-sm text-gray-500 dark:text-gray-400 flex-shrink-0">
                        {formatTime(chat.lastMessageTime)}
                      </span>
                    </div>

                    <p className="text-sm text-gray-600 dark:text-gray-400 truncate">
                      {chat.lastMessage}
                    </p>
                  </div>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
