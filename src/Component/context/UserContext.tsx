import React, { createContext, useContext, useState } from "react";

interface User {
  id: string; // l'ID de ta base de données
  telegram_id: number;
  username?: string;
  firstName?: string;
  lastName?: string;
  email?: string;
  // ajoute ici d'autres champs si nécessaires
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
