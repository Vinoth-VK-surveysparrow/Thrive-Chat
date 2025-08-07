import { useState, useEffect } from "react";
import Sidebar from "@/components/Sidebar";
import Header from "@/components/Header";
import ChatArea from "@/components/ChatArea";
import { ConversationHistory } from "@/components/ConversationHistory";
import { ChatService } from "@/lib/chatService";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/hooks/use-toast";

export interface Message {
  id: string;
  text: string;
  sender: 'user' | 'bot';
  timestamp: Date;
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>([]);
  const [isTyping, setIsTyping] = useState(false);
  const [showWelcome, setShowWelcome] = useState(true);
  const [currentSessionId, setCurrentSessionId] = useState<string | undefined>();
  const [conversationCount, setConversationCount] = useState(0);
  const [maxConversations] = useState(15);
  const [isHistoryVisible, setIsHistoryVisible] = useState(false);
  const [historyHoverTimeout, setHistoryHoverTimeout] = useState<NodeJS.Timeout | null>(null);
  const { currentUser } = useAuth();
  const { toast } = useToast();

  // Helper function to generate session title from first query
  const generateSessionTitle = (query: string): string => {
    const words = query.trim().split(' ');
    const firstFewWords = words.slice(0, 6).join(' '); // Take first 6 words
    return firstFewWords.length > 50 ? firstFewWords.substring(0, 47) + '...' : firstFewWords;
  };

  const addMessage = (text: string, sender: 'user' | 'bot') => {
    const newMessage: Message = {
      id: Date.now().toString(),
      text,
      sender,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, newMessage]);
  };

  const sendMessage = async (text: string) => {
    if (!text.trim() || isTyping || !currentUser?.email) return;

    // Hide welcome screen
    if (showWelcome) {
      setShowWelcome(false);
    }

    // Add user message
    addMessage(text, 'user');

    // Show typing indicator
    setIsTyping(true);

    try {
      // Generate session title from first message if this is a new session
      const isFirstMessage = !currentSessionId || conversationCount === 0;
      const sessionTitle = isFirstMessage ? generateSessionTitle(text) : undefined;
      
      console.log('Session Title Debug:', {
        isFirstMessage,
        currentSessionId,
        conversationCount,
        text,
        sessionTitle
      });
      
      // Get real chatbot response
      const response = await ChatService.askQuestion(text, currentUser.email, currentSessionId, sessionTitle);
      
      // Handle session maxed out
      if (response.shouldCreateNewChat) {
        toast({
          title: "Session Limit Reached",
          description: "Maximum conversations reached for this session. Starting a new chat.",
          variant: "default",
        });
        handleNewChat();
        setIsTyping(false);
        return;
      }

      // Update session info
      setCurrentSessionId(response.sessionId);
      setConversationCount(response.conversationCount);
      
      setIsTyping(false);
      addMessage(response.answer, 'bot');
    } catch (error) {
      console.error('Error getting bot response:', error);
      setIsTyping(false);
      addMessage(
        error instanceof Error 
          ? error.message 
          : "I'm sorry, I'm having trouble processing your request right now. Please try again.", 
        'bot'
      );
    }
  };

  const handleNewChat = () => {
    setMessages([]);
    setShowWelcome(true);
    setIsTyping(false);
    setCurrentSessionId(undefined);
    setConversationCount(0);
  };

  const handleSidebarMouseEnter = () => {
    if (historyHoverTimeout) {
      clearTimeout(historyHoverTimeout);
      setHistoryHoverTimeout(null);
    }
    setIsHistoryVisible(true);
  };

  const handleSidebarMouseLeave = (e: React.MouseEvent) => {
    // Check if mouse is moving towards the history panel
    const relatedTarget = e.relatedTarget as Element;
    if (relatedTarget && (
      relatedTarget.closest('[data-conversation-history]') ||
      relatedTarget.closest('[data-history-panel]')
    )) {
      return; // Don't hide if moving to history panel
    }

    const timeout = setTimeout(() => {
      setIsHistoryVisible(false);
    }, 150); // Reduced from 300ms for better responsiveness
    setHistoryHoverTimeout(timeout);
  };

  const handleHistoryBarMouseEnter = () => {
    if (historyHoverTimeout) {
      clearTimeout(historyHoverTimeout);
      setHistoryHoverTimeout(null);
    }
  };

  const handleHistoryBarMouseLeave = (e: React.MouseEvent) => {
    // Don't hide if leaving to interact with a dropdown menu or moving back to sidebar
    const relatedTarget = e.relatedTarget as Element;
    if (relatedTarget && (
      relatedTarget.closest('[data-radix-popper-content-wrapper]') ||
      relatedTarget.closest('[role="menu"]') ||
      relatedTarget.closest('[data-conversation-history]') ||
      relatedTarget.closest('.w-12') // sidebar class
    )) {
      return;
    }

    const timeout = setTimeout(() => {
      setIsHistoryVisible(false);
    }, 150); // Reduced timeout for better responsiveness
    setHistoryHoverTimeout(timeout);
  };

  // Cleanup timeout on unmount
  useEffect(() => {
    return () => {
      if (historyHoverTimeout) {
        clearTimeout(historyHoverTimeout);
      }
    };
  }, [historyHoverTimeout]);

  const handleSelectSession = async (sessionId: string) => {
    if (!currentUser?.email) return;

    try {
      setIsTyping(true);
      const response = await ChatService.getConversationHistory(currentUser.email, sessionId);
      
      console.log('Loaded conversation history:', {
        sessionId,
        sessionTitle: response.session_title,
        conversationCount: response.conversation_count
      });
      
      // Convert conversation history to messages
      const historyMessages: Message[] = [];
      response.conversations.forEach((conv, index) => {
        historyMessages.push({
          id: `${sessionId}-q-${index}`,
          text: conv.question,
          sender: 'user',
          timestamp: new Date(conv.timestamp)
        });
        historyMessages.push({
          id: `${sessionId}-a-${index}`,
          text: conv.answer,
          sender: 'bot',
          timestamp: new Date(conv.timestamp)
        });
      });

      setMessages(historyMessages);
      setCurrentSessionId(sessionId);
      setConversationCount(response.conversation_count);
      setShowWelcome(false);
      setIsTyping(false);
    } catch (error) {
      console.error('Error loading conversation:', error);
      setIsTyping(false);
      toast({
        title: "Error",
        description: "Failed to load conversation history",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="flex h-screen bg-gray-50 dark:bg-[#1a1a1a] relative">
      <Sidebar 
        onNewChat={handleNewChat} 
        onSidebarMouseEnter={handleSidebarMouseEnter}
        onSidebarMouseLeave={handleSidebarMouseLeave}
        isHistoryVisible={isHistoryVisible}
      />
      
      {/* Buffer zone for smooth transition */}
      {isHistoryVisible && (
        <div 
          className="absolute left-11 top-0 h-full w-2 z-10"
          onMouseEnter={handleHistoryBarMouseEnter}
          onMouseLeave={handleHistoryBarMouseLeave}
        />
      )}
      
      {/* Overlay History Panel */}
      <div 
        data-history-panel
        onMouseEnter={handleHistoryBarMouseEnter}
        onMouseLeave={handleHistoryBarMouseLeave}
        className={`absolute left-12 top-0 h-full z-20 transition-all duration-200 ${
          isHistoryVisible ? 'translate-x-0 opacity-100' : '-translate-x-full opacity-0 pointer-events-none'
        }`}
        style={{ width: '260px' }}
      >
        <ConversationHistory 
          currentSessionId={currentSessionId}
          onSelectSession={handleSelectSession}
          onNewChat={handleNewChat}
          isVisible={isHistoryVisible}
        />
      </div>
      
      <div className="flex-1 flex flex-col">
        <Header />
        <ChatArea
          messages={messages}
          isTyping={isTyping}
          showWelcome={showWelcome}
          onSendMessage={sendMessage}
        />
      </div>
    </div>
  );
}
