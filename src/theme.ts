import { colorsTuple, createTheme, type CSSVariablesResolver } from "@mantine/core";

export const theme = createTheme({
    fontFamily: 'Inter',
    white: '#ffffff',
    black: '#000000',
    colors: {
        'endfield-yellow': colorsTuple('#fffa00'),
    }
});

export const resolver: CSSVariablesResolver = (theme) => ({
    variables: {
        // '--mantine-hero-height': theme.other.heroHeight,
    },
    light: {
        '--mantine-color-text': theme.black,
    },
    dark: {
        '--mantine-color-text': theme.white,
    },
});