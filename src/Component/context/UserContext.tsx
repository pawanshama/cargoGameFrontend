import React, { createContext, useContext, useState } from "react";

interface ReferralMission {
  inviteCode: string;
  invitedCount: number;
  yourCashback: number;
  friendsCashback: number;
  totalCashback: number;
}

interface User {
  id: string;
  telegram_id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  ReferralMission?: ReferralMission; // ✅ ajoute ce champ
}

interface UserContextType {
  user: User | null;
  setUser: (user: User) => void;
}

const UserContext = createContext<UserContextType>({
  user: null,
  setUser: () => {},
});

export const useUser = () => useContext(UserContext);

export const UserProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      {children}
    </UserContext.Provider>
  );
};
