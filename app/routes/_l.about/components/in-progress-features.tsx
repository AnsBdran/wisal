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
        {/* <List.Item></List.Item> */}
      </List>
    </Box>
  );
};
