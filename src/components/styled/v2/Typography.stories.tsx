import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';

import type { Font } from '../../../theme';
import {
  Body,
  BodyLight,
  Caption1,
  Caption2,
  H1,
  H2,
  H3,
  H4,
  Label,
  PageTitle,
} from './typography';

type TypographyStoryArgs = {
  children: string;
  font: Font;
  isLoading: boolean;
};

const meta = {
  title: 'v2/Typography',
  tags: ['autodocs'],
  args: {
    children: 'Lorem ipsum dolor sit amet',
    font: 'sans',
    isLoading: false,
  },
  argTypes: {
    font: {
      control: 'select',
      options: ['sans', 'mono'],
    },
    isLoading: { control: 'boolean' },
    children: { control: 'text' },
  },
} satisfies Meta<TypographyStoryArgs>;

export default meta;
type Story = StoryObj<TypographyStoryArgs>;

const Scale = styled.div`
  display: flex;
  flex-direction: column;
  gap: 16px;
`;

const SkeletonStack = styled.div`
  display: flex;
  flex-direction: column;
  gap: 24px;
`;

const SideBySide = styled.div`
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 24px;
  align-items: center;
`;

const Column = styled.div`
  min-width: 0;
`;

const TruncatedColumn = styled(Column)`
  > * {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
    width: 100%;
    min-width: 0;
  }
`;
const renderScale = (args: TypographyStoryArgs) => (
  <Scale>
    <PageTitle isLoading={args.isLoading}>Home monitor</PageTitle>
    <H1 font={args.font} isLoading={args.isLoading}>
      H1 — {args.children}
    </H1>
    <H2 font={args.font} isLoading={args.isLoading}>
      H2 — {args.children}
    </H2>
    <H3 font={args.font} isLoading={args.isLoading}>
      H3 — {args.children}
    </H3>
    <H4 font={args.font} isLoading={args.isLoading}>
      H4 — {args.children}
    </H4>
    <Body font={args.font} isLoading={args.isLoading}>
      Body — {args.children}
    </Body>
    <BodyLight isLoading={args.isLoading}>
      Body light — {args.children}
    </BodyLight>
    <Caption1 font={args.font} isLoading={args.isLoading}>
      Caption1 — {args.children}
    </Caption1>
    <Caption2 font={args.font} isLoading={args.isLoading}>
      Caption2 — {args.children}
    </Caption2>
    <Label font={args.font} isLoading={args.isLoading}>
      Label — {args.children}
    </Label>
  </Scale>
);

export const Sans: Story = {
  args: { font: 'sans' },
  render: renderScale,
};

export const Mono: Story = {
  args: { font: 'mono' },
  render: renderScale,
};

export const Loading: Story = {
  args: { isLoading: true },
  render: renderScale,
};

export const WithSkeletons: Story = {
  render: args => (
    <SkeletonStack>
      <SideBySide>
        <TruncatedColumn>
          <PageTitle>Home monitor</PageTitle>
        </TruncatedColumn>
        <Column>
          <PageTitle isLoading />
        </Column>
      </SideBySide>
      <SideBySide>
        <TruncatedColumn>
          <H1 font={args.font}>H1 — {args.children}</H1>
        </TruncatedColumn>
        <Column>
          <H1 font={args.font} isLoading />
        </Column>
      </SideBySide>
      <SideBySide>
        <TruncatedColumn>
          <H2 font={args.font}>H2 — {args.children}</H2>
        </TruncatedColumn>
        <Column>
          <H2 font={args.font} isLoading />
        </Column>
      </SideBySide>
      <SideBySide>
        <TruncatedColumn>
          <H3 font={args.font}>H3 — {args.children}</H3>
        </TruncatedColumn>
        <Column>
          <H3 font={args.font} isLoading />
        </Column>
      </SideBySide>
      <SideBySide>
        <TruncatedColumn>
          <H4 font={args.font}>H4 — {args.children}</H4>
        </TruncatedColumn>
        <Column>
          <H4 font={args.font} isLoading />
        </Column>
      </SideBySide>
      <SideBySide>
        <TruncatedColumn>
          <Body font={args.font}>Body — {args.children}</Body>
        </TruncatedColumn>
        <Column>
          <Body font={args.font} isLoading />
        </Column>
      </SideBySide>
      <SideBySide>
        <TruncatedColumn>
          <BodyLight>Body light — {args.children}</BodyLight>
        </TruncatedColumn>
        <Column>
          <BodyLight isLoading />
        </Column>
      </SideBySide>
      <SideBySide>
        <TruncatedColumn>
          <Caption1 font={args.font}>Caption1 — {args.children}</Caption1>
        </TruncatedColumn>
        <Column>
          <Caption1 font={args.font} isLoading />
        </Column>
      </SideBySide>
      <SideBySide>
        <TruncatedColumn>
          <Caption2 font={args.font}>Caption2 — {args.children}</Caption2>
        </TruncatedColumn>
        <Column>
          <Caption2 font={args.font} isLoading />
        </Column>
      </SideBySide>
      <SideBySide>
        <TruncatedColumn>
          <Label font={args.font}>Label — {args.children}</Label>
        </TruncatedColumn>
        <Column>
          <Label font={args.font} isLoading />
        </Column>
      </SideBySide>
    </SkeletonStack>
  ),
};
