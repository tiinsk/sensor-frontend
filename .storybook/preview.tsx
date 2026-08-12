import type { Preview, Decorator } from '@storybook/react-vite';
import React from 'react';
import styled, { ThemeProvider } from 'styled-components';

import { darkTheme, lightTheme, type CustomTheme } from '../src/theme';
import { StyledApp } from '../src/app';
import { GlobalStyle } from '../src/theme/v2/global-style';

type ThemeMode = 'light' | 'dark' | 'side-by-side' | 'stacked';

const PreviewApp = styled(StyledApp)<{ $minHeight?: string }>`
  flex: 1;
  min-width: 0;
  padding: ${({ theme }) => theme.spacings.s24};
  background-color: ${({ theme }) => theme.v2.colors.surface.base['30']};
  ${({ $minHeight }) => $minHeight && `min-height: ${$minHeight};`}
`;

const Comparison = styled.div<{ $direction: 'row' | 'column' }>`
  display: flex;
  flex-direction: ${({ $direction }) => $direction};
  width: 100%;
`;

const ThemedPreview = ({
  theme,
  children,
  minHeight,
}: {
  theme: CustomTheme;
  children: React.ReactNode;
  minHeight?: string;
}) => (
  <ThemeProvider theme={theme}>
    <GlobalStyle />
    <PreviewApp $minHeight={minHeight}>{children}</PreviewApp>
  </ThemeProvider>
);

const withTheme: Decorator = (Story, context) => {
  const mode = (context.globals.theme as ThemeMode) || 'light';
  const isDocs = context.viewMode === 'docs';

  if (mode === 'side-by-side') {
    return (
      <Comparison $direction="row">
        <ThemedPreview
          theme={lightTheme}
          minHeight={isDocs ? undefined : '100vh'}
        >
          <Story />
        </ThemedPreview>
        <ThemedPreview
          theme={darkTheme}
          minHeight={isDocs ? undefined : '100vh'}
        >
          <Story />
        </ThemedPreview>
      </Comparison>
    );
  }

  if (mode === 'stacked') {
    return (
      <Comparison $direction="column">
        <ThemedPreview
          theme={lightTheme}
          minHeight={isDocs ? undefined : '50vh'}
        >
          <Story />
        </ThemedPreview>
        <ThemedPreview
          theme={darkTheme}
          minHeight={isDocs ? undefined : '50vh'}
        >
          <Story />
        </ThemedPreview>
      </Comparison>
    );
  }

  return (
    <ThemedPreview
      theme={mode === 'dark' ? darkTheme : lightTheme}
      minHeight={isDocs ? undefined : '100vh'}
    >
      <Story />
    </ThemedPreview>
  );
};

const preview: Preview = {
  parameters: {
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/i,
      },
    },
    layout: 'fullscreen',
    a11y: {
      test: 'todo',
    },
  },
  globalTypes: {
    theme: {
      description: 'Color theme',
      toolbar: {
        title: 'Theme',
        icon: 'circlehollow',
        items: [
          { value: 'light', title: 'Light', icon: 'sun' },
          { value: 'dark', title: 'Dark', icon: 'moon' },
          { value: 'side-by-side', title: 'Side-by-side', icon: 'sidebyside' },
          { value: 'stacked', title: 'Stacked', icon: 'stacked' },
        ],
        dynamicTitle: true,
      },
    },
  },
  initialGlobals: {
    theme: 'light',
  },
  decorators: [withTheme],
};

export default preview;
