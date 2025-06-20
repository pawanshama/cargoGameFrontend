import { useRef, useEffect, useState } from "react";
import {
  BrowserRouter as Router,
  Route,
  Routes,
  useNavigate,
  useLocation,
} from "react-router-dom";
import "./App.css";

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

import axios from "axios";
import { TonConnectUIProvider } from "@tonconnect/ui-react";
import { UserProvider, useUser } from "./Component/context/UserContext";
import useBackgroundMusic from "./hooks/useBackgroundMusic"; 
//import useFullscreenOnStart from "./hooks/useFullscreenOnStart";



// ✅ Gère les routes et l'envoi de l'utilisateur au backend
function AppRoutes() {
  const navigate = useNavigate();
  const location = useLocation();
  const hasRedirected = useRef(false);
  const [userReady, setUserReady] = useState(false);
  const { setUser } = useUser();

  useEffect(() => {
    const tg = window.Telegram?.WebApp;

    if (!tg) {
      console.warn("❌ Telegram WebApp is not available");
      return;
    }

    tg.ready();
    console.log("✅ Telegram WebApp ready");

    const initData = tg.initData;
    if (!initData) {
      console.warn("❌ initData manquant");
      return;
    }

    axios
      .post("https://corgi-in-space-backend-production.up.railway.app/api/auth/telegram", null, {
        headers: {
          Authorization: `tma ${initData}`,
        },
      })
      .then((res) => {
        console.log("✅ Utilisateur connecté :", res.data.userData);
        setUser(res.data.userData);
        console.log("👤 Données utilisateur stockées :", res.data.userData);
        setUserReady(true);
        console.log("🔓 userReady set to TRUE");
      })
      .catch((err) => {
        console.error("❌ Erreur auth Telegram :", err.response?.data || err.message);
      });
  }, []);

  useEffect(() => {
    const shouldRedirect = location.pathname === "/" || location.pathname === "/onboarding";
    console.log("🔁 Redirection check: userReady =", userReady, "| pathname =", location.pathname);

    if (!hasRedirected.current && userReady && shouldRedirect) {
      hasRedirected.current = true;
      console.log("➡️ Redirection vers /bet");
      navigate("/bet");
    }
  }, [userReady, location, navigate]);


    useEffect(() => {
  const handler = (event: MessageEvent) => {
    if (event.data?.action === "goToMainScreen") {
      console.log("📨 Message reçu depuis l'iframe :", event.data);

      // 🔐 Évite de rediriger si on est déjà sur /bet
      if (location.pathname !== "/bet") {
        navigate("/bet");
      }
    }
  };

  window.addEventListener("message", handler);
  return () => window.removeEventListener("message", handler);
}, [navigate, location.pathname]);



  return (
    <Routes>
      <Route path="/" element={<OnBoarding />} />
      <Route path="/wallet" element={<Wallet />} />
      <Route path="/free-bet" element={<FreeBetMissions />} />
      <Route path="/top" element={<LeaderBoard />} />
      <Route path="/bet" element={<Bet />} />
      <Route path="/congratulations" element={<Congratulations />} />
      <Route path="/congratulations-score" element={<CongratulationsWithScore />} />
      <Route path="/terms" element={<Terms />} />
      <Route path="/privacy" element={<Privacy />} />
      <Route path="/airdrop" element={<Airdrop />} />
    </Routes>
  );
}

// ✅ App principale avec gestion musique
function App() {
useBackgroundMusic("/assets/sounds/21Musichome.mp3", 0.1); // 👈 ici tu ajustes le volume
//useFullscreenOnStart();

  return (
    <TonConnectUIProvider
      manifestUrl="https://corgi-in-space-front-end.vercel.app/tonconnect-manifest-v2.json"
      actionsConfiguration={{
        twaReturnUrl: "https://t.me/corgiinspacebot",
      }}
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
