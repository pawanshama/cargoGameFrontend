import React from "react";
import { CurrencyLeaderBoardIcon } from "../../assets/iconset";

interface TopCardProps {
  rank: number;
  profilePic: string;
  title: string;
  amount: number;
  isLast?: boolean;
  current: number
}

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const TopThreeCard: React.FC<{
  rank: number;
  profilePic: string;
  title: string;
  amount: number;
  current: number;
}> = ({ rank, profilePic, title, amount, current }) => (
  <div
    className={`flex flex-col gap-[.625rem] items-center w-full ${
      rank === 2 ? "-order-1" : ""
    }`}
  >
    <div
      className={`p-[.625rem] flex flex-col items-center gap-[.625rem] rounded-b-2xl w-full ${
        rank === 1 ? "bg-gradientFirst" : ""
      } ${rank === 2 ? "bg-gradientSecond" : ""} ${
        rank === 3 ? "bg-gradientThird" : ""
      }`}
    >
      <h3 className="font-designer text-2xl leading-[1.125rem] text-white text-center">
        {rank}
        <span className="text-base">
          {rank === 1 && "st"}
          {rank === 2 && "nd"}
          {rank === 3 && "rd"}
        </span>
      </h3>
      <div
        className={`${
          rank === 1 ? "w-[3.875rem] h-[3.875rem]" : "w-[3rem] h-[3rem]"
        }`}
      >
        <img
          src={profilePic}
          alt="ProfilePic"
          loading="lazy"
          className="w-full"
        />
      </div>
    </div>
    <div className="flex flex-col justify-center items-center gap-0.5">
      <h5 className="text-white text">{title} {current === rank && '(you)'}</h5>
      <div className="flex items-center gap-0.5">
        <CurrencyLeaderBoardIcon small />
        <p className="text-primary text">{formatPrice(amount)}</p>
      </div>
    </div>
  </div>
);

const OtherRankCard: React.FC<{
  rank: number;
  profilePic: string;
  title: string;
  amount: number;
  isLast?: boolean;
  current: number
}> = ({ rank, profilePic, title, amount, isLast, current }) => (
  <>
    <div className="flex gap-4 items-center py-2">
      <div className="w-[2.625rem] h-[2.625rem]">
        <img
          src={profilePic}
          alt="ProfilePic"
          loading="lazy"
          className="w-full"
        />
      </div>
      <div className="flex flex-col gap-1 w-full flex-1">
        <div className="flex items-center justify-between gap-3 w-full">
          <h5 className="text-white text">{title} {current === rank && '(you)'}</h5>
        </div>
        <div className="flex items-center gap-1">
          <CurrencyLeaderBoardIcon />
          <div className="flex gap-0.5 items-center">
            <p className="text-textColor textSmall">Profit</p>
            <p className="text-primary textSamllBold">{formatPrice(amount)}</p>
          </div>
        </div>
      </div>
      <h3 className="font-designer text-2xl leading-[1.125rem] text-white text-center">
        {rank}
        <span className="text-[.8125rem] leading-6">th</span>
      </h3>
    </div>
    {!isLast && <div className="w-full stroke h-[.0625rem]"></div>}
  </>
);

const TopCard: React.FC<TopCardProps> = ({
  rank,
  profilePic,
  title,
  amount,
  isLast,
  current
}) => {
  return (
    <>
      {rank <= 3 ? (
        <TopThreeCard
          rank={rank}
          profilePic={profilePic}
          title={title}
          amount={amount}
          current={current}
        />
      ) : (
        <OtherRankCard
          rank={rank}
          profilePic={profilePic}
          title={title}
          amount={amount}
          isLast={isLast}
          current={current}

        />
      )}
    </>
  );
};

export default TopCard;
