import { Accordion, Text, Container, Title, Box } from '@mantine/core';
import styles from './about.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from './route';

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
        <Title ta='center' className={styles.title}>
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
