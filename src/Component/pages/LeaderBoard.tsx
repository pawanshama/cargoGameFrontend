import { useState } from "react";
import HorizontalTabs from "../common/Tabs";
import Footer from "../includes/Footer";
import Header from "../includes/Header";
import InnerTab from "../leaderBoard/InnerTab";

const LeaderBoard = () => {
  const [activeTab, setActiveTab] = useState(0);
  const tabs = [
    { label: "All Time", index: 0 },
    { label: "Daily", index: 1 },
    { label: "Weekly", index: 2 },
    { label: "Monthly", index: 3 },
  ];

  return (
    <div className="w-full">
      <Header pageHeading="Leaderboard" />
      <div className="px-4 pt-2 pb-[7.5rem] h-[calc(100dvh_-_clamp(6rem,60vw,8.25rem))] overflow-y-auto">
        <HorizontalTabs
          tabs={tabs}
          activeTab={activeTab}
          onTabClick={setActiveTab}
          light
        />
        <div>
          {activeTab === 0 && <InnerTab />}
          {activeTab === 1 && <InnerTab />}
          {activeTab === 2 && <InnerTab />}
          {activeTab === 3 && <InnerTab />}
        </div>
      </div>
      <Footer />
    </div>
  );
};

export default LeaderBoard;
