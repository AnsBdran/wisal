Suggestion Actions

```tsx
export const SuggestionActions = ({
  row,
}: {
  row: Suggestion & { choices: Choice[] };
}) => {
  const { setSuggestionRow } = useEditSuggestionContext();
  const { t } = useTranslation('suggestions');
  const fetcher = useFetcher();
  return (
    <>
      <ActionIcon
        variant='outline'
        onClick={() => {
          setSuggestionRow(row);
        }}
      >
        <Icon icon={icons.edit} />
      </ActionIcon>
    </>
  );
};
```

Suggestions Wrapper

```tsx
const Suggestions = () => {
  const { t } = useTranslation('dashboard');
  const { suggestions } = useLoaderData<typeof loader>();
  const { suggestionRow: editSuggestion, opened } = useEditSuggestionContext();
  return (
    <>
      <Title>{t('suggestions')}</Title>
      {JSON.stringify({ editSuggestion, opened }, null, 2)}
      <Table columns={getSuggestionsColumns()} data={suggestions} />
      {editSuggestion && <SuggestionEdit />}
    </>
  );
};
```

the context

```tsx
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

type EditSuggestionContextType = {
  suggestionRow: EditSuggestionType | null;
  setSuggestionRow: Dispatch<SetStateAction<EditSuggestionType | null>>;
};

const EditSuggestionContext = createContext<EditSuggestionContextType>(
  {} as EditSuggestionContextType
);
export const EditSuggestionContextProvider = ({
  children,
}: {
  children: ReactNode;
}) => {
  const [suggestionRow, setSuggestionRow] = useState<EditSuggestionType | null>(
    null
  );
  // const [opened, { open, close }] = useDisclosure();

  return (
    <EditSuggestionContext.Provider
      value={{
        suggestionRow,
        setSuggestionRow,
      }}
    >
      {children}
    </EditSuggestionContext.Provider>
  );
};

export const useEditSuggestionContext = () => {
  return useContext(EditSuggestionContext);
};
```
