import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Divider,
  Group,
  List,
  rem,
  Space,
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
        <Group justify='space-between'>
          <Group>
            <Title order={2}>تطبيق وصال</Title>
            <Badge variant='dot' color='green' size='xs'>
              نسخة تجريبية
            </Badge>
          </Group>
          <ActionIcon
            size='xl'
            variant='transparent'
            color='red'
            onClick={close}
          >
            <Icon icon={icons.close} width={rem(24)} height={rem(24)} />
          </ActionIcon>
        </Group>
        <Divider mb='xl' />
        <Alert icon={<Icon icon={icons.info} />}>
          التطبيق ما يزال في مراحل التطوير الأولى، سيتم إطلاق النسخة التجريبية
          في غضون أسبوع من تاريخ اليوم: السابع من أكتوبر.
        </Alert>
        <Divider my='xl' />
        <Title order={3}>ما تم إنشاءه</Title>
        <List icon={<Icon icon={icons.specialStar} />} fz='xs' color='dimmed'>
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
