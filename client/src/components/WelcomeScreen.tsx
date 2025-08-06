import OptionCard from "./OptionCard";
import { useAuth } from "@/contexts/AuthContext";
import responseIcon from "@assets/image_1754417982620.png";
import kudosIcon from "@assets/image_1754418006394.png";
import surveyIcon from "@assets/image_1754418032540.png";

interface WelcomeScreenProps {
  onSelectOption: (text: string) => void | Promise<void>;
}

// Animated Teal Orb Component
function AnimatedTealOrb() {
  return (
    <div className="relative w-24 h-24">
      <div className="animated-teal-orb w-24 h-24">
        <div className="teal-circle"></div>
        <div className="teal-circle"></div>
        <div className="teal-circle"></div>
      </div>
      <div className="absolute inset-0 bg-teal-500/10 blur-xl rounded-full"></div>
    </div>
  );
}

export default function WelcomeScreen({ onSelectOption }: WelcomeScreenProps) {
  const { currentUser } = useAuth();
  
  const getUserFirstName = () => {
    if (currentUser?.displayName) {
      return currentUser.displayName.split(' ')[0];
    }
    return 'there';
  };

  const optionCards = [
    {
      icon: kudosIcon,
      title: "Tell about kudos",
      subtitle: "in thrive sparrow",
      text: "Tell me about kudos in thrive sparrow"
    },
    {
      icon: surveyIcon,
      title: "What is survey",
      subtitle: "Highlights",
      text: "What is survey Highlights?"
    },
    {
      icon: responseIcon,
      title: "What is Engage & Pulse",
      subtitle: "Surveys",
      text: "What is Engage & Pulse Surveys?"
    }
  ];

  return (
    <div className="flex flex-col items-center justify-center h-full max-w-3xl mx-auto px-8">
      {/* Animated Teal Orb */}
      <div className="relative mb-10">
        <AnimatedTealOrb />
      </div>
      
      {/* Greeting Text */}
      <div className="text-center mb-16">
        <h1 className="text-3xl font-medium text-gray-800 dark:text-gray-100 mb-3">
          Hi there, <span className="text-teal-600 dark:text-teal-400">{getUserFirstName()}</span>
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-300">How can I help you today?</p>
      </div>
      
      {/* Option Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-20 w-full max-w-xl">
        {optionCards.map((card, index) => (
          <OptionCard
            key={index}
            icon={card.icon}
            title={card.title}
            subtitle={card.subtitle}
            onClick={() => onSelectOption(card.text)}
          />
        ))}
      </div>
    </div>
  );
}
