import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { UserSession } from '../types';

type UserSessionContextType = {
  userSession: UserSession | null;
  setUserSession: Dispatch<SetStateAction<UserSession | null>>;
};

const UserSessionContext = createContext<UserSessionContextType>(
  {} as UserSessionContextType
);

export const UserSessionContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [userSession, setUserSession] = useState<UserSession | null>(null);

  return (
    <UserSessionContext.Provider value={{ userSession, setUserSession }}>
      {children}
    </UserSessionContext.Provider>
  );
};

export const useUserSessionContext = () => useContext(UserSessionContext);
