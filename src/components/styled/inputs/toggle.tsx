import { Flex } from '../flex';
import styled, { css, DefaultTheme } from 'styled-components';
import { Caption2LightStyle } from '../../../theme/typography';
import { VisuallyHidden } from '../index';

const StyledInput = styled.input`
  ${VisuallyHidden};
`;

const StyledLabel = styled.label<{ $disabled: boolean }>`
  ${Caption2LightStyle};
  display: flex;
  align-items: center;
  cursor: ${({ $disabled }) => ($disabled ? 'default' : 'pointer')};
  user-select: none;
`;

const DisabledStyle = ({
  theme,
  $isSelected,
}: {
  theme: DefaultTheme;
  $isSelected: boolean;
}) => css`
  background-color: ${$isSelected
    ? theme.colors.icons.successDisabled
    : theme.colors.icons.primaryDisabled};
`;

const ToggleWrapper = styled.div<{ $isSelected: boolean; $disabled: boolean }>`
  position: relative;

  margin: ${({ theme }) => theme.spacings.s4};
  margin-right: ${({ theme }) => theme.spacings.s16};

  padding: ${({ theme }) => theme.spacings.s4};
  background-color: ${({ theme, $isSelected }) =>
    $isSelected ? theme.colors.icons.success : theme.colors.icons.primary};
  width: ${({ theme }) => theme.spacings.s48};
  border-radius: ${({ theme }) => theme.spacings.s24};

  ${({ $disabled }) => $disabled && DisabledStyle};
`;

const UnselectedCircleStyle = ({ theme }: { theme: DefaultTheme }) => css`
  left: 0;
`;

const ToggleCircle = styled.div<{ $isSelected: boolean; $disabled: boolean }>`
  position: relative;
  left: ${({ theme }) => theme.spacings.s24};
  transition:
    left 0.1s ease-in,
    background-color 0.1s ease-in;

  width: ${({ theme }) => theme.spacings.s16};
  height: ${({ theme }) => theme.spacings.s16};
  background-color: ${({ theme }) => theme.colors.icons.background};
  border-radius: ${({ theme }) => theme.spacings.s8};

  ${({ $isSelected }) => !$isSelected && UnselectedCircleStyle};
`;

interface ToggleProps {
  name: string;
  text?: string;
  onChange?: (value: boolean) => void;
  isSelected?: boolean;
  disabled?: boolean;
}

export const Toggle = ({
  text,
  isSelected = false,
  onChange,
  disabled = false,
  name,
}: ToggleProps) => {
  return (
    <Flex>
      <StyledInput
        type="checkbox"
        checked={isSelected}
        id={name}
        name={name}
        onChange={({ target }) => onChange?.(!isSelected)}
        disabled={disabled}
      ></StyledInput>
      <StyledLabel htmlFor={name} $disabled={disabled}>
        <ToggleWrapper $disabled={disabled} $isSelected={isSelected}>
          <ToggleCircle $disabled={disabled} $isSelected={isSelected} />
        </ToggleWrapper>
        <span>{text}</span>
      </StyledLabel>
    </Flex>
  );
};
