import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { UserRole } from '../types';

type EditUserType = {
  role?: UserRole;
  isFamily?: boolean;
  intent: string;
  // userID: number;
};
const initialState = {} as EditUserType;

type EditUserContext = {
  editUser: EditUserType;
  setEditUser: Dispatch<SetStateAction<EditUserType>>;
};

const EditUserContext = createContext<EditUserContext>({} as EditUserContext);

export const EditUserContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [editUser, setEditUser] = useState<EditUserType>(initialState);
  return (
    <EditUserContext.Provider value={{ editUser, setEditUser }}>
      {children}
    </EditUserContext.Provider>
  );
};

export const useEditUserContext = () => {
  return useContext(EditUserContext);
};
