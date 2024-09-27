import { useSearchParams } from '@remix-run/react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';

export const useFilter = () => {
  const { t } = useTranslation('feed');

  const [tag, setTag] = useState<null | string>(null);
  const [order, setOrder] = useState<'asc' | 'desc'>('desc');
  const [searchParams, setSearchParams] = useSearchParams();
  const [orderBy, setOrderBy] = useState<'comments' | 'reactions' | 'time'>(
    'time'
  );
  const [users, setUsers] = useState<string[]>([]);

  const applyFilters = () => {
    setSearchParams((prev) => {
      orderBy && orderBy !== 'time' && prev.set('orderBy', orderBy);
      order && order !== 'desc' && prev.set('order', order);
      users.length && prev.set('users', users.join('.'));
      return prev;
    });
  };

  const clearAll = () => {
    setSearchParams((prev) => {
      prev.delete('orderBy');
      prev.delete('order');
      prev.delete('users');
      return prev;
    });
  };

  const setTag_ = (value: string) => setTag(value);
  const setOrder_ = (value: typeof order) => setOrder(value);
  const setOrderBy_ = (value: typeof orderBy) => setOrderBy(value);

  const orderByOptions: { label: string; value: typeof orderBy }[] = [
    { label: t('time'), value: 'time' },
    { label: t('reactions'), value: 'reactions' },
    { label: t('comments'), value: 'comments' },
  ];

  const orderOptions: { label: string; value: typeof order }[] = [
    { label: t('desc'), value: 'desc' },
    { label: t('asc'), value: 'asc' },
  ];

  return {
    orderByOptions,
    orderOptions,
    setters: { setTag: setTag_, setOrder: setOrder_, setOrderBy: setOrderBy_ },
    applyFilters,
    clearAll,
    users,
    setUsers,
  };
};
