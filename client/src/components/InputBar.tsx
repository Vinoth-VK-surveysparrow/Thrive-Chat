import { useState } from "react";
import { Send } from "lucide-react";

interface InputBarProps {
  onSendMessage: (text: string) => void;
  disabled?: boolean;
}

export default function InputBar({ onSendMessage, disabled }: InputBarProps) {
  const [message, setMessage] = useState("");

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !disabled) {
      onSendMessage(message);
      setMessage("");
    }
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <div className="px-6 pb-12">
      <div className="max-w-xl mx-auto mb-8">
        <form onSubmit={handleSubmit} className="relative">
          <input 
            type="text" 
            placeholder="Ask me anything..."
            value={message}
            onChange={(e) => setMessage(e.target.value)}
            onKeyPress={handleKeyPress}
            disabled={disabled}
            className="w-full bg-white dark:bg-[#262627] border border-gray-200 dark:border-[#3a3a3a] rounded-lg px-3 py-2 pr-10 focus:outline-none focus:ring-2 focus:ring-teal-500 focus:border-transparent transition-all disabled:opacity-50 disabled:cursor-not-allowed text-sm text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400"
          />
          <button 
            type="submit"
            disabled={!message.trim() || disabled}
            className="absolute right-2 top-1/2 transform -translate-y-1/2 w-6 h-6 bg-teal-500 hover:bg-teal-600 disabled:bg-gray-300 disabled:cursor-not-allowed rounded-md flex items-center justify-center transition-colors"
          >
            <Send className="text-white" size={12} />
          </button>
        </form>
      </div>
    </div>
  );
}
