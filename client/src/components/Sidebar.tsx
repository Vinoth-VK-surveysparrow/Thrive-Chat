import { Plus, Clock, Settings, Zap, History } from "lucide-react";
import { UserProfile } from "./UserProfile";

interface SidebarProps {
  onNewChat: () => void;
  onToggleHistory: () => void;
  isHistoryVisible: boolean;
}

export default function Sidebar({ onNewChat, onToggleHistory, isHistoryVisible }: SidebarProps) {
  return (
    <div className="w-12 bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-[#262627] flex flex-col items-center py-2">
      {/* SurveySparrow Logo */}
      <div className="w-8 h-8 rounded-md bg-teal-500 hover:bg-teal-600 transition-colors relative flex items-center justify-center mb-4">
        <Zap className="text-white" size={14} />
      </div>
      
      {/* Navigation Icons */}
      <div className="flex flex-col space-y-2 mb-auto">
        <button 
          onClick={onNewChat}
          className="w-8 h-8 rounded-md bg-gray-100 dark:bg-[#262627] hover:bg-gray-200 dark:hover:bg-[#3a3a3a] flex items-center justify-center transition-colors"
          title="New Chat"
        >
          <Plus className="text-gray-600 dark:text-gray-300" size={12} />
        </button>
        <button 
          onClick={onToggleHistory}
          className={`w-8 h-8 rounded-md flex items-center justify-center transition-colors ${
            isHistoryVisible 
              ? 'bg-teal-100 dark:bg-teal-900/30 hover:bg-teal-200 dark:hover:bg-teal-900/50' 
              : 'hover:bg-gray-100 dark:hover:bg-[#3a3a3a]'
          }`}
          title="Toggle Conversation History"
        >
          <History className={`${
            isHistoryVisible 
              ? 'text-teal-600 dark:text-teal-400' 
              : 'text-gray-500 dark:text-gray-400'
          }`} size={12} />
        </button>
        <button className="w-8 h-8 rounded-md hover:bg-gray-100 dark:hover:bg-[#3a3a3a] flex items-center justify-center transition-colors"
          title="Settings">
          <Settings className="text-gray-500 dark:text-gray-400" size={12} />
        </button>
      </div>
      
      {/* User Profile */}
      <UserProfile />
    </div>
  );
}
