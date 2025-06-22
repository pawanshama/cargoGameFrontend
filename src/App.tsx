/* src/App.tsx
   — version vérifiée et corrigée */

import { useEffect, useRef, useState } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  useNavigate,
  useLocation,
} from "react-router-dom";
import axios from "axios";

import "./App.css";

/* ---------- Pages ---------- */
import Airdrop from "./Component/pages/Airdrop";
import Wallet from "./Component/pages/Wallet";
import OnBoarding from "./Component/pages/OnBoarding";
import FreeBetMissions from "./Component/pages/FreeBetMissions";
import LeaderBoard from "./Component/pages/LeaderBoard";
import Bet from "./Component/pages/Bet";
import Congratulations from "./Component/pages/Congratulations";
import CongratulationsWithScore from "./Component/pages/CongratulationsWithScore";
import Terms from "./Component/pages/Terms";
import Privacy from "./Component/pages/Privacy";

/* ---------- Context / hooks ---------- */
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { UserProvider, useUser } from "./Component/context/UserContext";
import useBackgroundMusic from "./hooks/useBackgroundMusic";
// import useFullscreenOnStart from "./hooks/useFullscreenOnStart";

/* ---------- Constantes ---------- */
const API_BASE = import.meta.env.VITE_BACKEND_URL ??
  "https://corgi-in-space-backend-production.up.railway.app";

/* ========================================================================= */
/*                               SOUS-ROUTES                                 */
/* ========================================================================= */

function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const { setUser } = useUser();

  const hasRedirected = useRef(false);
  const didAuth = useRef(false); // garde anti-double-auth
  const [userReady, setUserReady] = useState(false);

  /* ────────── Étape 1 : lecture du code d’invitation ────────── */
  useEffect(() => {
    const urlParams = new URLSearchParams(window.location.search);
    const inviteCode = urlParams.get("invite");
    if (!inviteCode) return;

    axios
      .get<{ inviterId: string }>(`${API_BASE}/api/invite/${inviteCode}`)
      .then((res) => {
        if (res.data?.inviterId) {
          localStorage.setItem("inviterId", res.data.inviterId);
          console.log("✅ inviterId stocké :", res.data.inviterId);
        }
      })
      .catch((err) => {
        console.warn("❌ Code d’invitation invalide :", err);
      });
  }, []);

  /* ────────── Étape 2 : auth Telegram (une seule fois) ────────── */
  useEffect(() => {
    if (didAuth.current) return;
    const tg = window.Telegram?.WebApp;
    if (!tg) return console.warn("❌ Telegram WebApp not available");

    tg.ready();
    console.log("✅ Telegram WebApp ready");

    const initData = tg.initData;
    if (!initData) return console.warn("❌ initData manquant");
    didAuth.current = true;

    const inviterId = localStorage.getItem("inviterId") || null;

    axios
      .post(
        `${API_BASE}/api/auth/telegram`,
        { inviterId },
        { headers: { Authorization: `tma ${initData}` } },
      )
      .then((res) => {
        console.log("✅ Utilisateur connecté :", res.data.userData);
        setUser(res.data.userData);
        setUserReady(true);
        localStorage.removeItem("inviterId");
      })
      .catch((err) => {
        /* eslint-disable-next-line @typescript-eslint/no-unsafe-member-access */
        console.error("❌ Erreur auth Telegram :", err.response?.data ?? err);
      });
  }, [setUser]);

  /* ────────── Étape 3 : redirection automatique ────────── */
  useEffect(() => {
    const onBoardPaths = ["/", "/onboarding"];
    const shouldRedirect =
      onBoardPaths.includes(location.pathname.toLowerCase());

    if (!hasRedirected.current && userReady && shouldRedirect) {
      hasRedirected.current = true;
      navigate("/bet", { replace: true });
    }
  }, [userReady, location.pathname, navigate]);

  /* ────────── Étape 4 : écoute des messages iframe ────────── */
  useEffect(() => {
    const handler = (event: MessageEvent) => {
      if (
        event.data?.action === "goToMainScreen" &&
        location.pathname !== "/bet"
      ) {
        navigate("/bet");
      }
    };
    window.addEventListener("message", handler);
    return () => window.removeEventListener("message", handler);
  }, [navigate, location.pathname]);

  /* ────────── JSX des routes ────────── */
  return (
    <Routes>
      <Route path="/" element={<OnBoarding />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/free-bet" element={<FreeBetMissions />} />
      <Route path="/top" element={<LeaderBoard />} />
      <Route path="/bet" element={<Bet />} />
      <Route path="/congratulations" element={<Congratulations />} />
      <Route
        path="/congratulations-score"
        element={<CongratulationsWithScore />}
      />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/airdrop" element={<Airdrop />} />
    </Routes>
  );
}

/* ========================================================================= */
/*                               APP ROOT                                    */
/* ========================================================================= */

function App() {
  useBackgroundMusic("/assets/sounds/21Musichome.mp3", 0.1);
  // useFullscreenOnStart();

  return (
    <TonConnectUIProvider
      manifestUrl="https://corgi-in-space-front-end.vercel.app/tonconnect-manifest-v2.json"
      actionsConfiguration={{ twaReturnUrl: "https://t.me/CorginSpaceBot" }}
    >
      <UserProvider>
        <div className="flex font-lato place-content-center relative">
          <div className="w-full max-w-[640px]">
            <Router>
              <AppRoutes />
            </Router>
          </div>
        </div>
      </UserProvider>
    </TonConnectUIProvider>
  );
}

export default App;
