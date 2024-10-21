import {
  ActionIcon,
  Alert,
  Badge,
  Box,
  Divider,
  Group,
  List,
  rem,
  Title,
  Mark,
  Highlight,
} from '@mantine/core';
import styles from '../feed.module.css';
import { Icons, icons } from '~/lib/icons';

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
            <Icons.cancel width={rem(24)} height={rem(24)} />
          </ActionIcon>
        </Group>
        <Divider mb='sm' />
        <Alert icon={<Icons.info />}>
          <Highlight highlight='النسخة التجريبية'>
            هذه هي النسخة التجريبية الأولى من التطبيق، نتمنى منكم إبداء آرائكم
            ومقترحاتكم للمساهمة في تطوير التطبيق في المرحلة القادمة.
          </Highlight>
        </Alert>
        {/* <Alert icon={<Icon icon={icons.info} />}>
          التطبيق ما يزال في مراحل التطوير الأولى، سيتم إطلاق النسخة التجريبية
          في غضون أسبوع من تاريخ اليوم: السابع من أكتوبر.
        </Alert> */}
        <Divider my='sm' />
        <Title order={3}>كيفية تثبيت التطبيق؟</Title>
        <List
          // icon={<Icon icon={icons.specialStar} />}
          fz='xs'
          color='dimmed'
          type='ordered'
          spacing='4px'
          ms='md'
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
          <List.Item icon={<Icons.info />}>
            يمكنك إتباع خطوات أخرى مشابهة على متصفح آخر من اختيارك.
          </List.Item>
        </List>
        {/* <Alert
          // c='teal'
          mt='sm'
          variant='outline'
          style={{
            borderWidth: '2px',
            borderColor:
              'light-dark(var(--mantine-color-cyan-6), var(--mantine-color-dark-4))',
            color:
              'light-dark(var(--mantine-color-cyan-9), var(--mantine-color-white))',
          }}
          // p='xs'
          py='xs'
          icon={<Icon icon={icons.info} />}
        >
          يمكنك إتباع خطوات أخرى مشابهة على متصفح آخر من اختيارك.
        </Alert> */}
      </Box>
    </>
  );
};

export default AppIntro;
