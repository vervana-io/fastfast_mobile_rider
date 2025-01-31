import {extendTheme} from 'native-base';
const themeOverrides = {
  colors: {
    primary: {
      50: '#ddfff2',
      100: '#b0ffdd',
      200: '#80ffc8',
      300: '#50ffb3',
      400: '#28ff9d',
      500: '#18e683',
      600: '#0ab366',
      700: '#008048',
      800: '#004d2a',
      900: '#001b0b',
    },
    themeLight: {
      accent: '#009655',
      warning: '#F2AC57',
      success: '#189049',
      error: '#EE4B4B',
      primary: {
        base: '#1B7A41',
        light1: '#E5F9EE',
        light2: '#F2F9F5',
        white: '#FAFFFB',
      },
      gray: {
        1: '#2B2F2D',
        2: '#757575',
        3: '#E0E0E0',
        4: '#F6F6F6',
      },
    },
    themeDark: {
      accent: '#2EAB6F',
      warning: '#C0925B',
      success: '#388F5C',
      error: '#CC5555',
      primary: {
        base: '#499D6A',
        light1: '#B6E7CC',
        light2: '#E4F8ED',
        white: '#FAFFFB',
      },
      gray: {
        1: '#252726',
        2: '#3C403E',
        3: '#565957',
        4: '#7E8480',
      },
    },
    textSecondary: '#6F7175',
  },
  // fontConfig: {
  //   Inter: {
  //     100: {
  //       normal: 'Rany-Light',
  //       italic: 'Inter-Italic',
  //     },
  //     200: {
  //       normal: 'Rany-Light',
  //       italic: 'Inter-Thin',
  //     },
  //     300: {
  //       normal: 'Inter-Light',
  //       italic: 'Inter-Light',
  //     },
  //     400: {
  //       normal: 'Inter-Regular',
  //       italic: 'Inter-Light',
  //     },
  //     500: {
  //       normal: 'Inter-Medium',
  //     },
  //     600: {
  //       normal: 'Inter-SemiBold',
  //       italic: 'Inter-Medium',
  //     },
  //     700: {
  //       normal: 'Inter-Bold',
  //       italic: 'Inter-Medium',
  //     },
  //     800: {
  //       normal: 'Inter-ExtraBold',
  //       italic: 'Inter-Medium',
  //     },
  //     900: {
  //       normal: 'Inter-Black',
  //       italic: 'Inter-Bold',
  //     },
  //   },
  // },
  fonts: {
    heading: 'Rany',
    body: 'Rany',
    mono: 'Rany',
  },
  letterSpacings: {
    xs: '-0.05em',
    sm: '-0.025em',
    md: 0,
    lg: '0.025em',
    xl: '0.05em',
    '2xl': '0.1em',
  },
  lineHeights: {
    '2xs': '1em',
    xs: '1.125em',
    sm: '1.25em',
    md: '1.375em',
    lg: '1.5em',
    xl: '1.75em',
    '2xl': '2em',
    '3xl': '2.5em',
    '4xl': '3em',
    '5xl': '4em',
  },
  fontWeights: {
    hairline: 100,
    thin: 200,
    light: 300,
    normal: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
    extrabold: 800,
    black: 900,
    extrablack: 950,
  },
  fontSizes: {
    '2xs': 10,
    xs: 12,
    sm: 14,
    md: 16,
    lg: 18,
    xl: 20,
    '2xl': 24,
    '3xl': 30,
    '4xl': 36,
    '5xl': 48,
    '6xl': 60,
    '7xl': 72,
    '8xl': 96,
    '9xl': 128,
  },
  config: {
    // Changing initialColorMode to 'dark'
    useSystemColorMode: true,
    initialColorMode: 'light',
  },
  components: {
    Button: {
      variants: {
        rounded: ({colorScheme}: any) => {
          return {
            bg: 'themeLight.accent',
            // rounded: 'full',
          };
        },
      },
    },
    Spinner: {
      baseStyle: ({colorMode}: any) => {
        return {
          color: colorMode === 'dark' ? 'themeDark.accent' : 'themeLight.accent',
        };
      },
    },
    Box: {
      baseStyle: ({colorMode}: any) => {
        return {
          color: colorMode === 'dark' ? 'themeDark.accent' : 'transparent',
        };
      },
    },
  },
};

export const theme = extendTheme(themeOverrides);
export const appColors = {
  primary: {
    light: themeOverrides.colors.themeLight.accent,
    main: themeOverrides.colors.themeLight.accent,
    dark: themeOverrides.colors.themeDark.accent,
  },
};
// 2. Get the type of the CustomTheme
export type Theme = typeof theme;
