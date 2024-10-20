import {
  Popover,
  Group,
  ActionIcon,
  Badge,
  CopyButton,
  Tooltip,
} from '@mantine/core';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { useTranslations } from 'use-intl';

// export const PostTags = ({ tags }: { tags: (typeof tag.$inferSelect)[] }) => {
//   return (
//     <div onClick={(e) => e.stopPropagation()}>
//       <Popover>
//         <Popover.Target>
//           <ActionIcon variant='subtle'>
//             <Icon icon={icons.tags} />
//           </ActionIcon>
//         </Popover.Target>
//         <Popover.Dropdown>
//           <Group align='center' wrap='wrap'>
//             {tags.map((tag) => (
//               <Badge
//                 style={{ cursor: 'pointer' }}
//                 component={Link}
//                 to={`?tag=${tag?.name}`}
//                 key={tag?.id}
//                 radius='sm'
//               >
//                 {tag?.name}
//               </Badge>
//             ))}
//           </Group>
//         </Popover.Dropdown>
//       </Popover>
//     </div>
//   );
// };

export const CopyContentBtn = ({ value }: { value: string }) => {
  const t = useTranslations('common');
  return (
    <CopyButton value={value}>
      {({ copy, copied }) => (
        <Tooltip label={copied ? t('copied') : t('copy_content')}>
          <ActionIcon
            onClick={(e) => {
              e.stopPropagation();
              copy();
            }}
            variant='subtle'
          >
            <Icon icon={copied ? icons.checkMark : icons.copy} />
          </ActionIcon>
        </Tooltip>
      )}
    </CopyButton>
  );
};

// export const PostFooter = ({
//   post,
//   onShowCommentsBtnClicked,
//   showCommentsBtnLoading,
//   onShowReactionsBtnClicked,
//   showReactionsBtnLoading,
//   userID,
//   opened,
//   toggle,
// }: {
//   post: SerializeFrom<typeof loader>['posts']['data'][0];
//   onShowCommentsBtnClicked: (e: unknown) => void;
//   showCommentsBtnLoading: boolean;
//   onShowReactionsBtnClicked: (e: unknown) => void;
//   showReactionsBtnLoading: boolean;
//   userID: number;
//   opened: boolean;
//   toggle: () => void;
// }) => {
//   // const [opened, { toggle }] = useDisclosure();
//   const theme = useMantineTheme();
//   const { t } = useTranslation();
//   return (
//     <>
//       <UnstyledButton
//         onClick={toggle}
//         className={styles.footer}
//         mt='lg'
//         // pt={'xl'}
//         style={{
//           marginTop: 'auto',
//         }}
//         bg={
//           opened
//             ? `light-dark(${theme.colors.gray[2]}, ${theme.colors.dark[9]})`
//             : undefined
//         }
//       >
//         <Group>
//           {/* copy button */}
//           {/* <PostTags
//             tags={post.tags.map((t) => t.tag) as (typeof tag.$inferSelect)[]}
//           /> */}
//           <CopyContentBtn value={post.content} />
//         </Group>
//         <Box>
//           <Button.Group opacity={0.7}>
//             <Button
//               onClick={onShowCommentsBtnClicked}
//               size='compact-sm'
//               loading={showCommentsBtnLoading}
//               loaderProps={{ type: 'dots' }}
//             >
//               {t('comments')}
//             </Button>
//             <Button
//               onClick={onShowReactionsBtnClicked}
//               size='compact-sm'
//               loading={showReactionsBtnLoading}
//               loaderProps={{
//                 type: 'dots',
//               }}
//             >
//               {t('reactions')}
//             </Button>
//           </Button.Group>
//         </Box>
//       </UnstyledButton>

//       <Collapse in={opened} className={styles.commentsContainer}>
//         <Comments comments={post.comments} userID={userID} />
//         <Button
//           w='100%'
//           onClick={onShowCommentsBtnClicked}
//           loading={showCommentsBtnLoading}
//           loaderProps={{ type: 'dots' }}
//           hidden={post.comments.length === 0}
//         >
//           {t('view_all_comments')}
//         </Button>
//       </Collapse>
//     </>
//   );
// };
