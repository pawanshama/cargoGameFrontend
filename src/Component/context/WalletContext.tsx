import {
  createContext, useCallback, useContext, useEffect, useState,
} from "react";
import axios from "axios";

type Wallet = { paidcoins: number; freecoins: number };

interface WalletCtx {
  wallet: Wallet | null;
  refreshWallet: () => Promise<void>;
  setWallet: (w: Wallet) => void;          // MAJ instantanée après un pari
}

const Ctx = createContext<WalletCtx | undefined>(undefined);

export const WalletProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [wallet, setWallet] = useState<Wallet | null>(null);

  const fetchWallet = useCallback(async () => {
    const initData = window.Telegram?.WebApp?.initData;
    if (!initData) return;

    try {
      const { data } = await axios.get(
        `${import.meta.env.VITE_BACKEND_URL}/api/wallet/me`,
        { headers: { Authorization: `tma ${initData}` } },
      );
      setWallet(data.wallet);
    } catch (e) {
      console.error("❌ fetchWallet:", e);
    }
  }, []);

  /* un seul fetch au chargement + léger polling */
  useEffect(() => {
    fetchWallet();
    const id = setInterval(fetchWallet, 30_000);
    return () => clearInterval(id);
  }, [fetchWallet]);

  return (
    <Ctx.Provider value={{ wallet, refreshWallet: fetchWallet, setWallet }}>
      {children}
    </Ctx.Provider>
  );
};

export const useWallet = () => {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("useWallet must be inside WalletProvider");
  return ctx;
};
