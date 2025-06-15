import { MouseEventHandler } from "react";
import { InfoIcon } from "../../assets/iconset";

interface ScoreCard {
  score?: number;
  text: string;
  showFees: boolean;
  price?: number;
}

const formatNumber = (value: number): string => {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
};

const formatPrice = (price: number): string => {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(price);
};

const getContent = (item: ScoreCard): string => {
  if (item.price !== undefined && item.score !== undefined) {
    return `${formatPrice(item.price)}/${formatNumber(item.score)}`;
  }

  if (item.price !== undefined) {
    return formatPrice(item.price);
  }

  if (item.score !== undefined) {
    return formatNumber(item.score);
  }

  return "";
};

interface ScoreCardItemProps {
  item: ScoreCard;
  handleInfoClick: MouseEventHandler<HTMLButtonElement>;
}

const ScoreCardItem: React.FC<ScoreCardItemProps> = ({ item, handleInfoClick }) => {
  return (
    <div
      className={`p-3 rounded-lg border border-secondary bg-alternateBackground h-[5.5rem] w-full flex items-center flex-col justify-center relative ${
        item.showFees ? "gap-0" : "gap-4"
      }`}
    >
      {item.price !== undefined && item.score !== undefined && (
        <button type="button" className="absolute right-[.375rem] top-[.375rem]" onClick={handleInfoClick}>
          <InfoIcon />
        </button>
      )}
      <p className="text text-white text-center">{item.text}</p>
      <h3
        className={`text-center ${
          item.price !== undefined && item.score !== undefined
            ? "h2"
            : "display"
        } ${item.showFees ? "text-primary" : "text-white"}`}
      >
        {getContent(item)}
      </h3>
      {item.showFees && (
        <p className="tableFont text-white">-2.5% platform fees</p>
      )}
    </div>
  );
};

export default ScoreCardItem;
