import { useState, useEffect } from "react";
import { MessageSquare, Plus, MoreHorizontal, Trash2 } from "lucide-react";
import { ChatService } from "@/lib/chatService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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
  isVisible: boolean;
}

export function ConversationHistory({ currentSessionId, onSelectSession, onNewChat, isVisible }: ConversationHistoryProps) {
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

  const truncateTitle = (title: string, maxLength: number = 30) => {
    if (title.length <= maxLength) return title;
    return title.substring(0, maxLength) + '...';
  };

  const handleSessionClick = (sessionId: string) => {
    onSelectSession(sessionId);
  };

  const handleDeleteSession = async (sessionId: string, sessionTitle: string) => {
    if (!currentUser?.email) return;

    try {
      await ChatService.deleteSession(currentUser.email, sessionId);
      toast({
        title: "Session Deleted",
        description: `"${sessionTitle}" has been deleted`,
      });
      // Refresh sessions list
      fetchSessions();
      // If deleted session was current, start new chat
      if (currentSessionId === sessionId) {
        onNewChat();
      }
    } catch (error) {
      console.error('Error deleting session:', error);
      toast({
        title: "Error",
        description: "Failed to delete conversation",
        variant: "destructive",
      });
    }
  };

  // Refresh sessions when a new session is created
  useEffect(() => {
    if (currentSessionId && !sessions.find(s => s.session_id === currentSessionId)) {
      fetchSessions();
    }
  }, [currentSessionId]);

  // Don't render if not visible
  if (!isVisible) {
    return null;
  }

  return (
    <div className="w-full h-full bg-white dark:bg-[#111111] border-r border-gray-200 dark:border-[#262627] flex flex-col shadow-lg">
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
      <div className="flex-1 overflow-y-auto" data-conversation-history>
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
              <div
                key={session.session_id}
                className={`group relative rounded-lg mb-1 transition-colors ${
                  currentSessionId === session.session_id
                    ? 'bg-gray-200 dark:bg-gray-700 border border-gray-300 dark:border-gray-600'
                    : 'bg-gray-50 dark:bg-[#1a1a1a] hover:bg-gray-100 dark:hover:bg-[#262627]'
                }`}
              >
                <div className="flex items-center">
                  <button
                    onClick={() => handleSessionClick(session.session_id)}
                    className="flex-1 text-left p-2 rounded-lg"
                  >
                    <div className="flex-1 min-w-0 pr-8">
                      <p className="text-xs font-medium text-gray-900 dark:text-gray-100 truncate leading-tight">
                        {truncateTitle(session.session_title)}
                      </p>
                    </div>
                  </button>
                  
                  <div className="absolute top-1 right-1 z-10">
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <button
                          className="p-1 opacity-0 group-hover:opacity-100 hover:bg-gray-200 dark:hover:bg-gray-600 rounded transition-all"
                          onClick={(e) => {
                            e.stopPropagation();
                            e.preventDefault();
                          }}
                          onMouseDown={(e) => e.stopPropagation()}
                        >
                          <MoreHorizontal className="w-3 h-3 text-gray-500 dark:text-gray-400" />
                        </button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent 
                        align="end" 
                        className="w-32"
                        onCloseAutoFocus={(e) => e.preventDefault()}
                        onInteractOutside={(e) => {
                          // Don't close dropdown when clicking within the conversation history area
                          const target = e.target as Element;
                          if (target.closest('[data-conversation-history]')) {
                            e.preventDefault();
                          }
                        }}
                      >
                        <DropdownMenuItem
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteSession(session.session_id, session.session_title);
                          }}
                          className="text-red-600 dark:text-red-400 focus:text-red-600 focus:bg-red-50 dark:focus:bg-red-900/20 cursor-pointer"
                        >
                          <Trash2 className="w-3 h-3 mr-2" />
                          Delete
                        </DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
} 