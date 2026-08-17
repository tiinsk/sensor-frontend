import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';

import { units } from '../../../utils/unit';
import { Scale } from './scale';

const meta = {
  title: 'v2/Scale',
  component: Scale,
  tags: ['autodocs'],
  args: {
    value: 75,
    unit: 'temperature',
  },
  argTypes: {
    value: { control: { type: 'number' } },
    min: { control: { type: 'number' } },
    max: { control: { type: 'number' } },
    unit: {
      control: 'select',
      options: units,
    },
  },
} satisfies Meta<typeof Scale>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stack = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacings.s24};
  align-items: center;
`;

export const Default: Story = {};

export const WithMinAndMax: Story = {
  args: {
    min: 27.8,
    max: 55.2,
  },
};

export const Units: Story = {
  render: args => (
    <Stack>
      {units.map(unit => (
        <Scale key={unit} {...args} unit={unit} />
      ))}
    </Stack>
  ),
};
