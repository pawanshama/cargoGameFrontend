import { useEffect, useRef } from "react";
import { CloseIcon } from "../../assets/iconset";
import FAQItem from "../faq/FaqItem";

interface ProfileProps {
  setIsProfileShow: (value: boolean) => void;
}

const faqs = [
  {
    id: 1,
    question: "What is Corgi in Space?",
    answer: (
      <>
        <p>
          <strong>Corgi in Space</strong> is a skill-betting game where
          players wager money on their own victory. In each match, there is a
          winner and a loser; the winner takes the loser's stake.
        </p>
        <p>
          <strong>Players can bet any amount</strong> from a minimum of{" "}
          <strong>2 USD</strong> to a maximum of{" "}
          <strong>999,999 USD</strong>.
        </p>
      </>
    ),
  },
  {
    id: 2,
    question: "How Does It Work?",
    answer: (
      <ul className="ml-4 list-disc">
        <li><strong>Deposit money</strong> into your wallet.</li>
        <li><strong>Bet</strong> the amount you wish to double (and are willing to lose).</li>
        <li><strong>Play</strong> our game "Corgi in Space."</li>
        <li><strong>Win</strong> by beating your opponent.</li>
        <li><strong>Congratulations</strong>, you have doubled your bet!</li>
        <li>Your <strong>winnings</strong> are credited to your wallet.</li>
      </ul>
    ),
  },
  {
    id: 3,
    question: "How Can I Earn Money?",
    answer: (
      <>
        <ul className="ml-4 list-disc">
          <li>During the game, achieve a higher score than your opponent to win.</li>
          <li>The winner takes the total bet.</li>
        </ul>
        <p><strong>Example:</strong></p>
        <ul className="ml-4 list-disc">
          <li>You bet 10 USD.</li>
          <li>If you win the game, you get 20 USD.</li>
          <li>If you lose, you lose 10 USD.</li>
        </ul>
      </>
    ),
  },
  {
    id: 4,
    question: "Does It Really Work?",
    answer: (
      <p>
        Thousands of players play Corgi in Space every day, and many win money
        daily. Check our <strong>Telegram channel</strong> for testimonials
        and meet the community!
      </p>
    ),
  },
  {
    id: 5,
    question: "Am I Playing Against a Robot or a Real Player?",
    answer: (
      <p>
        There are no bots in our game. Every match involves real players'
        performances and bets.
      </p>
    ),
  },
  {
    id: 6,
    question: "How Can I Find an Opponent Regardless of My Bet Amount?",
    answer: (
      <>
        <p>
          Our <strong>innovative matchmaking system</strong> allows any
          player, regardless of the bet amount, to find an opponent.
        </p>
        <p>
          When you enter your bet amount and start a match, we find a pool
          against which you will play.
        </p>
        <p>
          A pool contains a score and an amount of money held by a player who
          previously started a match.
        </p>
        <p>
          Your goal is to beat the pool's score to win the money in the pool.
          If you win, you take the pool's money. If your score is lower or
          equal to the pool's, the player holding the pool wins your bet.
        </p>
        <h5><strong>Explanation:</strong></h5>
        <ul className="ml-4 list-disc">
          <li><strong>If you win and your bet is less than the pool</strong>, you win double your bet and do not create a new pool.</li>
          <li><strong>If you win and your bet is greater than the pool</strong>, you win double the pool amount. The surplus is allocated to a new pool with your score.</li>
          <li><strong>If you win and your bet equals the pool</strong>, you win double the pool amount minus 1 USD, which is refunded. No new pool is created.</li>
        </ul>
        <h5><strong>If You Lose:</strong></h5>
        <ul className="ml-4 list-disc">
          <li><strong>If your bet is less than the pool</strong>, you lose your bet and do not create a new pool.</li>
          <li><strong>If your bet is greater than the pool</strong>, you lose the pool amount. The surplus is used to create a new pool with your score.</li>
          <li><strong>If your bet equals the pool</strong>, you lose the pool amount minus 1 USD, which is refunded.</li>
        </ul>
        <p><strong>If there is a tie</strong>, the pool owner wins the match and the bet.</p>
      </>
    ),
  },
  {
    id: 7,
    question: "Are My Funds Safe?",
    answer: (
      <p>
        All player funds are securely stored and encrypted to ensure maximum
        anonymity and security.
      </p>
    ),
  },
  {
    id: 8,
    question: "Can I Lose Money?",
    answer: (
      <p>
        Yes, while thousands of players win money, many others lose money.
        Corgi in Space is a recreational game and not a stable investment
        method. Bet only what you can afford to lose and have fun!
      </p>
    ),
  },
  {
    id: 9,
    question: "Can I Play If I Am Under 18?",
    answer: (
      <p>No, our game is not available to individuals under 18 years of age.</p>
    ),
  },
  {
    id: 10,
    question: "How to Deposit/ Withdraw Money?",
    answer: (
      <>
        <h6><strong>Deposit Money:</strong></h6>
        <ol className="ml-4 list-decimal">
          <li>Go to the "Wallet" page.</li>
          <li>Click on "Deposit" and copy your personal <strong>TON address</strong>.</li>
          <li>Send <strong>TON</strong> from your external wallet to this address.</li>
          <li>Once the transaction is confirmed, your balance will update automatically.</li>
        </ol>

        <h6><strong>Withdraw Money:</strong></h6>
        <ol className="ml-4 list-decimal">
          <li>Go to the "Wallet" page.</li>
          <li>Click on "Withdraw" and enter your <strong>TON wallet address</strong>.</li>
          <li>Enter the amount to withdraw.</li>
          <li>Confirm by clicking the “Withdraw” button.</li>
        </ol>
      </>
    ),
  },
  {
    id: 11,
    question: "How to Get My $100 Free?",
    answer: (
      <>
        <ol className="ml-4 list-decimal">
          <li>Go to the "freebet" page in the menu.</li>
          <li>Complete the missions: KYC, valid email, phone number, invite 3 friends, follow on Twitter, join on Telegram.</li>
          <li>Your free bets will appear in your free bet wallet.</li>
        </ol>
        <p>
          Unlock <strong>$10 free instantly</strong> just by completing your
          KYC. (Free bets are only valid for betting and cannot be withdrawn).
        </p>
      </>
    ),
  },
  {
    id: 12,
    question: "Where is Corgi in Space Accessible?",
    answer: (
      <p>You can play Corgi in Space only from <strong>Telegram on mobile</strong>. More games are coming soon.</p>
    ),
  },
  {
    id: 13,
    question: "Is Corgi in Space Free?",
    answer: (
      <p>
        Corgi in Space takes a fee of <strong>2.5%</strong> on each bet to maintain operations and fund prizes.
      </p>
    ),
  },
  {
    id: 14,
    question: "What happens when a bet is matched and there are no funds left in the pool?",
    answer: (
      <p>
        The last winner creates a new pool with <strong>2 USD</strong> to keep the ecosystem active.
      </p>
    ),
  },
  {
    id: 15,
    question: "What happens in case of a tie?",
    answer: (
      <p>
        If both players tie, it’s a <strong>draw</strong>. Both receive their funds back minus the <strong>game fee</strong>.
      </p>
    ),
  },
];

const Profile: React.FC<ProfileProps> = ({ setIsProfileShow }) => {
  const clickAudioRef = useRef<HTMLAudioElement | null>(null);

  useEffect(() => {
    clickAudioRef.current = new Audio("/assets/sounds/19Backbutton.mp3");
    clickAudioRef.current.preload = "auto";
  }, []);

  const handleClose = () => {
    if (clickAudioRef.current) {
      clickAudioRef.current.currentTime = 0;
      clickAudioRef.current.play().catch((e) => {
        console.warn("Audio error:", e);
      });
    }
    setIsProfileShow(false);
  };

  return (
    <div className="fixed top-0 left-1/2 -translate-x-1/2 z-10 flex flex-col justify-between rounded-t-[10px] shadow-[0px_0px_100px_0px_rgba(0,0,0,0.05)] backdrop-blur-[1.5625rem] bg-black/[0.6] h-[100dvh] overflow-y-auto w-full max-w-[640px] pb-[6rem]">
      <div className="absolute top-3 right-4">
        <button
          type="button"
          onClick={handleClose}
          className="h-[1.875rem] w-[1.875rem] bg-transparent active:scale-90 transition-transform duration-100 ease-in-out"
        >
          <CloseIcon />
        </button>
      </div>

      <div className="flex flex-col flex-1 w-full py-6 px-5 gap-6 overflow-y-auto">
        <h1 className="text-center text-white h1">FAQ</h1>
        <div className="flex flex-col gap-4">
          {faqs.map((faq) => (
            <FAQItem
              key={faq.id}
              id={faq.id}
              question={faq.question}
              answer={faq.answer}
              defaultOpen={faq.id === 1}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default Profile;
