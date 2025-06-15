import { StatisticsIcon } from "../../assets/iconset";

const StatisticsCard = () => {
  return (
    <div className="rounded-2xl border border-secondary bg-radialGradient">
      <div className="flex items-center justify-center gap-[.625rem] py-3 rounded-t-2xl bg-alternateBackground">
        <StatisticsIcon />
        <p className="h3 text-white">your statistics</p>
      </div>
      <div>
        <div className="flex justify-between items-center py-2 px-4 border-b border-alternateBackground odd:bg-transparent even:bg-tableRow last:border-0">
          <div className="text text-white flex items-center gap-2">
            AMOUNT BETS
          </div>
          <div className="text text-white">$8,500</div>
        </div>
        <div className="flex justify-between items-center py-2 px-4 border-b border-alternateBackground odd:bg-transparent even:bg-tableRow last:border-0">
          <div className="text text-white flex items-center gap-2">
            AMOUNT WON
          </div>
          <div className="text text-primary">$6,500</div>
        </div>
        <div className="flex justify-between items-center py-2 px-4 border-b border-alternateBackground odd:bg-transparent even:bg-tableRow last:border-0">
          <div className="text text-white flex items-center gap-2">
            AMOUNT LOST
          </div>
          <div className="text text-inActiveTab">$2,500</div>
        </div>
        <div className="flex justify-between items-center py-2 px-4 border-b border-alternateBackground odd:bg-transparent even:bg-tableRow last:border-0">
          <div className="text text-white flex items-center gap-2">PROFIT</div>
          <div className="text text-primary">+$4,500</div>
        </div>
        <div className="flex justify-between items-center py-2 px-4 border-b border-alternateBackground odd:bg-transparent even:bg-tableRow last:border-0">
          <div className="text text-white flex items-center gap-2">
            GAMES PLAYED
          </div>
          <div className="text text-white">28</div>
        </div>
        <div className="flex justify-between items-center py-2 px-4 border-b border-alternateBackground odd:bg-transparent even:bg-tableRow last:border-0">
          <div className="text text-white flex items-center gap-2">
            GAMES WON
          </div>
          <div className="text text-primary">14</div>
        </div>
        <div className="flex justify-between items-center py-2 px-4 border-b border-alternateBackground odd:bg-transparent even:bg-tableRow last:border-0">
          <div className="text text-white flex items-center gap-2">
            GAMES LOST
          </div>
          <div className="text text-inActiveTab">14</div>
        </div>
      </div>
    </div>
  );
};

export default StatisticsCard;
