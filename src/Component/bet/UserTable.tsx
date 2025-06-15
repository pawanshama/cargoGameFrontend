import { useEffect, useState } from "react";
import ProfilePic from "../../assets/images/dummyProfile.png";

const generateFakeRows = (count: number) => {
  return Array.from({ length: count }).map((_, i) => ({
    id: i,
    username: "DAVISLATIMP",
    time: "4:21 PM",
    gain: "+$1,345",
    img: ProfilePic,
  }));
};

const UserTable = () => {
  const [rowCount, setRowCount] = useState<number>(6);
  const [rows, setRows] = useState(() => generateFakeRows(6));

  const handleResize = () => {
    let newCount = 6;
    if (window.innerWidth <= 350) {
      newCount = 3;
    } else if (window.innerWidth <= 400) {
      newCount = 4;
    }
    setRowCount(newCount);
  };

  useEffect(() => {
    handleResize();
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    setRows(generateFakeRows(rowCount));
  }, [rowCount]);

  return (
    <div className="flex flex-col rounded-lg bg-black/[0.12] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-[.3125rem] overflow-hidden">
      
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr] items-center px-3 py-[.375rem] bg-transparent text-white text-xs font-semibold">
        <span className="text-left">User</span>
        <span className="text-center">Time</span>
        <span className="text-right">Gain</span>
      </div>

      <div className="w-full stroke h-[.0625rem] bg-white/20"></div>

      {/* Rows */}
      <div>
        {rows.map((row) => (
          <div
            key={row.id}
            className="grid grid-cols-[2fr_1fr_1fr] items-center gap-2 px-3 py-[.375rem] even:bg-tableRow text-white text-sm"
          >
            <div className="flex items-center gap-2 truncate">
              <img
                src={row.img}
                alt="profilePic"
                loading="lazy"
                className="w-[1.125rem] h-[1.125rem] object-contain"
              />
              <span className="tableFont truncate">{row.username}</span>
            </div>
            <span className="text-center tableFont">{row.time}</span>
            <span className="text-right tableBoldFont text-primary">{row.gain}</span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
