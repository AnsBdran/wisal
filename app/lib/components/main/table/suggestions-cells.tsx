import { useForm } from '@conform-to/react';
import { Icon } from '@iconify/react';
import {
  ActionIcon,
  Chip,
  Group,
  List,
  Popover,
  Spoiler,
  Text,
} from '@mantine/core';
import { useDisclosure } from '@mantine/hooks';
import { modals } from '@mantine/modals';
import { useFetcher } from '@remix-run/react';
import { useTranslation } from 'react-i18next';
import { INTENTS } from '~/lib/constants';
import { useEditSuggestionContext } from '~/lib/contexts/edit-suggestion';
import { icons } from '~/lib/icons';
import { Suggestion, Choice } from '~/lib/types';

export const IsAcceptedChip = ({
  defaultValue,
  choicesCount,
  id,
}: {
  defaultValue: boolean;
  choicesCount: number;
  id: number;
}) => {
  const accepted = choicesCount > 2;
  const { t } = useTranslation('suggestions');
  const fetcher = useFetcher();
  return (
    <>
      <Chip
        checked={defaultValue}
        color='green'
        size='xs'
        onClick={() => {
          if (accepted) {
            modals.openConfirmModal({
              children: (
                <>
                  {!defaultValue && <Text>{t('accept_suggestion')}</Text>}
                  {defaultValue && <Text>{t('reject_suggestion')}</Text>}
                </>
              ),
              onConfirm: () => {
                fetcher.submit(
                  {
                    intent: INTENTS.changeSuggestionStatus,
                    suggestionID: id,
                    status: !defaultValue,
                  },
                  {
                    method: 'POST',
                  }
                );
              },
            });
          }
        }}
      >
        {defaultValue ? t('accepted') : t('rejected')}
      </Chip>
    </>
  );
};

export const SuggestionActions = ({
  row,
}: {
  row: Suggestion & { choices: Choice[] };
}) => {
  const {
    setSuggestionRow,
    // open
  } = useEditSuggestionContext();
  const { t } = useTranslation('suggestions');
  const fetcher = useFetcher();
  return (
    <>
      <ActionIcon.Group variant='outline'>
        <ActionIcon
          variant='outline'
          color='red'
          onClick={() => {
            modals.openConfirmModal({
              children: (
                <>
                  <Text>{t('delete_suggestion')}</Text>
                </>
              ),
              onConfirm: () => {
                fetcher.submit(
                  {
                    intent: INTENTS.deleteSuggestion,
                    suggestionID: row.id,
                  },
                  {
                    method: 'POST',
                  }
                );
              },
            });
          }}
        >
          <Icon icon={icons.delete} />
        </ActionIcon>
        <ActionIcon
          variant='outline'
          onClick={() => {
            setSuggestionRow(row);
            // open();
          }}
        >
          <Icon icon={icons.edit} />
        </ActionIcon>
      </ActionIcon.Group>
    </>
  );
};

export const Description = ({ value }: { value: string }) => {
  const { t } = useTranslation();
  return (
    <Spoiler showLabel={t('show_more')} hideLabel={t('hide')} fz='xs'>
      {value}
    </Spoiler>
  );
};

export const SuggestionChoices = ({ choices }: { choices: Choice[] }) => {
  console.log('choices in cell', choices);
  const { t } = useTranslation('suggestions');
  const { length } = choices;
  return (
    <>
      <Popover>
        <Popover.Target>
          <Text
            style={{ textWrap: 'nowrap' }}
            c={length > 0 ? 'blue' : 'dimmed'}
          >
            {t('choices_count', { count: length })}{' '}
          </Text>
        </Popover.Target>
        <Popover.Dropdown>
          <List>
            {choices.map((c) => (
              <List.Item key={c.id}>{c.title}</List.Item>
            ))}
          </List>
        </Popover.Dropdown>
      </Popover>
    </>
  );
};
// export const SuggestionActions = ({
//   row,
// }: {
//   row: Suggestion & { choices: Choice[] };
// }) => {
//   // const lastResult = useActionData<typeof action>();
//   const fetcher = useFetcher();
//   const [form, { title, description }] = useForm<z.infer<SuggestionEditSchema>>(
//     {
//       lastResult: fetcher.state === 'idle' ? fetcher.data : null,
//     }
//   );
//   const { t } = useTranslation('suggestions');

//   const [defaultChoices, setDefaultChoices] = useState<
//     z.infer<SuggestionChoiceSchema>[]
//   >(row.choices as z.infer<SuggestionChoiceSchema>[]);
//   const [opened, { open, close }] = useDisclosure();
//   const [choicesOpened, { toggle: choicesToggle }] = useDisclosure();
//   const [choicesToDelete, setChoicesToDelete] = useState<number[]>([]);

//   // const navigation = useNavigation();

//   // >(choices.initialValue as z.infer<SuggestionChoiceSchema>[]);

//   const addChoice = () => {
//     setDefaultChoices((prev) => [...prev, { title: '', description: '' }]);
//   };
//   const removeChoice = (idx: number) => {
//     if (defaultChoices[idx].id) {
//       setChoicesToDelete((prev) => [...prev, defaultChoices[idx].id as number]);
//     }

//     setDefaultChoices((prev) => {
//       const choices = prev.filter((choice, i) => {
//         return i !== idx;
//       });
//       return choices;
//     });
//   };

//   return (
//     <>
//       <ActionIcon.Group variant='outline'>
//         <ActionIcon variant='outline' color='red'>
//           <Icon icon={icons.delete} />
//         </ActionIcon>
//         <ActionIcon variant='outline' onClick={open}>
//           <Icon icon={icons.edit} />
//         </ActionIcon>
//         <Modal opened={opened} onClose={close}>
//           <>
//             <>
//               <fetcher.Form
//                 method='POST'
//                 onSubmit={form.onSubmit}
//                 id={form.id}
//                 action='/dashboard/suggestions'
//                 // key={defaultChoices.toString()}
//               >
//                 <input
//                   type='hidden'
//                   name={'choicesToDelete'}
//                   value={JSON.stringify(choicesToDelete)}
//                 />
//                 <Stack>
//                   <TextInput
//                     name={title.name}
//                     error={title.errors}
//                     label={t('title')}
//                     defaultValue={row.title}
//                   />
//                   <Textarea
//                     name={description.name}
//                     error={description.errors}
//                     defaultValue={row.description ?? ''}
//                     autosize
//                     label={t('description')}
//                   />
//                   {/* <SegmentedControl
//                     data={[
//                       { value: 'true', label: t('accepted') },
//                       { value: 'false', label: t('rejected') },
//                     ]}
//                     defaultValue={isAccepted.initialValue ? 'true' : 'false'}
//                     name={isAccepted.name}
//                   /> */}
//                   <Box>
//                     <Divider size={'lg'} mt={'xl'} mb={'md'} />
//                     <Group justify='space-between'>
//                       <Button
//                         component={Title}
//                         order={4}
//                         onClick={choicesToggle}
//                         variant='transparent'
//                       >
//                         {choicesOpened ? t('choices') : t('show_choices')}
//                       </Button>
//                       <ActionIcon onClick={addChoice} hidden={!choicesOpened}>
//                         <Icon icon={icons.add} />
//                       </ActionIcon>
//                     </Group>
//                     <Collapse in={choicesOpened} transitionDuration={400}>
//                       <Divider my={'xl'} variant='dotted' />
//                       <Stack gap={'xl'} px={'xs'}>
//                         {defaultChoices.map((choice, idx) => {
//                           return (
//                             <Fragment key={idx}>
//                               <input
//                                 type='hidden'
//                                 name='choiceID'
//                                 value={choice.id}
//                               />
//                               <Stack gap={'xs'}>
//                                 <Group justify='space-between'>
//                                   <Title order={5}>
//                                     {t('choice_number')} {idx + 1}
//                                   </Title>
//                                   <ActionIcon
//                                     variant='subtle'
//                                     color='red.7'
//                                     onClick={() => removeChoice(idx)}
//                                   >
//                                     <Icon icon={icons.delete} />
//                                   </ActionIcon>
//                                 </Group>
//                                 <TextInput
//                                   name={`choices[${idx}].title`}
//                                   defaultValue={choice.title}
//                                   label={t('title')}
//                                 />
//                                 <Textarea
//                                   name={`choices[${idx}].description`}
//                                   defaultValue={choice.description}
//                                   label={t('description')}
//                                   autosize
//                                 />
//                               </Stack>
//                               <Divider variant='dashed' />
//                             </Fragment>
//                           );
//                         })}
//                       </Stack>
//                     </Collapse>
//                   </Box>
//                   <Button type='submit' loading={fetcher.state !== 'idle'}>
//                     {t('confirm')}
//                   </Button>
//                 </Stack>
//               </fetcher.Form>
//             </>
//           </>
//         </Modal>
//       </ActionIcon.Group>
//     </>
//   );
// };
// export const SuggestionActions = ({
//   row,
// }: {
//   row: Suggestion & { choices: Choice[] };
// }) => {
//   const lastResult = useActionData<typeof action>();
//   const [form, { title, isAccepted, description, choices }] = useForm<
//     z.infer<SuggestionEditSchema>
//   >({
//     lastResult,
//   });
//   const { t } = useTranslation('suggestions');

//   const [defaultChoices, setDefaultChoices] = useState<
//     z.infer<SuggestionChoiceSchema>[]
//   >(row.choices as z.infer<SuggestionChoiceSchema>[]);
//   const [showSuggestions, setShowSuggestions] = useState(false);
//   // >(choices.initialValue as z.infer<SuggestionChoiceSchema>[]);

//   const addChoice = () => {
//     setDefaultChoices((prev) => [...prev, { title: '', description: '' }]);
//   };
//   const removeChoice = (idx: number) => {
//     const choices = defaultChoices.filter((_, i) => i !== idx);
//     setDefaultChoices(choices);
//   };

//   return (
//     <>
//       <ActionIcon.Group variant='outline'>
//         <ActionIcon variant='outline' color='red'>
//           <Icon icon={icons.delete} />
//         </ActionIcon>
//         <ActionIcon
//           variant='outline'
//           onClick={() =>
//             modals.open({
//               children: (
//                 <>
//                   <>
//                     <Form
//                       method='POST'
//                       onSubmit={form.onSubmit}
//                       id={form.id}
//                       action='/dashboard/suggestions'
//                       key={defaultChoices.toString()}
//                     >
//                       <Stack>
//                         <TextInput
//                           name={title.name}
//                           error={title.errors}
//                           label={t('title')}
//                           defaultValue={row.title}
//                         />
//                         <Textarea
//                           name={description.name}
//                           error={description.errors}
//                           defaultValue={row.description ?? ''}
//                           autosize
//                           label={t('description')}
//                         />
//                         <SegmentedControl
//                           data={[
//                             { value: 'true', label: t('accepted') },
//                             { value: 'false', label: t('rejected') },
//                           ]}
//                           defaultValue={
//                             isAccepted.initialValue ? 'true' : 'false'
//                           }
//                           name={isAccepted.name}
//                         />
//                         <Box>
//                           <Divider size={'lg'} mt={'xl'} mb={'md'} />
//                           <Group justify='space-between'>
//                             <Title
//                               component={Button}
//                               order={4}
//                               onClick={() => setShowSuggestions(true)}
//                             >
//                               {t('choices')}
//                             </Title>
//                             <ActionIcon onClick={addChoice}>
//                               <Icon icon={icons.add} />
//                             </ActionIcon>
//                           </Group>
//                           <Collapse in={showSuggestions}>
//                             <Divider my={'xl'} variant='dotted' />
//                             <Stack gap={'xl'} px={'xs'}>
//                               {defaultChoices.map((choice, idx) => {
//                                 return (
//                                   <Fragment key={idx}>
//                                     <Stack gap={'xs'}>
//                                       <Group justify='space-between'>
//                                         <Title order={5}>
//                                           {t('choice_number')} {idx + 1}
//                                         </Title>
//                                         <ActionIcon
//                                           variant='subtle'
//                                           color='red.7'
//                                           onClick={() => removeChoice(idx)}
//                                         >
//                                           <Icon icon={icons.delete} />
//                                         </ActionIcon>
//                                       </Group>
//                                       <TextInput
//                                         name={`choices[${idx}].title`}
//                                         defaultValue={choice.title}
//                                         label={t('title')}
//                                       />
//                                       <Textarea
//                                         name={`choices[${idx}].description`}
//                                         defaultValue={choice.description}
//                                         label={t('description')}
//                                         autosize
//                                       />
//                                     </Stack>
//                                     <Divider variant='dashed' />
//                                   </Fragment>
//                                 );
//                               })}
//                             </Stack>
//                           </Collapse>
//                         </Box>
//                         <Button type='submit'>{t('confirm')}</Button>
//                       </Stack>
//                     </Form>
//                   </>
//                 </>
//               ),
//               overlayProps: {
//                 blur: 4,
//                 backgroundOpacity: 0.2,
//               },
//             })
//           }
//         >
//           <Icon icon={icons.edit} />
//         </ActionIcon>
//       </ActionIcon.Group>
//     </>
//   );
// };
// export const SuggestionActions = ({ row }: { row: Suggestion }) => {
//   const lastResult = useActionData<typeof action>();
//   const [form, { title, isAccepted, description, choices }] = useForm<
//     z.infer<SuggestionEditSchema>
//   >({ lastResult, defaultValue: row });
//   const { t } = useTranslation('suggestions');
//   const choicesList = choices.getFieldList();
//   const [defaultChoices, setDefaultChoices] = useState<z.infer<SuggestionChoiceSchema>[]>(choices.initialValue as z.infer<SuggestionChoiceSchema>[])
//   return (
//     <>
//       <ActionIcon.Group variant='outline'>
//         <ActionIcon variant='outline' color='red'>
//           <Icon icon={icons.delete} />
//         </ActionIcon>
//         <ActionIcon
//           variant='outline'
//           onClick={() =>
//             modals.open({
//               children: (
//                 <>
//                   <>
//                     <Form
//                       method='POST'
//                       onSubmit={form.onSubmit}
//                       id={form.id}
//                       action='/dashboard/suggestions'
//                     >
//                       <Stack>
//                         <TextInput
//                           name={title.name}
//                           error={title.errors}
//                           label={t('title')}
//                           defaultValue={title.initialValue}
//                         />
//                         <Textarea
//                           name={description.name}
//                           error={description.errors}
//                           defaultValue={description.initialValue}
//                           autosize
//                           label={t('description')}
//                         />
//                         <SegmentedControl
//                           data={[
//                             { value: 'true', label: t('accepted') },
//                             { value: 'false', label: t('rejected') },
//                           ]}
//                           defaultValue={
//                             isAccepted.initialValue ? 'true' : 'false'
//                           }
//                           name={isAccepted.name}
//                         />
//                         <Box>
//                           <Divider size={'lg'} mt={'xl'} mb={'md'} />
//                           <Group justify='space-between'>
//                             <Title order={4}>{t('choices')}</Title>
//                             <ActionIcon
//                               onClick={() => {
//                               }}
//                             >
//                               <Icon icon={icons.add} />
//                             </ActionIcon>
//                           </Group>
//                           <Divider my={'xl'} variant='dotted' />
//                           <Stack gap={'xl'} px={'xs'}>
//                             {choicesList.map((choice, idx) => {
//                               const { description, title } =
//                                 choice.getFieldset();
//                               return (
//                                 <Fragment key={idx}>
//                                   <Stack gap={'xs'}>
//                                     <Group justify='space-between'>
//                                       <Title order={5}>
//                                         {t('choice_number')} {idx + 1}
//                                       </Title>
//                                       <ActionIcon
//                                         variant='subtle'
//                                         color='red.7'
//                                       >
//                                         <Icon icon={icons.delete} />
//                                       </ActionIcon>
//                                     </Group>
//                                     <TextInput
//                                       name={title.name}
//                                       defaultValue={title.initialValue}
//                                       label={t('title')}
//                                     />
//                                     <Textarea
//                                       name={description.name}
//                                       defaultValue={description.initialValue}
//                                       label={t('description')}
//                                       autosize
//                                     />
//                                   </Stack>
//                                   <Divider variant='dashed' />
//                                 </Fragment>
//                               );
//                             })}
//                           </Stack>
//                         </Box>
//                         <Button type='submit'>{t('confirm')}</Button>
//                       </Stack>
//                     </Form>
//                   </>
//                 </>
//               ),
//               overlayProps: {
//                 blur: 4,
//                 backgroundOpacity: 0.2,
//               },
//             })
//           }
//         >
//           <Icon icon={icons.edit} />
//         </ActionIcon>
//       </ActionIcon.Group>
//     </>
//   );
// };
