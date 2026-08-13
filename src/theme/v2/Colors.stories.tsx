import type { Meta, StoryObj } from '@storybook/react-vite';
import styled, { useTheme } from 'styled-components';

import type { ColorTheme } from './colors';

const meta = {
  title: 'v2/Colors',
} satisfies Meta;

export default meta;
type Story = StoryObj<typeof meta>;

type ColorLeaf = { path: string; value: string; background?: string };

const collectLeaves = (node: unknown, path: string[] = []): ColorLeaf[] => {
  if (typeof node === 'string') {
    return [{ path: path.join('.'), value: node }];
  }
  if (node && typeof node === 'object') {
    return Object.entries(node).flatMap(([key, value]) =>
      collectLeaves(value, [...path, key]),
    );
  }
  return [];
};

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.s32};
`;

const Group = styled.section`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.s16};
`;

const GroupTitle = styled.h2`
  margin: 0;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 1.6rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.v2.colors.text.primary};
`;

const SwatchGrid = styled.div`
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(14rem, 1fr));
  gap: ${({ theme }) => theme.spacings.s16};
`;

const SwatchCard = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.s8};
  min-width: 0;
`;

const SwatchFrame = styled.div`
  border-radius: ${({ theme }) => theme.radius['8']};
  border: 1px solid ${({ theme }) => theme.v2.colors.stroke['20']};
  overflow: hidden;
`;

const Fill = styled.div<{ $color: string }>`
  height: 6.4rem;
  background-color: ${({ $color }) => $color};
`;

const TextSample = styled.div<{ $color: string; $background: string }>`
  display: flex;
  align-items: center;
  justify-content: center;
  height: 6.4rem;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 2.4rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ $color }) => $color};
  background-color: ${({ $background }) => $background};
`;

const ShadowSample = styled.div<{ $color: string }>`
  height: 6.4rem;
  margin: ${({ theme }) => theme.spacings.s8};
  border-radius: ${({ theme }) => theme.radius['8']};
  background-color: ${({ theme }) => theme.v2.colors.surface.base['10']};
  box-shadow: 0 0.4rem 1.6rem ${({ $color }) => $color};
`;

const SwatchMeta = styled.div`
  display: flex;
  flex-direction: column;
  gap: 0.2rem;
  min-width: 0;
`;

const Path = styled.span`
  font-family: ${({ theme }) => theme.fonts.sans};
  font-size: 1.2rem;
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  color: ${({ theme }) => theme.v2.colors.text.primary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

const Value = styled.span`
  font-family: ${({ theme }) => theme.fonts.mono};
  font-size: 1.1rem;
  color: ${({ theme }) => theme.v2.colors.text.secondary};
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
`;

type SwatchKind = 'fill' | 'text' | 'shadow';

const Swatch = ({
  path,
  value,
  background,
  kind,
}: ColorLeaf & {
  kind: SwatchKind;
}) => (
  <SwatchCard>
    <SwatchFrame>
      {kind === 'fill' && <Fill $color={value} />}
      {kind === 'text' && (
        <TextSample $color={value} $background={background ?? value}>
          Aa
        </TextSample>
      )}
      {kind === 'shadow' && <ShadowSample $color={value} />}
    </SwatchFrame>
    <SwatchMeta>
      <Path title={path}>{path}</Path>
      <Value title={value}>{value}</Value>
    </SwatchMeta>
  </SwatchCard>
);

const ColorGroup = ({
  title,
  tokens,
  leaves,
  kind,
}: {
  title: string;
  tokens?: unknown;
  leaves?: ColorLeaf[];
  kind: SwatchKind;
}) => {
  const items = leaves ?? collectLeaves(tokens);
  return (
    <Group>
      <GroupTitle>{title}</GroupTitle>
      <SwatchGrid>
        {items.map(leaf => (
          <Swatch key={leaf.path} {...leaf} kind={kind} />
        ))}
      </SwatchGrid>
    </Group>
  );
};

const useV2Colors = (): ColorTheme => useTheme().v2.colors;

const AllGroups = () => {
  const colors = useV2Colors();
  return (
    <Stack>
      <ColorGroup
        title="surface.base"
        tokens={colors.surface.base}
        kind="fill"
      />
      <ColorGroup
        title="surface.contrast"
        tokens={{ contrast: colors.surface.contrast }}
        kind="fill"
      />
      <ColorGroup
        title="surface.deep"
        tokens={colors.surface.deep}
        kind="fill"
      />
      <ColorGroup
        title="surface.elevated"
        tokens={colors.surface.elevated}
        kind="fill"
      />
      <ColorGroup
        title="surface.accent"
        tokens={colors.surface.accent}
        kind="fill"
      />
      <ColorGroup
        title="surface.foreground"
        tokens={colors.surface.foreground}
        kind="fill"
      />
      <ColorGroup
        title="surface.success"
        tokens={colors.surface.success}
        kind="fill"
      />
      <ColorGroup
        title="surface.status"
        tokens={{
          error: colors.surface.error,
          warn: colors.surface.warn,
          pressure: colors.surface.pressure,
          humidity: colors.surface.humidity,
        }}
        kind="fill"
      />
      <ColorGroup title="stroke" tokens={colors.stroke} kind="fill" />
      <ColorGroup
        title="text"
        kind="text"
        leaves={[
          {
            path: 'primary',
            value: colors.text.primary,
            background: colors.surface.base['30'],
          },
          {
            path: 'secondary',
            value: colors.text.secondary,
            background: colors.surface.base['30'],
          },
          {
            path: 'tertiary',
            value: colors.text.tertiary,
            background: colors.surface.base['30'],
          },
          {
            path: 'disabled',
            value: colors.text.disabled,
            background: colors.surface.base['30'],
          },
          {
            path: 'onContrast',
            value: colors.text.onContrast,
            background: colors.surface.contrast,
          },
          {
            path: 'error',
            value: colors.text.error,
            background: colors.surface.error,
          },
          {
            path: 'success',
            value: colors.text.success,
            background: colors.surface.success['20'],
          },
          {
            path: 'warn',
            value: colors.text.warn,
            background: colors.surface.warn,
          },
          {
            path: 'pressure',
            value: colors.text.pressure,
            background: colors.surface.pressure,
          },
          {
            path: 'humidity',
            value: colors.text.humidity,
            background: colors.surface.humidity,
          },
        ]}
      />
      <ColorGroup
        title="text.onAccent"
        kind="text"
        leaves={[
          {
            path: 'default',
            value: colors.text.onAccent.default,
            background: colors.surface.accent.default,
          },
          {
            path: 'disabled',
            value: colors.text.onAccent.disabled,
            background: colors.surface.accent.disabled,
          },
          {
            path: 'error',
            value: colors.text.onAccent.error,
            background: colors.surface.error,
          },
          {
            path: 'success',
            value: colors.text.onAccent.success,
            background: colors.surface.success['20'],
          },
          {
            path: 'warn',
            value: colors.text.onAccent.warn,
            background: colors.surface.warn,
          },
          {
            path: 'pressure',
            value: colors.text.onAccent.pressure,
            background: colors.surface.pressure,
          },
          {
            path: 'humidity',
            value: colors.text.onAccent.humidity,
            background: colors.surface.humidity,
          },
        ]}
      />
      <ColorGroup title="shadow" tokens={colors.shadow} kind="shadow" />
    </Stack>
  );
};

export const All: Story = {
  render: () => <AllGroups />,
};
