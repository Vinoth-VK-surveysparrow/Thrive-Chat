interface ChatbotResponse {
  answer?: string;
  response?: string;
  message?: string;
  error?: string;
  session_id?: string;
  conversation_count?: number;
  max_conversations?: number;
  action?: string;
  current_session_id?: string;
}

interface ConversationHistoryResponse {
  user_email: string;
  session_id: string;
  conversations: Array<{
    question: string;
    answer: string;
    timestamp: string;
  }>;
  last_updated: string;
  conversation_count: number;
  session_title: string;
}

interface SessionListResponse {
  sessions: Array<{
    session_id: string;
    session_title: string;
    last_updated: string;
    conversation_count: number;
  }>;
  total_sessions: number;
  message: string;
}

export class ChatService {
  private static readonly API_BASE_URL = import.meta.env.VITE_API_BASE_URL;
  private static readonly ASK_ENDPOINT = '/ask-question';
  private static readonly GET_SESSIONS_ENDPOINT = '/get-sessions';
  private static readonly GET_CONVERSATION_HISTORY_ENDPOINT = '/get-conversation-history';

  // Generate a unique session ID
  static generateSessionId(): string {
    return crypto.randomUUID();
  }

  static async askQuestion(question: string, userEmail: string, sessionId?: string, sessionTitle?: string): Promise<{
    answer: string;
    sessionId: string;
    conversationCount: number;
    maxConversations: number;
    shouldCreateNewChat: boolean;
  }> {
    try {
      const response = await fetch(`${this.API_BASE_URL}${this.ASK_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          question: question.trim(),
          user_email: userEmail,
          session_id: sessionId,
          ...(sessionTitle && { session_title: sessionTitle })
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ChatbotResponse = await response.json();
      
      // Handle session maxed out case
      if (data.action === 'create_new_chat') {
        return {
          answer: data.message || 'Maximum conversations reached for this session. Please create a new chat.',
          sessionId: data.current_session_id || sessionId || '',
          conversationCount: 15,
          maxConversations: 15,
          shouldCreateNewChat: true
        };
      }

      // Handle different possible response formats
      const botResponse = data.answer || data.response || data.message;
      
      if (!botResponse) {
        throw new Error('No valid response received from the chatbot');
      }

      return {
        answer: botResponse,
        sessionId: data.session_id || sessionId || this.generateSessionId(),
        conversationCount: data.conversation_count || 1,
        maxConversations: data.max_conversations || 15,
        shouldCreateNewChat: false
      };
    } catch (error) {
      console.error('Error calling chatbot API:', error);
      
      // Return a user-friendly error message
      if (error instanceof Error) {
        if (error.message.includes('Failed to fetch')) {
          throw new Error("I'm having trouble connecting to the server. Please check your internet connection and try again.");
        } else if (error.message.includes('HTTP error')) {
          throw new Error("The chatbot service is temporarily unavailable. Please try again in a moment.");
        }
        throw new Error(`Sorry, I encountered an error: ${error.message}`);
      }
      
      throw new Error("I'm experiencing some technical difficulties. Please try asking your question again.");
    }
  }

  static async getUserSessions(userEmail: string): Promise<SessionListResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}${this.GET_SESSIONS_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: userEmail
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: SessionListResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching user sessions:', error);
      throw new Error('Failed to fetch conversation history');
    }
  }

  static async getConversationHistory(userEmail: string, sessionId: string): Promise<ConversationHistoryResponse> {
    try {
      const response = await fetch(`${this.API_BASE_URL}${this.GET_CONVERSATION_HISTORY_ENDPOINT}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_email: userEmail,
          session_id: sessionId
        }),
      });

      if (!response.ok) {
        if (response.status === 404) {
          throw new Error('Conversation history not found for the specified session');
        }
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data: ConversationHistoryResponse = await response.json();
      return data;
    } catch (error) {
      console.error('Error fetching conversation history:', error);
      throw new Error('Failed to fetch conversation history');
    }
  }
} 