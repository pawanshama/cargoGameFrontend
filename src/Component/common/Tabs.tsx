import React from "react";

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
  return (
    <div className={`items-center justify-center rounded-[1.5rem] p-1 gap-1 mx-auto mb-4 bg-alternateBackground ${light ? 'grid grid-cols-4 max-w-[20.625rem] w-full' : 'flex w-max'}`}>
      {tabs.map((tab) => {
        const isActiveTab = activeTab === tab.index;
        const activeStyles = light
          ? "text-activeTab bg-white"
          : "text-textColor bg-activeTab";
        const inactiveStyles = "text-disabled bg-transparent";
        const tabStyles = isActiveTab
          ? `${activeStyles} rounded-[1.25rem] border border-secondary`
          : inactiveStyles;
        const className = light ? `cursor-pointer py-2 px-2 text-center textBold leading-[1.1875rem] ${tabStyles}` : `cursor-pointer py-2 px-4 w-[105px] text-center textBold leading-[1.1875rem] ${tabStyles}`;
        return (
          <button
            key={tab.index}
            type="button"
            onClick={() => onTabClick(tab.index)}
            className={className}
          >
            {tab.label}
          </button>
        );
      })}
    </div>
  );
};

export default HorizontalTabs;
