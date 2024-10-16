import { Text, ActionIcon, Menu } from '@mantine/core';
import { Icon } from '@iconify/react';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '~/routes/_.feed/route';
import { icons } from '~/lib/icons';
import { useFetcher } from '@remix-run/react';
import { INTENTS } from '~/lib/constants';
import { useTranslation } from 'react-i18next';
import { modals } from '@mantine/modals';
export const PostActions = ({
  editPostFormOpen,
  post,
  userID,
}: {
  editPostFormOpen: () => void;
  userID: number;
  post: SerializeFrom<typeof loader>['posts']['data'][0];
}) => {
  const { t } = useTranslation();
  const fetcher = useFetcher();
  return (
    <>
      <Menu>
        <Menu.Target>
          <ActionIcon variant='transparent' hidden={post.userID !== userID}>
            <Icon icon={icons.ellipsis} />
          </ActionIcon>
        </Menu.Target>
        <Menu.Dropdown>
          <Menu.Item
            // size='compact-xs'
            variant='outline'
            hidden={post.userID !== userID}
            onClick={editPostFormOpen}
            leftSection={<Icon icon={icons.edit} />}
          >
            {t('edit')}
          </Menu.Item>
          <Menu.Item
            // size='compact-xs'
            variant='outline'
            hidden={post.userID !== userID}
            leftSection={<Icon icon={icons.delete} />}
            onClick={() => {
              modals.openConfirmModal({
                children: (
                  <>
                    <Text>{t('confirm_post_delete')}</Text>
                  </>
                ),
                onConfirm: () => {
                  fetcher.submit(
                    { intent: INTENTS.deletePost, postID: post.id },
                    {
                      method: 'POST',
                    }
                  );
                },
              });
            }}
            color='red'
          >
            {t('delete')}
          </Menu.Item>
        </Menu.Dropdown>
      </Menu>
    </>
  );
};
