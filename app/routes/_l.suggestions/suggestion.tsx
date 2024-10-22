import {
  Paper,
  Title,
  Text,
  Group,
  SimpleGrid,
  Radio,
  Button,
  ActionIcon,
  Badge,
  Stack,
} from '@mantine/core';
import { SerializeFrom } from '@remix-run/node';
import { loader } from './route';
import styles from './suggestions.module.css';
import { useEffect, useState } from 'react';
import { useFetcher } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { Icons } from '~/lib/icons';
const Suggestion = ({
  suggestion,
  userID,
}: {
  suggestion: SerializeFrom<typeof loader>['suggestions'][0];
  userID: number;
}) => {
  const defaultValue = suggestion.choices
    .find((c) => {
      const vote = c.votes.some(
        (v) => v.userID == userID && v.choiceID === c.id
      );
      return vote;
    })
    ?.id.toString();
  const [value, setValue] = useState<string | null>(
    defaultValue ? defaultValue : null
  );

  const fetcher = useFetcher();
  useEffect(() => {
    if (fetcher.data?.deleted) {
      setValue(null);
    }
  }, [fetcher.data]);

  const submit = () => {
    fetcher.submit(
      {
        intent: INTENTS.submitVote,
        choiceID: value,
        suggestionID: suggestion.id,
      },
      { method: 'POST' }
    );
  };

  const cancel = () => {
    if (value && !defaultValue) {
      return setValue(null);
    }
    fetcher.submit(
      {
        intent: INTENTS.cancelVote,
        suggestionID: suggestion.id,
      },
      {
        method: 'POST',
      }
    );
  };

  return (
    <>
      <Paper pos='relative' shadow='md' withBorder p='md'>
        <Title order={3} c='primary'>
          {suggestion.title}
        </Title>
        <Text mb='md' c='dimmed'>
          {suggestion.description}
        </Text>
        <Radio.Group
          value={value}
          onChange={setValue}
          defaultValue={defaultValue}
        >
          <SimpleGrid cols={{ base: 2, sm: 4 }}>
            {suggestion.choices.map((c) => (
              <RadioCard
                value={c.id.toString()}
                key={c.id}
                title={c.title}
                votes={c.votes.length}
                description={c.description}
              />
            ))}
          </SimpleGrid>
        </Radio.Group>
        <ActionIcon.Group className={styles.actions}>
          <ActionIcon
            variant='light'
            color='red'
            hidden={!value && !defaultValue}
            onClick={cancel}
          >
            <Icons.cancel />
          </ActionIcon>
          <ActionIcon
            disabled={defaultValue === value || !value}
            onClick={submit}
            variant='light'
          >
            <Icons.checkMark />
          </ActionIcon>
        </ActionIcon.Group>
      </Paper>
    </>
  );
};

export default Suggestion;

export const RadioCard = ({ value, votes, title, description }) => {
  return (
    <Radio.Card value={value} className={styles.radio}>
      <Group wrap='nowrap' align='flex-start'>
        <Radio.Indicator />
        <Stack gap='xs'>
          <Text fw={500} size='sm' lh={1} className={styles.label}>
            {title}
          </Text>
          <Text className={styles.description}>{description}</Text>
          <Badge
            size='xs'
            lh={1}
            mb={5}
            variant='dot'
            className={styles.votesCount}
          >
            {votes}
          </Badge>
        </Stack>
      </Group>
    </Radio.Card>
  );
};

// export const RadioCard = ({ value, votes, title }) => {
//   return (
//     <Radio.Card value={value} className={styles.radio}>
//       <Group wrap='nowrap' align='flex-start'>
//         <Radio.Indicator />
//         <div>
//           <Text fw={500} size='sm' lh={1} className={styles.label}>
//             {title}
//           </Text>
//           <Text
//             c='dimmed'
//             size='xs'
//             lh={1}
//             mb={5}
//             className={styles.votesCount}
//           >
//             {votes}
//           </Text>
//         </div>
//       </Group>
//     </Radio.Card>
//   );
// };
