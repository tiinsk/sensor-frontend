import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';

import { Card } from './card';
import { Body, Label } from './typography';

const meta = {
  title: 'v2/Card',
  component: Card,
  tags: ['autodocs'],
} satisfies Meta<typeof Card>;

export default meta;
type Story = StoryObj<typeof meta>;

const Placeholder = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.s8};
`;

export const Empty: Story = {
  args: {},
};

export const WithContent: Story = {
  args: {
    children: (
      <Placeholder>
        <Label>Card</Label>
        <Body>Any content can go here.</Body>
      </Placeholder>
    ),
  },
};
