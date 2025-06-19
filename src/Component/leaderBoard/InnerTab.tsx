import { useEffect, useRef, useState } from "react";
import ProfilePic from "../../assets/images/dummyProfile.png";
import TopCard from "./TopCard";

const InnerTab = () => {
  const current = 4;

  const topCards = Array.from({ length: 50 }, (_, index) => ({
    rank: index + 1,
    amount: 1801991,
    title: index === 3 ? "amazo_777" : "Davislatimp",
    profilePic: ProfilePic,
  }));

  const currentPlayer = topCards.find(card => card.rank === current);
  const topThree = topCards.filter(card => card.rank <= 3);
  const others = topCards.filter(card => card.rank > 3 && card.rank !== current);

  const [showScrollTop, setShowScrollTop] = useState(false);
  const listRef = useRef<HTMLDivElement>(null);
  const tenthPlayerRef = useRef<HTMLDivElement>(null);

  // Observer pour détecter si le 10e joueur est visible
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        setShowScrollTop(!entry.isIntersecting);
      },
      {
        root: null,
        threshold: 0.1,
      }
    );

    if (tenthPlayerRef.current) {
      observer.observe(tenthPlayerRef.current);
    }

    return () => {
      if (tenthPlayerRef.current) {
        observer.unobserve(tenthPlayerRef.current);
      }
    };
  }, []);

  const handleScrollToTop = () => {
    listRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  return (
    <div className="flex flex-col gap-6 w-full relative">
      {/* Référence pour retour en haut */}
      <div ref={listRef} />

      {/* Podium */}
      <div className="grid grid-cols-3 gap-2 items-end max-w-[330px] w-full mx-auto">
        {topThree.map((topCard) => (
          <TopCard
            key={topCard.rank}
            amount={topCard.amount}
            profilePic={topCard.profilePic}
            rank={topCard.rank}
            title={topCard.title}
            current={current}
          />
        ))}
      </div>

      {/* Liste des autres joueurs */}
      <div className="flex flex-col rounded-2xl border border-secondary px-4 py-2 bg-radialGradient">
        {currentPlayer && currentPlayer.rank > 3 && (
          <TopCard
            key={"current-user"}
            amount={currentPlayer.amount}
            profilePic={currentPlayer.profilePic}
            rank={currentPlayer.rank}
            title={currentPlayer.title}
            current={current}
            isCurrentUser
          />
        )}

        {others.map((topCard, index) => (
          <div
            key={topCard.rank}
            ref={topCard.rank === 8 ? tenthPlayerRef : undefined}
          >
            <TopCard
              amount={topCard.amount}
              profilePic={topCard.profilePic}
              rank={topCard.rank}
              title={topCard.title}
              isLast={index === others.length - 1}
              current={current}
            />
          </div>
        ))}
      </div>

      {/* Bouton retour haut */}
      {showScrollTop && (
  <button
    onClick={handleScrollToTop}
    className="fixed bottom-[140px] right-6 z-50 bg-[#2CFD95] text-black p-3 rounded-full shadow-lg hover:scale-110 active:scale-95 transition-transform duration-200"
    aria-label="Scroll to top"
  >
    <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  </button>
)}
    </div>
  );
};

export default InnerTab;
