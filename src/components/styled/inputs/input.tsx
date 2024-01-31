import styled, { useTheme } from 'styled-components';
import { Caption2Style } from '../../../theme/typography';
import { CSSProperties } from 'react';

const StyledInputWrapper = styled.div`
  padding: ${({ theme }) => theme.spacings.s8} 0;

  display: flex;
  flex-direction: column;

  width: 100%;
`;

const StyledInput = styled.input<{ $variant: 'default' | 'small' }>`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.borders.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  color: ${({ theme }) => theme.colors.typography.primary};
  outline: none;

  padding: ${({ $variant, theme }) =>
    $variant === 'default' ? theme.spacings.s16 : theme.spacings.s8};
  width: 100%;

  &:focus {
    border-color: ${({ theme }) => theme.colors.borders.primaryHover};
  }

  &:disabled {
    background-color: ${({ theme }) => theme.colors.background.disabled};
  }
`;

const StyledLabel = styled.label<{ $disabled: boolean }>`
  ${Caption2Style};
`;

export const StyledError = styled.div`
  ${Caption2Style};
  line-height: ${({ theme }) => theme.spacings.s12};
  color: ${({ theme }) => theme.colors.error.plainTypography};
  min-height: ${({ theme }) => theme.spacings.s12};
  margin-top: ${({ theme }) => theme.spacings.s4};
  margin-bottom: ${({ theme }) => theme.spacings.s4};
`;

interface InputProps {
  name?: string;
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  value: string;
  type?: 'input' | 'password' | 'number';
  error?: string;
  style?: CSSProperties;
  variant?: 'default' | 'small';
}

export const Input = ({
  name,
  label,
  disabled = false,
  onChange,
  placeholder,
  value,
  type = 'input',
  error,
  variant = 'default',
  ...props
}: InputProps) => {
  const { spacings } = useTheme();
  return (
    <StyledInputWrapper {...props}>
      {label && (
        <StyledLabel htmlFor={name} $disabled={disabled}>
          {label}
        </StyledLabel>
      )}
      <StyledInput
        $variant={variant}
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={({ target }) => onChange?.(target.value)}
        disabled={disabled}
        placeholder={placeholder}
        style={{ marginTop: label ? spacings.s8 : spacings.s16 }}
      ></StyledInput>
      <StyledError>{error}</StyledError>
    </StyledInputWrapper>
  );
};
