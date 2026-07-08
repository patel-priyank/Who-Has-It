'use client';

import { ChakraProvider, createSystem, defaultConfig } from '@chakra-ui/react';

import { ColorModeProvider, type ColorModeProviderProps } from './color-mode';

const system = createSystem(defaultConfig, {
  globalCss: {
    body: {
      colorPalette: 'pink'
    }
  },
  theme: {
    tokens: {
      fonts: {
        body: {
          value: 'var(--font-archivo), Inter, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji'
        },
        heading: {
          value: 'var(--font-archivo), Inter, system-ui, sans-serif, Apple Color Emoji, Segoe UI Emoji'
        }
      }
    }
  }
});

export function Provider(props: ColorModeProviderProps) {
  return (
    <ChakraProvider value={system}>
      <ColorModeProvider {...props} />
    </ChakraProvider>
  );
}
