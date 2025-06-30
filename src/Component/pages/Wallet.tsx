/* --------------------------------------------------------------------------
   src/Component/pages/Wallet/Wallet.tsx
   -------------------------------------------------------------------------- */

import { useState } from "react";
import Header     from "../includes/Header";
import Footer     from "../includes/Footer";
import Success    from "../modals/Success";
import Deposit    from "../wallet/Deposit";
import Withdraw   from "../wallet/Withdraw";
import Tabs       from "../common/Tabs";
import { useTonWallet, useTonConnectUI } from "@tonconnect/ui-react";
import { Address } from "@ton/core";
import { motion, AnimatePresence } from "framer-motion";

/* ---------- internal types ---------- */
interface Tab {
  label: string;
  index: number;
}

const Wallet: React.FC = () => {
  /* ---------------- UI state ---------------- */
  const [activeTab, setActiveTab] = useState<0 | 1>(0);
  const [isSuccess, setIsSuccess] = useState(false);
  const [inputs, setInputs]       = useState({ amount: "" });

  /* ---------------- TON wallet ---------------- */
  const wallet  = useTonWallet();
  const [tonUI] = useTonConnectUI();
  const connected = !!wallet?.account?.address;
  const friendly  = connected
    ? Address.parse(wallet.account.address).toString({
        bounceable: false,
        testOnly : false,
      })
    : "";

  /* ---------------- callbacks ---------------- */
  const onInput =
    (k: string) => (e: React.ChangeEvent<HTMLInputElement>) =>
      setInputs((prev) => ({ ...prev, [k]: e.target.value }));

  const onWithdrawSuccess = () => {
    setIsSuccess(true);
    setInputs({ amount: "" });
  };

  /* ---------------- tabs config ---------------- */
  const tabs: Tab[] = [
    { label: "Deposit",  index: 0 },
    { label: "Withdraw", index: 1 },
  ];

  /* --------------------------------------------------------------------- */
  return (
    <>
      <div className="w-full overflow-hidden">
        <Header pageHeading="My Wallet" />

        <div className="px-4 pt-6 pb-[7.5rem] h-[calc(100dvh_-_clamp(6rem,60vw,8.25rem))] overflow-y-auto">
          {/* ===== wallet connect bloc ===== */}
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            className="bg-[#1e1b2f]/70 backdrop-blur border border-[#5b2bff]/50 rounded-2xl p-5 mb-6 shadow-lg shadow-[#5b2bff]/20"
          >
            <AnimatePresence mode="wait">
              {connected ? (
                <motion.div
                  key="connected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3"
                >
                  <p className="text-sm text-gray-300">Connected&nbsp;address</p>
                  <p className="font-mono break-all text-xs bg-[#29153B] border border-[#8646A4] rounded-xl p-2">
                    {friendly}
                  </p>
                  <button
                    onClick={() => tonUI.disconnect()}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#00aeff] to-purple-400 font-bold hover:opacity-90 ripple"
                  >
                    🔄 Change wallet
                  </button>
                </motion.div>
              ) : (
                <motion.div
                  key="disconnected"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  transition={{ duration: 0.25 }}
                  className="space-y-3 text-center"
                >
                  <p className="text-sm">No wallet connected.</p>
                  <button
                    onClick={() => tonUI.openModal()}
                    className="w-full py-2 rounded-xl bg-gradient-to-r from-[#5b2bff] to-[#00e1ff] font-bold hover:opacity-90 ripple"
                  >
                    🔗 Connect wallet
                  </button>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>

          {/* ===== Tabs ===== */}
          <Tabs
            tabs={tabs}
            activeTab={activeTab}
            onTabClick={(i) => setActiveTab(i as 0 | 1)}
          />

          <motion.div
            key={activeTab}
            initial={{ opacity: 0, x: activeTab === 0 ? -20 : 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: activeTab === 0 ? 20 : -20 }}
            transition={{ type: "spring", stiffness: 60, damping: 12 }}
          >
            {activeTab === 0 ? (
              <Deposit />                       
            ) : (
              <Withdraw
                inputValues={inputs}
                handleInputChange={onInput}
                handleWithdraw={onWithdrawSuccess}
              />
            )}
          </motion.div>

          <Footer />
        </div>
      </div>

      {isSuccess && (
        <Success isSuccess={isSuccess} setIsSuccess={setIsSuccess} />
      )}

      {/* ripple util */}
      <style>
        {`
          .ripple{position:relative;overflow:hidden}
          .ripple::after{
            content:"";position:absolute;inset:0;border-radius:inherit;
            background:#fff;opacity:0;transform:scale(0);
            transition:opacity .6s,transform .4s
          }
          .ripple:active::after{
            opacity:.15;transform:scale(1);transition:0s
          }
        `}
      </style>
    </>
  );
};

export default Wallet;
