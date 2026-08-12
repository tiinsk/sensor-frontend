import type { Meta, StoryObj } from '@storybook/react-vite';
import { MemoryRouter } from 'react-router';

import { LinkButton } from './link';

const meta = {
  title: 'v2/LinkButton',
  component: LinkButton,
  tags: ['autodocs'],
  decorators: [
    Story => (
      <MemoryRouter>
        <Story />
      </MemoryRouter>
    ),
  ],
  args: {
    text: 'Button text',
    to: '/',
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
  },
} satisfies Meta<typeof LinkButton>;

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
          <LinkButton {...args} variant={variant} />
          <LinkButton {...args} variant={variant} disabled />
          <LinkButton {...args} variant={variant} sizeVariant="small" />
          <LinkButton
            {...args}
            variant={variant}
            sizeVariant="small"
            disabled
          />
        </div>
      ))}
    </div>
  ),
};
