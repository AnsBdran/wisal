import {
  Combobox,
  Group,
  Loader,
  Pill,
  PillsInput,
  ScrollArea,
  useCombobox,
} from '@mantine/core';
import { useFetcher } from '@remix-run/react';
import { Dispatch, SetStateAction, useEffect, useState } from 'react';
import { useTranslations } from 'use-intl';
import { users } from '~/.server/db/schema';
import { INTENTS } from '~/lib/constants';
import { Icons } from '~/lib/icons';
import { getProfileInfo } from '~/lib/utils';

const MultiSelect = ({
  value,
  setValue,
  excludedUsers,
}: {
  value: number[];
  setValue: Dispatch<SetStateAction<number[]>>;
  excludedUsers?: number[];
}) => {
  const [search, setSearch] = useState('');
  // const [value, setValue] = useState<string[]>([]);
  const [data, setData] = useState<(typeof users.$inferSelect)[]>([]);
  const [loading, setLoading] = useState(false);

  const fetcher = useFetcher();
  const t = useTranslations('common');

  // const isFetching = fetcher.state === 'loading';
  // const status = fetcher.data;

  useEffect(() => {
    if (fetcher.state !== 'loading' && fetcher.data !== undefined) {
      setData(fetcher.data?.users);
      setLoading(false);
      combobox.resetSelectedOption();
    }
  }, [fetcher]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: () => {
      if (data.length === 0 && !loading) {
        setLoading(true);
        fetcher.load(`/api/data?intent=${INTENTS.fetchUsers}`);
      }
    },
  });

  const handleValueSelect = (val: number) => {
    setValue((current) =>
      current.includes(val)
        ? current.filter((v) => v !== val)
        : [...current, val]
    );
  };

  const handleValueRemove = (val: number) =>
    setValue((current) => current.filter((v) => v !== val));

  const values = value.map((item) => (
    <Pill key={item} withRemoveButton onRemove={() => handleValueRemove(item)}>
      {data.find((u) => u.id == item)?.firstName}
    </Pill>
  ));

  const options = data
    .filter((item) =>
      `${item.firstName} ${item.lastName}`.includes(search.trim().toLowerCase())
    )
    .map((item) => (
      <Combobox.Option value={item.id.toString()} key={item.id}>
        <Group gap='sm'>
          {value.includes(item.id) && <Icons.checkMark />}
          {getProfileInfo(item)}
          {/* <Avatar
            size='xs'
            src={item.profileImage}
            name={getFullName(item)}
            color='initials'
          />
          <span>{getProfileInfoText(item)}</span> */}
        </Group>
      </Combobox.Option>
    ));

  return (
    <>
      <Combobox
        store={combobox}
        // withinPortal={false}
        onOptionSubmit={handleValueSelect}
        // zIndex={100}
      >
        <Combobox.DropdownTarget>
          <PillsInput
            rightSection={
              fetcher.state === 'loading' ? (
                <Loader size={18} />
              ) : (
                <Combobox.Chevron />
              )
            }
            onClick={() => combobox.openDropdown()}
          >
            <Pill.Group>
              {values}
              <Combobox.EventsTarget>
                <PillsInput.Field
                  onFocus={() => combobox.openDropdown()}
                  onBlur={() => combobox.closeDropdown()}
                  value={search}
                  placeholder={t('search')}
                  onChange={(event) => {
                    combobox.updateSelectedOptionIndex();
                    setSearch(event.currentTarget.value);
                  }}
                  onKeyDown={(event) => {
                    if (event.key === 'Backspace' && search.length === 0) {
                      event.preventDefault();
                      handleValueRemove(value[value.length - 1]);
                    }
                  }}
                ></PillsInput.Field>
              </Combobox.EventsTarget>
            </Pill.Group>
          </PillsInput>
        </Combobox.DropdownTarget>
        <Combobox.Dropdown>
          <Combobox.Options>
            <ScrollArea.Autosize mah={250}>
              {fetcher.state === 'loading' ? (
                <Combobox.Empty>{t('loading')}...</Combobox.Empty>
              ) : options.length > 0 ? (
                options
              ) : (
                <Combobox.Empty>{t('nothing_found')}....</Combobox.Empty>
              )}
            </ScrollArea.Autosize>
          </Combobox.Options>
        </Combobox.Dropdown>
      </Combobox>
    </>
  );
};

export default MultiSelect;
