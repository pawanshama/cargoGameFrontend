/* ------------------------------------------------------------------
   src/App.tsx — React Query + pré-fetch global (Mission 1 & dépôt)
------------------------------------------------------------------ */

import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios, { AxiosError } from "axios";
import "./App.css";

/* ---------- Pages ---------- */
import Airdrop                      from "./Component/pages/Airdrop";
import Wallet                       from "./Component/pages/Wallet";
import OnBoarding                   from "./Component/pages/OnBoarding";
import FreeBetMissions              from "./Component/pages/FreeBetMissions";
import LeaderBoard                  from "./Component/pages/LeaderBoard";
import Bet                          from "./Component/pages/Bet";
import Congratulations              from "./Component/pages/Congratulations";
import CongratulationsWithScore     from "./Component/pages/CongratulationsWithScore";
import Terms                        from "./Component/pages/Terms";
import Privacy                      from "./Component/pages/Privacy";

/* ---------- Contexte / hooks ---------- */
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { UserProvider, useUser } from "./Component/context/UserContext";
import { WalletProvider }        from "./Component/context/WalletContext";
import useBackgroundMusic        from "./hooks/useBackgroundMusic";
import { useBootstrapUser }      from "./hooks/useBootstrapUser";
import  useMission1Query         from "./hooks/useMission1Query";

/* ---------- React Query ---------- */
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";

/* ---------- Constantes ---------- */
const queryClient = new QueryClient();
const API_BASE =
  import.meta.env.VITE_BACKEND_URL ||
  "https://corgi-in-space-backend-production.up.railway.app";

/* ========================================================================= */
/*                               SUB-ROUTES                                  */
/* ========================================================================= */

function AppRoutes() {
  const navigate   = useNavigate();
  const location   = useLocation();
  const { setUser } = useUser();

  const hasRedirected = useRef(false);
  const didAuth       = useRef(false);
  const [userReady, setUserReady] = useState(false);

  /* ───────────── 1. Collecte code d’invitation ───────────── */
  useEffect(() => {
    const urlParams           = new URLSearchParams(window.location.search);
    const inviteCodeFromURL   = urlParams.get("invite");
    const rawStart            = window.Telegram?.WebApp?.initDataUnsafe?.start_param;
    const inviteCodeFromStart = rawStart?.startsWith("invite=") ? rawStart.slice(7) : null;
    const inviteCode          = inviteCodeFromURL || inviteCodeFromStart;
    if (!inviteCode) return;

    axios
      .get<{ inviterId: string }>(`${API_BASE}/api/invite/${inviteCode}`)
      .then((res) => {
        if (res.data?.inviterId) localStorage.setItem("inviterId", res.data.inviterId);
      })
      .catch((err: AxiosError | any) => {
        console.warn("❌ Code d’invitation invalide :", err?.response?.data || err);
      });
  }, []);

  /* ───────────── 2. Auth Telegram (utilisateur) ───────────── */
  useEffect(() => {
    if (didAuth.current) return;

    const tg = window.Telegram?.WebApp;
    if (!tg) return console.warn("❌ Telegram WebApp not available");

    tg.ready();
    const initData = tg.initData;
    if (!initData) return console.warn("❌ initData manquant");

    didAuth.current = true;

    const inviterId = localStorage.getItem("inviterId") || null;
    const rawStart  = tg.initDataUnsafe?.start_param;
    const inviteCode = rawStart?.startsWith("invite=") ? rawStart.slice(7) : null;

    axios
      .post(
        `${API_BASE}/api/auth/telegram`,
        { inviterId, inviteCode },
        { headers: { Authorization: `tma ${initData}` } },
      )
      .then((res) => {
        setUser(res.data.userData);  // profil utilisateur
        setUserReady(true);          // prêt pour redirection
        localStorage.removeItem("inviterId");
      })
      .catch((err: AxiosError | any) => {
        console.error("❌ Erreur auth Telegram :", err?.response?.data || err);
      });
  }, [setUser]);

  /* ───────────── 3. Redirection automatique ───────────── */
  useEffect(() => {
    const onBoard = ["/", "/onboarding"];
    if (
      !hasRedirected.current &&
      userReady &&
      onBoard.includes(location.pathname.toLowerCase())
    ) {
      hasRedirected.current = true;
      navigate("/bet", { replace: true });
    }
  }, [userReady, location.pathname, navigate]);

  /* ───────────── 4. Iframe messages ───────────── */
  useEffect(() => {
    const handler = (e: MessageEvent) => {
      if (e.data?.action === "goToMainScreen" && location.pathname !== "/bet") {
        navigate("/bet");
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [navigate, location.pathname]);

  /* ───────────── Routes ───────────── */
  return (
    <Routes>
      <Route path="/"                     element={<OnBoarding />} />
      <Route path="/wallet"               element={<Wallet />} />
      <Route path="/free-bet"             element={<FreeBetMissions />} />
      <Route path="/top"                  element={<LeaderBoard />} />
      <Route path="/bet"                  element={<Bet />} />
      <Route path="/congratulations"      element={<Congratulations />} />
      <Route path="/congratulations-score"element={<CongratulationsWithScore />} />
      <Route path="/terms"                element={<Terms />} />
      <Route path="/privacy"              element={<Privacy />} />
      <Route path="/airdrop"              element={<Airdrop />} />
    </Routes>
  );
}

/* ========================================================================= */
/*                                   ROOT                                    */
/* ========================================================================= */

function App() {
  useBackgroundMusic("/assets/sounds/21Musichome.mp3", 0.1);
  useBootstrapUser();        // pré-fetch global (dépôt + Mission 1)
  useMission1Query({         // 👉 reste « silencieux » ; refetch après invalidation
  enabled   : true,        //   (on peut omettre, true par défaut)
  staleTime : 60_000,      //   1 min avant de juger « périmé »
});

  return (
    <QueryClientProvider client={queryClient}>
      <TonConnectUIProvider
        manifestUrl="https://corgi-in-space-front-end.vercel.app/tonconnect-manifest-v2.json"
        actionsConfiguration={{ twaReturnUrl: "https://t.me/CorginSpaceBot" }}
      >
        <UserProvider>
          <WalletProvider>
            <div className="relative flex place-content-center font-lato">
              <div className="w-full max-w-[640px]">
                <Router>
                  <AppRoutes />
                </Router>
              </div>
            </div>
          </WalletProvider>
        </UserProvider>
      </TonConnectUIProvider>
    </QueryClientProvider>
  );
}

export default App;
