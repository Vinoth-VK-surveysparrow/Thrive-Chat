import { useState, useEffect } from "react";
import { MessageSquare, Plus, Trash2 } from "lucide-react";
import { ChatService } from "@/lib/chatService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

interface Session {
  session_id: string;
  session_title: string;
  last_updated: string;
  conversation_count: number;
}

interface ConversationHistoryProps {
  currentSessionId?: string;
  onSelectSession: (sessionId: string) => void;
  onNewChat: () => void;
  isCollapsed: boolean;
}

export function ConversationHistory({ currentSessionId, onSelectSession, onNewChat, isCollapsed }: ConversationHistoryProps) {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  const fetchSessions = async () => {
    if (!currentUser?.email) return;

    try {
      setLoading(true);
      const response = await ChatService.getUserSessions(currentUser.email);
      setSessions(response.sessions);
    } catch (error) {
      console.error('Error fetching sessions:', error);
      toast({
        title: "Error",
        description: "Failed to load conversation history",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSessions();
  }, [currentUser?.email]);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffTime = Math.abs(now.getTime() - date.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));

    if (diffDays === 1) return 'Today';
    if (diffDays === 2) return 'Yesterday';
    if (diffDays <= 7) return `${diffDays} days ago`;
    return date.toLocaleDateString();
  };

  const truncateTitle = (title: string, maxLength: number = 25) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const handleSessionClick = (sessionId: string) => {
    onSelectSession(sessionId);
  };

  // Refresh sessions when a new session is created
  useEffect(() => {
    if (currentSessionId && !sessions.find(s => s.session_id === currentSessionId)) {
      fetchSessions();
    }
  }, [currentSessionId]);

  // Don't render if collapsed
  if (isCollapsed) {
    return null;
  }

  return (
    <div className="w-64 bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-[#262627] flex flex-col">
      {/* Header */}
      <div className="p-4 border-b border-gray-200 dark:border-[#262627]">
        <div className="flex items-center justify-between mb-3">
          <h2 className="text-sm font-semibold text-gray-800 dark:text-gray-200">Conversations</h2>
          <button
            onClick={onNewChat}
            className="p-1 hover:bg-gray-100 dark:hover:bg-[#262627] rounded transition-colors"
            title="New Chat"
          >
            <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
          </button>
        </div>
      </div>

      {/* Sessions List */}
      <div className="flex-1 overflow-y-auto">
        {loading ? (
          <div className="p-4">
            <div className="space-y-3">
              {[...Array(3)].map((_, i) => (
                <div key={i} className="animate-pulse">
                  <div className="h-4 bg-gray-200 dark:bg-gray-700 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 dark:bg-gray-700 rounded w-1/2"></div>
                </div>
              ))}
            </div>
          </div>
        ) : sessions.length === 0 ? (
          <div className="p-4 text-center">
            <MessageSquare className="w-8 h-8 text-gray-400 mx-auto mb-2" />
            <p className="text-sm text-gray-500 dark:text-gray-400">No conversations yet</p>
            <p className="text-xs text-gray-400 dark:text-gray-500 mt-1">Start a new chat to begin</p>
          </div>
        ) : (
          <div className="p-2">
            {sessions.map((session) => (
              <button
                key={session.session_id}
                onClick={() => handleSessionClick(session.session_id)}
                className={`w-full text-left p-3 rounded-lg mb-2 transition-colors hover:bg-gray-100 dark:hover:bg-[#262627] ${
                  currentSessionId === session.session_id
                    ? 'bg-teal-50 dark:bg-teal-900/20 border border-teal-200 dark:border-teal-800'
                    : 'bg-gray-50 dark:bg-[#1a1a1a]'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                      {truncateTitle(session.session_title)}
                    </p>
                    <div className="mt-1">
                      <span className="text-xs text-gray-500 dark:text-gray-400">
                        {formatDate(session.last_updated)}
                      </span>
                    </div>
                  </div>
                </div>
              </button>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 