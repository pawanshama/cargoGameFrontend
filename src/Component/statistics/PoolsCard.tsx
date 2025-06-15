import { HistoryIcon } from "../../assets/iconset";

interface PoolData {
  label: string;
  value: string;
  valueClass: string;
  additionalInfo?: string;
}

interface PoolCardProps {
  title: string;
  poolNumber: number;
  data: PoolData[];
}

const InnerCard: React.FC<PoolCardProps> = ({ title, poolNumber, data }) => {
  return (
    <div className="rounded-2xl border border-secondary bg-radialGradient">
      <div className="flex items-center justify-center gap-[4.5rem] py-3 rounded-t-2xl bg-alternateBackground">
        <h5
          className={`buttonFont ${
            title === "Active" ? "text-primary" : "text-inActiveTab"
          }`}
        >
          {title}
        </h5>
        <p className="buttonFont text-white">{`Pool #${poolNumber}`}</p>
      </div>
      <div>
        {data.map((item, index) => (
          <div
            key={item.label + index}
            className={`flex justify-between items-center py-2 px-4 border-b border-alternateBackground ${
              index === data.length - 1 ? "last:border-0" : ""
            }`}
          >
            <div className="text text-white flex items-center gap-2">
              {item.label}
              {item.additionalInfo && (
                <span className="text-primary textSmall">
                  {item.additionalInfo}
                </span>
              )}
            </div>
            <div className={`text ${item.valueClass}`}>{item.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
};

const PoolsCard: React.FC = () => {
  const pools = [
    {
      id: "active-1",
      title: "Active",
      poolNumber: 2,
      data: [
        { label: "PSEUDO", value: "bouledepet12", valueClass: "text-white" },
        { label: "INITIAL AMOUNT", value: "$80", valueClass: "text-white" },
        {
          label: "ACTUAL AMOUNT",
          value: "$20",
          valueClass: "text-white",
        },
        {
          label: "PROFIT",
          value: "+$130",
          valueClass: "text-primary",
          additionalInfo: "-2.5% fees",
        },
        { label: "TOTAL GAMES", value: "4", valueClass: "text-white" },
        {
          label: "ID GAMES",
          value: "#1 #3 #7 #9",
          valueClass: "text-white",
        },
      ],
    },
    {
      id: "inactive-1",
      title: "Inactive",
      poolNumber: 1,
      data: [
        { label: "PSEUDO", value: "coucouya", valueClass: "text-white" },
        {
          label: "INITIAL AMOUNT",
          value: "$8,500",
          valueClass: "text-white",
        },
        {
          label: "ACTUAL AMOUNT",
          value: "$8,500",
          valueClass: "text-white",
        },
        { label: "PROFIT", value: "-$20", valueClass: "text-inActiveTab" },
      ],
    },
  ];

  return (
    <div className="rounded-2xl border border-secondary bg-alternateBackground p-4">
      <div className="flex items-center justify-center gap-[.625rem] py-3">
        <HistoryIcon />
        <p className="h3 text-white">YOUR POOLS</p>
      </div>
      <div className="card-scroll overflow-y-auto max-h-[375px] pl-2" dir="rtl">
        <div className="flex flex-col gap-2" dir="ltr">
          {pools.map((pool) => (
            <InnerCard
              key={pool.id}
              title={pool.title}
              poolNumber={pool.poolNumber}
              data={pool.data}
            />
          ))}
        </div>
      </div>
    </div>
  );
};

export default PoolsCard;
