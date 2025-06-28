import React, { useState } from "react";

interface Tab {
  label: string;
  index: number;
}

interface HorizontalTabsProps {
  tabs: Tab[];
  activeTab: number;
  onTabClick: (index: number) => void;
  light?: boolean;
}

const HorizontalTabs: React.FC<HorizontalTabsProps> = ({
  tabs,
  activeTab,
  onTabClick,
  light = false,
}) => {
  const [clickedIndex, setClickedIndex] = useState<number | null>(null);

  const playClickSound = () => {
    const audio = new Audio("/assets/sounds/6Downmenu.mp3");
    audio.volume = 0.6; // Optionnel : ajuste le volume
    audio.play().catch((e) => {
      console.error("Erreur lors de la lecture du son :", e);
    });
  };

  const handleClick = (index: number) => {
    setClickedIndex(index);
    onTabClick(index);
    playClickSound(); // 🔊 Lecture du son ici
    setTimeout(() => setClickedIndex(null), 150);
  };

  return (
    <div
      className={`items-center justify-center rounded-[1.5rem] p-1 gap-1 mx-auto mb-4 bg-alternateBackground ${
        light ? "grid grid-cols-4 max-w-[20.625rem] w-full" : "flex w-max"
      }`}
    >
      {tabs.map((tab) => {
        const isActiveTab = activeTab === tab.index;
        const activeStyles = light
          ? "text-activeTab bg-white"
          : "text-textColor bg-activeTab";
        const inactiveStyles = "text-disabled bg-transparent";
        const tabStyles = isActiveTab
          ? `${activeStyles} rounded-[1.25rem] border border-secondary`
          : inactiveStyles;

        const baseClass = light
          ? "cursor-pointer py-2 px-2 text-center textBold leading-[1.1875rem]"
          : "cursor-pointer py-2 px-4 w-[105px] text-center textBold leading-[1.1875rem]";

        const animationClass =
          clickedIndex === tab.index ? "scale-95" : "scale-100";

        return (
          <button
            key={tab.index}
            type="button"
            onClick={() => handleClick(tab.index)}
            className={`${baseClass} ${tabStyles} transform transition duration-150 ease-in-out ${animationClass}`}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default HorizontalTabs;
