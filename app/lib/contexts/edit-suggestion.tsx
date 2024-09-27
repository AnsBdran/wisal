import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useContext,
  useState,
} from 'react';
import { Choice, Suggestion } from '../types';
import { useDisclosure } from '@mantine/hooks';

type EditSuggestionType = Suggestion & { choices: Choice[] };

// const initialState = null as EditSuggestionType;

type EditSuggestionContextType = {
  editSuggestion: EditSuggestionType | null;
  setEditSuggestion: Dispatch<SetStateAction<EditSuggestionType | null>>;
  opened: boolean;
  open: () => void;
  close: () => void;
};

const EditSuggestionContext = createContext<EditSuggestionContextType>(
  {} as EditSuggestionContextType
);
export const EditSuggestionContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [editSuggestion, setEditSuggestion] =
    useState<EditSuggestionType | null>(null);
  const [opened, { open, close }] = useDisclosure();

  return (
    <EditSuggestionContext.Provider
      value={{ editSuggestion, setEditSuggestion, open, opened, close }}
    >
      {children}
    </EditSuggestionContext.Provider>
  );
};

export const useEditSuggestionContext = () => {
  return useContext(EditSuggestionContext);
};
