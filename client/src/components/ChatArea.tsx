import { useEffect, useRef } from "react";
import WelcomeScreen from "./WelcomeScreen";
import MessageBubble from "./MessageBubble";
import TypingIndicator from "./TypingIndicator";
import InputBar from "./InputBar";
import { Message } from "@/pages/chat";

interface ChatAreaProps {
  messages: Message[];
  isTyping: boolean;
  showWelcome: boolean;
  onSendMessage: (text: string) => void | Promise<void>;
}

export default function ChatArea({ messages, isTyping, showWelcome, onSendMessage }: ChatAreaProps) {
  const chatContainerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }
  }, [messages, isTyping]);

  return (
    <div className="flex-1 flex flex-col overflow-hidden">
      {/* Chat Messages Container */}
      <div 
        ref={chatContainerRef}
        className="flex-1 overflow-y-auto px-6 py-8"
      >
        {showWelcome ? (
          <WelcomeScreen onSelectOption={onSendMessage} />
        ) : (
          <div className="max-w-3xl mx-auto space-y-6">
            {messages.map((message) => (
              <MessageBubble key={message.id} message={message} />
            ))}
            {isTyping && <TypingIndicator />}
          </div>
        )}
      </div>
      
      <InputBar onSendMessage={onSendMessage} disabled={isTyping} />
    </div>
  );
}
