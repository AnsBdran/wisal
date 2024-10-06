import {
  ActionIcon,
  Badge,
  Box,
  Group,
  List,
  Text,
  Title,
} from '@mantine/core';
import styles from '../feed.module.css';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';

const AppIntro = ({
  opened,
  close,
}: {
  opened: boolean;
  close: () => void;
}) => {
  return (
    <>
      <Box className={styles.introContainer} hidden={!opened}>
        <Group>
          <Title order={2}>تطبيق وصال</Title>
          <Badge variant='dot' color='green' size='xs'>
            نسخة تجريبية
          </Badge>
          <ActionIcon
            mr='auto'
            size='xs'
            variant='transparent'
            color='red'
            onClick={close}
          >
            <Icon icon={icons.close} />
          </ActionIcon>
        </Group>
        <List icon={<Icon icon={icons.specialStar} />}>
          <List.Item>إنشاء المنشورات والتعليق والتفاعل عليها.</List.Item>
          <List.Item>التواصل مع أعضاء التطبيق عبر المحادثات الخاصة.</List.Item>
          <List.Item>
            إنشاء المحادثات الجماعية؛ والتراسل مع مجموعة من الأشخاص.
          </List.Item>
          <List.Item>
            تقديم المقترحات لتطوير التطبيق، والتصويت على ما تم تقديمه وقَبوله.
          </List.Item>
        </List>
      </Box>
    </>
  );
};

export default AppIntro;
