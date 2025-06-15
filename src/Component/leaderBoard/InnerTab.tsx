import ProfilePic from "../../assets/images/dummyProfile.png";
import TopCard from "./TopCard";

const InnerTab = () => {
  const topCards = [
    {
      rank: 1,
      amount: 1801991,
      title: "Davislatimp",
      profilePic: ProfilePic,
    },
    {
      rank: 2,
      amount: 1801991,
      title: "Davislatimp",
      profilePic: ProfilePic,
    },
    {
      rank: 3,
      amount: 1801991,
      title: "Davislatimp",
      profilePic: ProfilePic,
    },
    {
      rank: 4,
      amount: 1801991,
      title: "amazo_777",
      profilePic: ProfilePic,
    },
    {
      rank: 5,
      amount: 1801991,
      title: "Davislatimp",
      profilePic: ProfilePic,
    },
    {
      rank: 6,
      amount: 1801991,
      title: "Davislatimp",
      profilePic: ProfilePic,
    },
    {
      rank: 7,
      amount: 1801991,
      title: "Davislatimp",
      profilePic: ProfilePic,
    },
    {
      rank: 8,
      amount: 1801991,
      title: "Davislatimp",
      profilePic: ProfilePic,
    },
    {
      rank: 9,
      amount: 1801991,
      title: "Davislatimp",
      profilePic: ProfilePic,
    },
    {
      rank: 10,
      amount: 1801991,
      title: "Davislatimp",
      profilePic: ProfilePic,
    },
  ];
  return (
    <div className="flex flex-col gap-6 w-full">
      <div className="grid grid-cols-3 gap-2 items-end max-w-[330px] w-full mx-auto">
        {topCards
          .filter((topCard) => topCard.rank <= 3)
          .map((topCard) => (
            <TopCard
              key={topCard.rank}
              amount={topCard.amount}
              profilePic={topCard.profilePic}
              rank={topCard.rank}
              title={topCard.title}
              current={4}
            />
          ))}
      </div>
      <div className="flex flex-col rounded-2xl border border-secondary px-4 py-2 bg-radialGradient">
        {topCards
          .filter((topCard) => topCard.rank > 3)
          .map((topCard) => (
            <TopCard
              key={topCard.rank}
              amount={topCard.amount}
              profilePic={topCard.profilePic}
              rank={topCard.rank}
              title={topCard.title}
              isLast={topCard.rank === topCards.length}
              current={4}
            />
          ))}
      </div>
    </div>
  );
};

export default InnerTab;
