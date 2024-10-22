import { Text } from '@mantine/core';
import styles from '../about.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '../route';
const getStatsData = (stats: SerializeFrom<typeof loader>['stats']) => {
  const data = [
    {
      title: 'عدد مستخدمي التطبيق',
      stats: stats.usersCount,
      description:
        'عدد مستخدمي تطبيق وصال الذين قرروا الإنضمام إلينا حتَّى الآن.',
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
