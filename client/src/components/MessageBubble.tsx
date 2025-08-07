import { Message } from "@/pages/chat";
import { useAuth } from "@/contexts/AuthContext";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { FormattedMessage } from "./FormattedMessage";

interface MessageBubbleProps {
  message: Message;
}

export default function MessageBubble({ message }: MessageBubbleProps) {
  const isUser = message.sender === 'user';
  const { currentUser } = useAuth();

  const getInitials = (name: string) => {
    return name
      .split(' ')
      .map(word => word[0])
      .join('')
      .toUpperCase()
      .slice(0, 2);
  };

  return (
    <div className={`flex items-start space-x-3 message-enter ${isUser ? 'flex-row-reverse space-x-reverse' : ''}`}>
      {/* Avatar */}
      <div className="flex-shrink-0">
        {isUser ? (
          <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-gray-200 dark:border-gray-400">
            <Avatar className="h-10 w-10">
              <AvatarImage 
                src={currentUser?.photoURL || ''} 
                alt={currentUser?.displayName || 'User'} 
                className="w-full h-full object-cover"
              />
              <AvatarFallback className="text-sm">
                {currentUser?.displayName 
                  ? getInitials(currentUser.displayName)
                  : <User className="h-4 w-4" />
                }
              </AvatarFallback>
            </Avatar>
          </div>
        ) : (
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center">
            <div className="w-4 h-4 rounded-full bg-white/30"></div>
          </div>
        )}
      </div>

      {/* Message Content */}
      <div className={`flex flex-col ${isUser ? 'items-end' : 'items-start'}`}>
        {!isUser && (
          <div className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">NOVA 2.0</div>
        )}
        <div className={`max-w-2xl px-4 py-3 rounded-xl shadow-sm ${
          isUser 
            ? 'bg-teal-600 dark:bg-teal-500 text-white ml-16' 
            : 'bg-white dark:bg-[#262627] border border-gray-100 dark:border-[#3a3a3a] mr-16'
        }`}>
          <FormattedMessage text={message.text} isUser={isUser} />
        </div>
      </div>
    </div>
  );
}
