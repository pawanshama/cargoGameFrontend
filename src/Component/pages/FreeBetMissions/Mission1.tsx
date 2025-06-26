import React from "react";
import Mission1BeforeDeposit from "./Mission1BeforeDeposit";
import Mission1AfterDeposit from "./Mission1AfterDeposit";

interface Mission1Props {
  onBack: () => void;
  onCollect: () => void;
  hasDeposited?: boolean;
  depositAmount?: number;
}

const Mission1: React.FC<Mission1Props> = ({ onBack, onCollect, hasDeposited, depositAmount }) => {
  const handleCollect = () => {
    // Ensure depositAmount is provided before calling onCollect
    if (depositAmount !== undefined && depositAmount !== null) {
      onCollect(); // Trigger the collect function passed from parent
    } else {
      console.error("❌ Deposit amount is not available");
    }
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-b from-[#160028] via-[#1c0934] to-[#2b1048] pb-28 overflow-hidden">
      {/* Conditional rendering based on deposit status */}
      {hasDeposited ? (
        // Mission 1 After Deposit
        <Mission1AfterDeposit
          onBack={onBack}
          onCollect={handleCollect}
          depositAmount={depositAmount || 0} // Default to 0 if depositAmount is undefined
        />
      ) : (
        // Mission 1 Before Deposit
        <Mission1BeforeDeposit onBack={onBack} />
      )}
    </div>
  );
};

export default Mission1;
