import {
  Box,
  Button,
  Combobox,
  Group,
  SegmentedControl,
  Stack,
  Title,
} from '@mantine/core';
import { useTranslation } from 'react-i18next';
import MultiSelect from '~/lib/components/common/multi-select';
import { useFilter } from '~/lib/hooks/useFilter';

export const FeedFilters = () => {
  const { t } = useTranslation('feed');
  const {
    orderByOptions,
    orderOptions,
    setters,
    users,
    setUsers,
    applyFilters,
    clearAll,
  } = useFilter();
  return (
    <Stack>
      <Box>
        <Title order={3}>{t('order_basis')}</Title>
        <SegmentedControl
          onChange={setters.setOrderBy}
          data={orderByOptions}
          fullWidth
        />
      </Box>
      <Box>
        <Title order={3}>{t('order')}</Title>
        <SegmentedControl
          data={orderOptions}
          onChange={setters.setOrder}
          fullWidth
        />
      </Box>
      <Box>
        <Title order={3}>{t('author')}</Title>

        <MultiSelect value={users} setValue={setUsers} />
      </Box>
      <Combobox withArrow />
      <Group grow>
        <Button onClick={applyFilters}>{t('apply')}</Button>
        <Button onClick={clearAll} variant='outline'>
          {t('clear_all')}
        </Button>
      </Group>
    </Stack>
  );
};
