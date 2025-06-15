import { randInt } from "three/src/math/MathUtils.js";
import { HistoryIcon } from "../../assets/iconset";

const game1 = [
  {
    label: <p>OPPONENT</p>,
    value: "bouledepet12",
  },
  {
    label: <p>OPPONENT SCORE</p>,
    value: "80",
  },
  {
    label: <p>YOUR SCORE</p>,
    value: "120",
  },
  {
    label: <p>PROFIT</p>,
    value: "+$30",
  },
];

const game2 = [
  {
    label: <p>DATE</p>,
    value: "08 JUL 2024 - 00:30:12 (UTC)",
  },
  {
    label: <p>OPPONENT</p>,
    value: "coucouya",
  },
  {
    label: <p>OPPONENT SCORE</p>,
    value: "130",
  },
  {
    label: <p>YOUR SCORE</p>,
    value: "12",
  },
  {
    label: <p>PROFIT</p>,
    value: "+$20",
  },
];

const HistoryCard = () => {
  return (
    <div className="rounded-2xl border border-secondary bg-alternateBackground p-4">
      <div className="flex items-center justify-center gap-[.625rem] py-3">
        <HistoryIcon />
        <p className="h3 text-white">YOUR HISTORY</p>
      </div>
      <div className="card-scroll overflow-y-auto max-h-[375px] pl-2" dir="rtl">
        <div className="flex flex-col gap-2" dir="ltr">
          <div className="rounded-2xl border border-secondary bg-radialGradient">
            <div className="flex items-center justify-center gap-[.625rem] py-3 rounded-t-2xl bg-alternateBackground">
              <p className="h3 text-white">GAME #2 - POOL #2</p>
            </div>
            {game1.map((data) => (
              <div
                className="flex justify-between items-center py-2 px-4 border-b border-alternateBackground last:border-0"
                key={randInt(1000, 100000)}
              >
                <div className="text text-white flex items-center gap-2">
                  {data.label}
                </div>
                <div className="text text-white">{data.value}</div>
              </div>
            ))}
          </div>
          <div className="rounded-2xl border border-secondary bg-radialGradient">
            <div className="flex items-center justify-center gap-[.625rem] py-3 rounded-t-2xl bg-alternateBackground">
              <p className="h3 text-white">GAME #1</p>
            </div>
            {game2.map((data) => (
              <div
                className="flex justify-between items-center py-2 px-4 border-b border-alternateBackground last:border-0"
                key={randInt(0, 100)}
              >
                <div className="text text-white flex items-center gap-2">
                  {data.label}
                </div>
                <div className="text text-white">{data.value}</div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default HistoryCard;
