import React, { useEffect, useState } from "react";
import { HistoryIcon } from "../../assets/iconset";
import { randFloat } from "three/src/math/MathUtils.js";

interface Transaction {
  deposit: boolean;
  dateTime: string;
  amount: number;
}

const DepositWithdrawCard: React.FC = () => {
  const [depositWithdrawCardData, setDepositWithdrawCardData] =
    useState<Transaction[]>();

  useEffect(() => {
    setDepositWithdrawCardData([
      {
        deposit: true,
        dateTime: "08 JUL 2024 - 00:30:12 (UTC)",
        amount: 200,
      },
      {
        deposit: false,
        dateTime: "08 JUL 2024 - 00:30:12 (UTC)",
        amount: 300,
      },
      {
        deposit: true,
        dateTime: "08 JUL 2024 - 00:30:12 (UTC)",
        amount: 150,
      },
    ]);
  }, []);

  const formatNumber = (value: number): string => {
    return new Intl.NumberFormat("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    }).format(value);
  };

  return (
    <div className="rounded-2xl border border-secondary bg-radialGradient">
      <div className="flex items-center justify-center gap-[.625rem] py-3 rounded-t-2xl bg-alternateBackground">
        <HistoryIcon />
        <p className="h3 text-white">DEPOSIT & WITHDRAW</p>
      </div>
      <div>
        {depositWithdrawCardData?.map((transaction) => (
          <div
            key={randFloat(1000, 100000)}
            className="flex justify-between items-center py-2 px-4 border-b border-alternateBackground last:border-0"
          >
            <div className="text-white flex flex-col gap-2">
              <p className="text">
                {transaction.deposit ? "DEPOSIT" : "WITHDRAW"}
              </p>
              <p className="tableFont">{transaction.dateTime}</p>
            </div>
            <div
              className={`text ${
                transaction.deposit ? "text-primary" : "text-inActiveTab"
              }`}
            >
              {transaction.deposit ? '+' : '-'}{formatNumber(transaction.amount)}{" "}USDT
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default DepositWithdrawCard;
