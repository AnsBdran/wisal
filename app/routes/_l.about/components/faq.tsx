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
import styles from '../about.module.css';
import { SerializeFrom } from '@remix-run/node';
import { loader } from '../route';
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
