import {
  Accordion,
  Text,
  Title,
  Box,
  Modal,
  Button,
  Stack,
  List,
} from '@mantine/core';
import styles from './about.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from './route';
import { Icon } from '@iconify/react';
import { icons } from '~/lib/icons';
import { useDisclosure } from '@mantine/hooks';

export const Faqs = () => {
  const data: { title: string; desc: string }[] = [
    {
      title: 'هل هذا هو الشكل النهائي للتطبيق؟',
      desc: 'بالطبع لا، فهذا التطبيق ما يزال في مراحل التطوير الأولى، ونتمنى بدعمكم تطويره وتحسين مزاياه ليكون خياركم الأول للتواصل مع أحبابكم.',
    },
    {
      title: 'هل يمكنني المساهمة بفكرة أو طلب ميزة؟',
      desc: 'نعم، نحن على استعدادٍ دائم لاستقبال أفكاركم ومقترحاتكم',
    },
    {
      title: 'واجهت مشكلة ما أثناء استخدام التطبيق!',
      desc: `
              نعتذر عن ذلك، ولكن من المتوقع أن تواجه العديد من المشاكل أثناء
              استخدام هذا التطبيق، خاصةً أنه ما يزال في نسخته التجريبية، فنتمنى
              منكم إبلاغنا بأي مشكلة للعمل على إصلاحها بأسرع وقت.
`,
    },
    // {
    //   title: '',
    //   desc: '',
    // },
  ];

  return (
    <>
      <Box className={styles.wrapper}>
        <Title order={2} ta='center' className={styles.title}>
          الأسئلة الأكثر شيوعاً
        </Title>

        <Accordion variant='separated'>
          {data.map((d) => (
            <Accordion.Item
              key={d.title}
              className={styles.item}
              value={d.title}
            >
              <Accordion.Control>
                <Title order={4} fz='h5'>
                  {d.title}
                </Title>
              </Accordion.Control>
              <Accordion.Panel>
                <Text c='dimmed'>{d.desc}</Text>
              </Accordion.Panel>
            </Accordion.Item>
          ))}
        </Accordion>
        {/* </Container> */}
      </Box>
    </>
  );
};
const getStatsData = (stats: SerializeFrom<typeof loader>['stats']) => {
  const data = [
    {
      title: 'عدد مستخدمي التطبيق',
      stats: stats.usersCount,
      description:
        'عدد مستخدمي تطبيق الوصال الذين قرروا الإنضمام إلينا حتَّى الآن.',
    },
    {
      title: 'عدد المنشورات',
      stats: stats.postsCount,
      description: 'عدد المنشورات التي تم نشرها منذ بدء التطبيق حتى الآن',
    },
    {
      title: 'عدد الرسائل',
      stats: stats.messagesCount,
      description: `عدد الرسائل التي تم إرسالها بين مستخدمي التطبيق في كلٍ من المحادثات الخاصة أو المحادثات الجماعية.`,
    },
  ];
  return data;
};

export function StatsGroup({
  _stats,
}: {
  _stats: SerializeFrom<typeof loader>['stats'];
}) {
  const data = getStatsData(_stats);
  const stats = data.map((stat) => (
    <div key={stat.title} className={styles.stat}>
      <Text className={styles.count}>{stat.stats}</Text>
      <Text className={styles.statTitle}>{stat.title}</Text>
      <Text className={styles.description}>{stat.description}</Text>
    </div>
  ));
  return <div className={styles.root}>{stats}</div>;
}

export const SuggestionForm = () => {
  const [opened, { open, close }] = useDisclosure();

  return (
    <>
      <Button
        variant='outline'
        onClick={open}
        leftSection={<Icon icon={icons.add} />}
      >
        تقديم اقتراح
      </Button>

      <Modal
        opened={opened}
        onClose={close}
        overlayProps={{
          blur: 3,
          backgroundOpacity: 0.4,
        }}
      >
        <Stack></Stack>
      </Modal>
    </>
  );
};

export const InProgressFeatures = () => {
  return (
    <Box>
      <Title className={styles.title} ta={'center'} order={2}>
        ميِّزات يتم
        <Text span style={{ fontSize: 'inherit' }} c='dimmed'>
          {' '}
          أو سيتم{' '}
        </Text>
        العمل عليها:
      </Title>
      <List mt={0} icon={<Icon icon={icons.specialStar} />}>
        <List.Item>العمل بدون إتصال بالإنترنت.</List.Item>
        <List.Item>التفاعل على التعليقات.</List.Item>
        <List.Item>زيادة سرعة التطبيق.</List.Item>
        <List.Item>إرسال الصور عبر المحادثات الخاصة و الجماعية.</List.Item>
        <List.Item>إنهاء ترجمة النسخة الإنجليزية من التطبيق.</List.Item>
        <List.Item>إضفاء المزيد من الحيوية على التطبيق.</List.Item>
        <List.Item></List.Item>
      </List>
    </Box>
  );
};
