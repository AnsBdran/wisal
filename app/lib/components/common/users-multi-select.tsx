import { Icon } from '@iconify/react/dist/iconify.js';
import {
  Avatar,
  Combobox,
  Group,
  Loader,
  Pill,
  PillsInput,
  ScrollArea,
  useCombobox,
} from '@mantine/core';
import {
  Dispatch,
  SetStateAction,
  startTransition,
  useEffect,
  useState,
} from 'react';
import { useTranslation } from 'react-i18next';
import { useGetAllUsers } from '~/lib/utils';
import { INTENTS } from '~/lib/constants';
import { icons } from '~/lib/icons';
import { getFullName, getProfileInfo, getProfileInfoText } from '~/lib/utils';

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
  const { t } = useTranslation();

  const {
    usersData: data,
    fetchUsersData,
    loading,
  } = useGetAllUsers({ excludedUsers });
  useEffect(() => {
    if (!loading && !data) {
      combobox.resetSelectedOption();
    }
  }, [data, loading]);

  const combobox = useCombobox({
    onDropdownClose: () => combobox.resetSelectedOption(),
    onDropdownOpen: fetchUsersData,
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
          {value.includes(item.id.toString()) && (
            <Icon icon={icons.checkMark} />
          )}
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
      <Combobox store={combobox} onOptionSubmit={handleValueSelect}>
        <Combobox.DropdownTarget>
          <PillsInput
            rightSection={loading ? <Loader size={18} /> : <Combobox.Chevron />}
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
              {loading ? (
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
