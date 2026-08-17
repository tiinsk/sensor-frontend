import type { Meta, StoryObj } from '@storybook/react-vite';
import styled from 'styled-components';

import { units } from '../../../../utils/unit';
import { Reading } from './index';

const meta = {
  title: 'v2/Reading',
  component: Reading,
  tags: ['autodocs'],
  args: {
    value: 25.5,
    unit: 'co2',
    variant: 'default',
    size: 'default',
    isLoading: false,
  },
  argTypes: {
    variant: {
      control: 'select',
      options: ['default', 'min', 'max', 'avg', 'colorMarker'],
    },
    size: {
      control: 'select',
      options: ['default', 'small'],
    },
    unit: {
      control: 'select',
      options: units,
    },
    isLoading: { control: 'boolean' },
    showTitle: { control: 'boolean' },
  },
} satisfies Meta<typeof Reading>;

export default meta;
type Story = StoryObj<typeof meta>;

const Stack = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
`;

const Catalog = styled.div`
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
  color: ${({ theme }) => theme.v2.colors.text.secondary};
`;

const Row = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: ${({ theme }) => theme.spacings.s24};
  align-items: flex-start;
`;

export const All: Story = {
  render: args => (
    <Catalog>
      <Group>
        <GroupTitle>Default</GroupTitle>
        <Row>
          <Reading
            {...args}
            variant="default"
            size="default"
            isLoading={false}
          />
          <Reading {...args} variant="default" size="small" isLoading={false} />
        </Row>
      </Group>
      <Group>
        <GroupTitle>With Title</GroupTitle>
        <Row>
          <Reading
            {...args}
            variant="default"
            size="default"
            showTitle={true}
            isLoading={false}
          />
          <Reading
            {...args}
            variant="default"
            size="small"
            showTitle={true}
            isLoading={false}
          />
        </Row>
      </Group>
      <Group>
        <GroupTitle>Min, max, avg, and color marker</GroupTitle>
        <Row>
          <Stack>
            <Reading {...args} variant="avg" size="default" isLoading={false} />
            <Reading
              {...args}
              variant="max"
              value={55.2}
              size="default"
              isLoading={false}
            />
            <Reading
              {...args}
              variant="min"
              value={27.8}
              size="default"
              isLoading={false}
            />
            <Reading
              {...args}
              variant="colorMarker"
              size="default"
              isLoading={false}
            />
          </Stack>
          <Stack>
            <Reading {...args} variant="avg" size="small" isLoading={false} />
            <Reading
              {...args}
              variant="max"
              value={55.2}
              size="small"
              isLoading={false}
            />
            <Reading
              {...args}
              variant="min"
              value={27.8}
              size="small"
              isLoading={false}
            />
            <Reading
              {...args}
              variant="colorMarker"
              size="small"
              isLoading={false}
            />
          </Stack>
        </Row>
      </Group>
      <Group>
        <GroupTitle>Loading</GroupTitle>
        <Row>
          <Reading {...args} variant="default" size="default" isLoading />
          <Reading {...args} variant="default" size="small" isLoading />
        </Row>
        <Row>
          <Reading
            {...args}
            variant="default"
            size="default"
            showTitle={true}
            isLoading
          />
          <Reading
            {...args}
            variant="default"
            size="small"
            showTitle={true}
            isLoading
          />
        </Row>
        <Row>
          <Reading {...args} variant="colorMarker" size="default" isLoading />
          <Reading {...args} variant="colorMarker" size="small" isLoading />
        </Row>
        <Row>
          <Reading {...args} variant="min" size="default" isLoading />
          <Reading {...args} variant="min" size="small" isLoading />
        </Row>
        <Row>
          <Reading {...args} variant="avg" size="default" isLoading />
          <Reading {...args} variant="avg" size="small" isLoading />
        </Row>
        <Row>
          <Reading {...args} variant="max" size="default" isLoading />
          <Reading {...args} variant="max" size="small" isLoading />
        </Row>
      </Group>
    </Catalog>
  ),
};

export const Default: Story = {};
