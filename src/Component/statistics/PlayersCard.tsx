import { randFloat } from "three/src/math/MathUtils.js";
import { ClockIcon, DollarIcon, InviteIcon } from "../../assets/iconset";

const PlayersData = [
  {
    label: (
      <>
        <DollarIcon /> <p>TOTAL BETS</p>
      </>
    ),
    value: "$211,128,500",
  },
  {
    label: (
      <>
        <ClockIcon />
        <p>LAST 24 HRS</p>
      </>
    ),
    value: "$6,123,250",
  },
  {
    label: (
      <>
        <InviteIcon color="#fff" />
        <p>TOTAL PLAYERS</p>
      </>
    ),
    value: "2,330,928",
  },
  {
    label: (
      <>
        <ClockIcon />
        <p>LAST 24H ACTIVE PLAYERS</p>
      </>
    ),
    value: "8,200",
  },
  {
    label: (
      <>
        <span className="w-6 h-6 flex items-center justify-center">
          <span className="w-4 h-4 block bg-primary rounded-full"></span>
        </span>
        <p>ACTIVE NOW</p>
      </>
    ),
    value: "1,500",
  },
];

const PlayersCard = () => {
  return (
    <div className="rounded-2xl border border-secondary bg-radialGradient">
      <div className="flex items-center justify-center gap-[.625rem] py-3 rounded-t-2xl bg-alternateBackground">
        <InviteIcon color="#fff" />
        <p className="h3 text-white">Players</p>
      </div>
      {PlayersData.map((data) => (
        <div
          className="flex justify-between items-center py-2 px-4 border-b border-alternateBackground last:border-0"
          key={randFloat(0, 100)}
        >
          <div className="text text-white flex items-center gap-2">
            {data.label}
          </div>
          <div className="text text-white">{data.value}</div>
        </div>
      ))}
    </div>
  );
};

export default PlayersCard;
