export default function TypingIndicator() {
  return (
    <div className="flex items-start space-x-3 message-enter">
      {/* Bot Avatar */}
      <div className="w-10 h-10 rounded-full bg-gradient-to-br from-teal-500 to-teal-600 flex items-center justify-center flex-shrink-0">
        <div className="w-4 h-4 rounded-full bg-white/30"></div>
      </div>

      {/* Typing Content */}
      <div className="flex flex-col items-start">
        <div className="text-sm font-medium text-gray-800 dark:text-gray-100 mb-1">ThriveChat</div>
        <div className="max-w-md px-3 py-2 rounded-xl bg-white dark:bg-[#262627] border border-gray-100 dark:border-[#3a3a3a] mr-16 shadow-sm">
          <div className="typing-dots">
            <span></span>
            <span></span>
            <span></span>
          </div>
        </div>
      </div>
    </div>
  );
}
