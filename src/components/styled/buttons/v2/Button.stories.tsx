import type { Meta, StoryObj } from '@storybook/react-vite';

import { Button } from './index';

const meta = {
  title: 'v2/Button',
  component: Button,
  tags: ['autodocs'],
  args: {
    text: 'Button text',
    variant: 'primary',
    sizeVariant: 'default',
    disabled: false,
    iconLeft: 'mdiCalendarMonthOutline',
    iconRight: 'mdiChevronDown',
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'basic'],
    },
    sizeVariant: {
      control: 'select',
      options: ['default', 'small'],
    },
    iconLeft: { control: 'text' },
    iconRight: { control: 'text' },
    onClick: { action: 'clicked' },
  },
} satisfies Meta<typeof Button>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

export const Secondary: Story = {
  args: { variant: 'secondary' },
};

export const Basic: Story = {
  args: { variant: 'basic' },
};

export const AllVariants: Story = {
  render: args => (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
      {(['primary', 'secondary', 'basic'] as const).map(variant => (
        <div
          key={variant}
          style={{
            display: 'flex',
            gap: 16,
            flexWrap: 'wrap',
            alignItems: 'center',
          }}
        >
          <Button {...args} variant={variant} />
          <Button {...args} variant={variant} disabled />
          <Button {...args} variant={variant} sizeVariant="small" />
          <Button {...args} variant={variant} sizeVariant="small" disabled />
        </div>
      ))}
    </div>
  ),
};
