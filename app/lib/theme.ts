import { createTheme, CSSVariablesResolver } from '@mantine/core';

export const theme = createTheme({
  fontFamily: 'Zain',
  other: {
    headerHeight: 60,
    baloo: 'yellow',
  },
});

export const cssVariablesResolver: CSSVariablesResolver = (_theme) => ({
  variables: {
    '--mantine-header-height': _theme.other.headerHeight,
    '--mantine-baloo': _theme.other.baloo,
  },
  dark: {},
  light: {},
});
