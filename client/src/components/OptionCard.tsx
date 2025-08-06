interface OptionCardProps {
  emoji?: string;
  icon?: string;
  title: string;
  subtitle: string;
  onClick: () => void;
}

export default function OptionCard({ emoji, icon, title, subtitle, onClick }: OptionCardProps) {
  return (
    <div 
      onClick={onClick}
      className="option-card bg-white dark:bg-[#262627] rounded-xl p-4 border border-gray-100 dark:border-[#3a3a3a] cursor-pointer"
    >
      <div className="flex items-center justify-center w-8 h-8 bg-teal-50 dark:bg-white rounded-lg mb-3">
        {icon ? (
          <img src={icon} alt={title} className="w-5 h-5 object-contain" />
        ) : (
          <span className="text-lg">{emoji}</span>
        )}
      </div>
      <h3 className="font-medium text-sm text-gray-800 dark:text-gray-100 mb-1">{title}</h3>
      <p className="text-xs text-gray-600 dark:text-gray-300">{subtitle}</p>
    </div>
  );
}
