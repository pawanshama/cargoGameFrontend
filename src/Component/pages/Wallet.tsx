import React, { useState, useEffect } from "react";

import Header from "../includes/Header";
import Footer from "../includes/Footer";
import Success from "../modals/Success";
import Deposit from "../wallet/Deposit";
import Withdraw from "../wallet/Withdraw";
import HorizontalTabs from "../common/Tabs";
import { useTonWallet } from "@tonconnect/ui-react";
import { Address } from "@ton/core";

const Wallet = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputValues, setInputValues] = useState<{ [key: string]: string }>({
    amount: "",
  });

  useEffect(() => {
  // Hack de repaint pour Telegram WebView mobile
  const el = document.body;
  el.style.display = "none";
  void el.offsetHeight;
  el.style.display = "";
}, [activeTab]);


  const [refreshCounter, setRefreshCounter] = useState(0);
  const triggerRefresh = () => setRefreshCounter((prev) => prev + 1);

  const handleInputChange =
    (key: string) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setInputValues({
        ...inputValues,
        [key]: e.target.value,
      });
    };

  const handleWithdrawSuccess = () => {
    setIsSuccess(true);
    setInputValues({ amount: "" });
  };

  const wallet = useTonWallet();

  const tabs = [
    { label: "Deposit", index: 0 },
    { label: "Withdraw", index: 1 },
  ];

  return (
    <>
      <div className="w-full overflow-hidden">
        <Header pageHeading="My Wallet" refreshTrigger={refreshCounter} />
        <div className="px-4 pt-6 pb-[7.5rem] h-[calc(100dvh_-_clamp(6rem,60vw,8.25rem))] overflow-y-auto overflow-x-hidden relative">
          {/* ✅ Afficher uniquement si le wallet est connecté */}
          {wallet?.account?.address && (
            <p className="hidden text-sm text-center text-gray-300 mb-4">
              Connected address:{" "}
              <span className="font-mono break-all">
                {Address.parse(wallet.account.address).toString({
                  bounceable: false,
                  testOnly: false,
                })}
              </span>
            </p>
          )}

          <HorizontalTabs
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={setActiveTab}
          />

          <div>
            {activeTab === 0 ? (
              <Deposit refreshWallet={triggerRefresh} />
            ) : activeTab === 1 ? (
              <Withdraw
                inputValues={inputValues}
                handleInputChange={handleInputChange}
                handleWithdraw={handleWithdrawSuccess}
                refreshWallet={triggerRefresh}
              />
            ) : null}
          </div>

          <Footer />
        </div>
      </div>

      {isSuccess && (
        <Success isSuccess={isSuccess} setIsSuccess={setIsSuccess} />
      )}
    </>
  );
};

export default Wallet;
