import { Icon } from '@iconify/react/dist/iconify.js';
import { ActionIcon, Affix, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { useTranslation } from 'react-i18next';
import { icons } from '~/lib/icons';

export const ScrollToTop = () => {
  const [scroll, scrollTo] = useWindowScroll();
  const { t } = useTranslation();
  return (
    <Affix position={{ bottom: 60, right: 10 }}>
      <Transition transition='slide-up' mounted={scroll.y > 120}>
        {(transitionStyles) => (
          // <Tooltip label={t('scroll_to_top')}>
          <ActionIcon
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}
            variant='light'
          >
            <Icon icon={icons.arrowUp} />
          </ActionIcon>
          // </Tooltip>
        )}
      </Transition>
    </Affix>
  );
};
