import { useEffect, useState } from "react";
import ProfilePic from "../../assets/images/dummyProfile.png";

// Liste de noms simulés
const usernames = ["DAVISLATIMP", "MARIODEV", "PIXELQUEEN", "TONLOVER", "CORGIHUNTER"];

// Génère une ligne simulée avec gain ou perte
const generateRandomRow = (id: number) => {
  const username = usernames[Math.floor(Math.random() * usernames.length)];
  const isWin = Math.random() > 0.3; // 70% win, 30% loss
  const amount = Math.floor(Math.random() * 9900) + 100;
  const gain = `${isWin ? "+" : "-"}$${amount.toLocaleString()}`;
  const now = new Date();
  const time = now.toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" });
  return { id, username, time, gain, img: ProfilePic, isWin };
};

// Délai aléatoire entre 0.5s et 4s
const getRandomDelay = () => {
  const random = Math.random();
  if (random < 0.2) return 3500 + Math.random() * 500;
  if (random < 0.5) return 2000 + Math.random() * 1000;
  if (random < 0.8) return 1000 + Math.random() * 700;
  return 500 + Math.random() * 400;
};

const UserTable = () => {
  const [rows, setRows] = useState<any[]>([]);
  const [idCounter, setIdCounter] = useState(0);
  const [rowCount, setRowCount] = useState(6);

  // Responsive row count
  useEffect(() => {
    const updateRowCount = () => {
      let count = 6;
      if (window.innerWidth <= 350) count = 3;
      else if (window.innerWidth <= 400) count = 4;
      setRowCount(count);
    };

    updateRowCount();
    window.addEventListener("resize", updateRowCount);
    return () => window.removeEventListener("resize", updateRowCount);
  }, []);

  // Initial rows
  useEffect(() => {
    const initialRows = Array.from({ length: rowCount }).map((_, i) =>
      generateRandomRow(i)
    );
    setRows(initialRows);
    setIdCounter(rowCount);
  }, [rowCount]);

  // Add new rows dynamically
  useEffect(() => {
    let isMounted = true;

    const addNewRow = () => {
      if (!isMounted) return;

      setRows((prev) => {
        const newRow = generateRandomRow(idCounter);
        return [newRow, ...prev].slice(0, rowCount);
      });
      setIdCounter((prev) => prev + 1);

      const delay = getRandomDelay();
      setTimeout(addNewRow, delay);
    };

    const initialDelay = setTimeout(addNewRow, 2000);
    return () => {
      isMounted = false;
      clearTimeout(initialDelay);
    };
  }, [rowCount, idCounter]);

  return (
    <div className="flex flex-col rounded-lg bg-black/[0.12] shadow-[0px_4px_4px_0px_rgba(0,0,0,0.25)] backdrop-blur-[.3125rem] overflow-hidden">
      {/* Header */}
      <div className="grid grid-cols-[2fr_1fr_1fr] items-center px-3 py-[.375rem] bg-transparent text-white text-xs font-semibold">
        <span className="text-left">User</span>
        <span className="text-center">Time</span>
        <span className="text-right">Profit</span>
      </div>

      <div className="w-full stroke h-[.0625rem] bg-white/20"></div>

      {/* Rows */}
      <div>
        {rows.map((row, index) => (
          <div
            key={row.id}
            className={`grid grid-cols-[2fr_1fr_1fr] items-center gap-2 px-3 py-[.375rem] even:bg-tableRow text-white text-sm ${
              index === 0 ? "animate-fade-slide" : ""
            }`}
          >
            <div className="flex items-center gap-2 truncate">
              <img
                src={row.img}
                alt="profilePic"
                loading="lazy"
                className="w-[1.125rem] h-[1.125rem] object-contain rounded-full"
              />
              <span className="tableFont truncate">{row.username}</span>
            </div>
            <span className="text-center tableFont">{row.time}</span>
            <span
              className={`text-right tableBoldFont ${
                row.isWin ? "text-primary" : "text-red-500"
              }`}
            >
              {row.gain}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
};

export default UserTable;
