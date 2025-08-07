import { ChevronLeft } from "lucide-react";
import { ThemeToggle } from "./ThemeToggle";

export default function Header() {

  return (
    <header className="bg-white dark:bg-[#1a1a1a] border-b border-gray-200 dark:border-[#262627] px-4 py-2 flex items-center justify-between">
      <div className="flex items-center space-x-3">
        <div className="text-gray-400 dark:text-gray-500">
          <span className="text-xs">ThriveChat</span>
        </div>
      </div>
      <div className="flex items-center">
        <ThemeToggle className="scale-75" />
      </div>
    </header>
  );
}
