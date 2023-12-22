import React from 'react';
import styled from 'styled-components';
import { SelectContext } from './select-context';
import { useListItem } from '@floating-ui/react';
import { Caption2Style } from '../../../theme/typography';

interface OptionProps {
  label: string;
  value: string;
}

export const StyledOption = styled.button<{ $isActive: boolean }>`
  padding: ${({ theme }) => theme.spacings.s12}
    ${({ theme }) => theme.spacings.s12};
  ${Caption2Style};
  cursor: pointer;
  outline: none;

  text-align: left;

  border-radius: ${({ theme }) => theme.spacings.s4};
  border: none;

  &:focus-visible {
    outline: 2px solid ${({ theme }) => theme.colors.typography.primary} !important;
  }

  background-color: ${({ theme, $isActive }) =>
    $isActive ? theme.colors.buttons.backgroundHover.secondary : 'transparent'};
`;

export const Option = ({ label, value }: OptionProps) => {
  const { activeIndex, selectedIndex, getItemProps, handleSelect } =
    React.useContext(SelectContext);

  const { ref, index } = useListItem({ label });

  const isActive = activeIndex === index;
  const isSelected = selectedIndex === index;

  return (
    <StyledOption
      ref={ref}
      role="option"
      aria-selected={isActive && isSelected}
      tabIndex={isActive ? 0 : -1}
      {...getItemProps({
        onClick: () => handleSelect(index, value),
      })}
      $isActive={isActive || isSelected}
    >
      {label}
    </StyledOption>
  );
};
