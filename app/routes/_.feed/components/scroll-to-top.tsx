import { ActionIcon, Affix, Transition } from '@mantine/core';
import { useWindowScroll } from '@mantine/hooks';
import { Icons } from '~/lib/icons';

export const ScrollToTop = () => {
  const [scroll, scrollTo] = useWindowScroll();
  return (
    <Affix position={{ bottom: 60, right: 10 }}>
      <Transition transition='slide-up' mounted={scroll.y > 120}>
        {(transitionStyles) => (
          <ActionIcon
            style={transitionStyles}
            onClick={() => scrollTo({ y: 0 })}
            variant='light'
          >
            <Icons.up />
          </ActionIcon>
        )}
      </Transition>
    </Affix>
  );
};
