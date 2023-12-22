import styled from 'styled-components';
import { Caption2Style } from '../../../theme/typography';

const StyledInputWrapper = styled.div`
  padding: ${({ theme }) => theme.spacings.s8} 0;

  display: flex;
  flex-direction: column;
  gap: ${({ theme }) => theme.spacings.s8};

  width: 100%;
`;

const StyledInput = styled.input`
  background-color: ${({ theme }) => theme.colors.background.secondary};
  border: 1px solid ${({ theme }) => theme.colors.borders.primary};
  border-radius: ${({ theme }) => theme.spacings.s4};
  color: ${({ theme }) => theme.colors.typography.primary};
  outline: none;

  padding: ${({ theme }) => theme.spacings.s16};
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
  color: ${({ theme }) => theme.colors.error.plain};
`;

interface InputProps {
  name: string;
  label?: string;
  placeholder?: string;
  onChange?: (value: string) => void;
  disabled?: boolean;
  value: string;
  type?: 'input' | 'password';
  error?: string;
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
  ...props
}: InputProps) => {
  return (
    <StyledInputWrapper {...props}>
      <StyledLabel htmlFor={name} $disabled={disabled}>
        {label}
      </StyledLabel>
      <StyledInput
        type={type}
        id={name}
        name={name}
        value={value}
        onChange={({ target }) => onChange?.(target.value)}
        disabled={disabled}
        placeholder={placeholder}
      ></StyledInput>
      {error && <StyledError>{error}</StyledError>}
    </StyledInputWrapper>
  );
};
