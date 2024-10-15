import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Code,
  Divider,
  Group,
  List,
  rem,
  Space,
  Text,
  Title,
  Highlight,
  Mark,
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
        <Divider mb='sm' />
        <Alert icon={<Icon icon={icons.info} />}>
          التطبيق ما يزال في مراحل التطوير الأولى، سيتم إطلاق النسخة التجريبية
          في غضون أسبوع من تاريخ اليوم: السابع من أكتوبر.
        </Alert>
        <Divider my='sm' />
        <Title order={3}>كيفية تثبيت التطبيق؟</Title>
        <List
          // icon={<Icon icon={icons.specialStar} />}
          fz='xs'
          color='dimmed'
          type='ordered'
        >
          <List.Item>
            قم بفتح رابط التطبيق في متصفح <Mark>Google Chrome</Mark>.
          </List.Item>
          <List.Item>
            قم بالضغط على زر فتح قائمة الإعدادات{' '}
            <Mark>النقاط الثلاث في أعلى زاوية الشاشة</Mark>.
          </List.Item>
          <List.Item>
            اضفط على <Mark>إضافة إلى الشاشة الرئيسية</Mark>.
          </List.Item>
          <List.Item>
            اضغط على <Mark>تثبيت</Mark>.
          </List.Item>
          <Alert
            // c='teal'
            mt='sm'
            variant='outline'
            style={{
              borderWidth: '2px',
              borderColor:
                'light-dark(var(--mantine-color-teal-6), var(--mantine-color-dark-4))',
              color:
                'light-dark(var(--mantine-color-teal-9), var(--mantine-color-white))',
            }}
            // p='xs'
            py='xs'
            icon={<Icon icon={icons.info} />}
          >
            يمكنك إتباع خطوات أخرى مشابهة على متصفح آخر من اختيارك.
          </Alert>
          {/* <List.Item>إنشاء المنشورات والتعليق والتفاعل عليها.</List.Item>
          <List.Item>التواصل مع أعضاء التطبيق عبر المحادثات الخاصة.</List.Item>
          <List.Item>
            إنشاء المحادثات الجماعية؛ والتراسل مع مجموعة من الأشخاص.
          </List.Item>
          <List.Item>
            تقديم المقترحات لتطوير التطبيق، والتصويت على ما تم تقديمه وقَبوله.
          </List.Item> */}
        </List>
      </Box>
    </>
  );
};

export default AppIntro;
