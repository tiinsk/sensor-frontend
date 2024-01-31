import styled, { css, useTheme } from 'styled-components';
import {
  SnackbarVariant,
  useSnackbarContext,
} from '../../../contexts/snackbar-context';
import { Flex } from '../flex';
import { MdiIcon } from '../mdi-icon';
import { Button, StyledButton } from '../buttons';
import { Body, Caption2Light } from '../typography';

export const CLOSE_TIMEOUT = 300;

const SuccessStyle = css`
  background-color: ${({ theme }) => theme.colors.success.reversed.background};
  color: ${({ theme }) => theme.colors.success.reversed.typography};

  ${StyledButton} {
    color: ${({ theme }) => theme.colors.success.reversed.typography};
  }
`;
const ErrorStyle = css`
  background-color: ${({ theme }) => theme.colors.error.reversed.background};
  color: ${({ theme }) => theme.colors.error.reversed.typography};

  ${StyledButton} {
    color: ${({ theme }) => theme.colors.error.reversed.typography};
  }
`;

const StyledSnackbar = styled.div<{
  $variant?: SnackbarVariant;
}>`
  display: flex;
  gap: ${({ theme }) => theme.spacings.s16};
  justify-content: space-between;
  align-items: center;

  padding: ${({ theme }) => theme.spacings.s8}
    ${({ theme }) => theme.spacings.s16};
  border-radius: ${({ theme }) => theme.spacings.s4};

  ${({ $variant }) => $variant === 'success' && SuccessStyle};
  ${({ $variant }) => $variant === 'error' && ErrorStyle};

  transition: transform ${CLOSE_TIMEOUT}ms ease-out;
`;

export const Snackbar = () => {
  const { spacings } = useTheme();
  const { snackbar, state, closeSnackbar } = useSnackbarContext();
  return (
    <StyledSnackbar
      $variant={snackbar?.variant}
      style={{
        paddingRight: snackbar?.isCloseable ? spacings.s8 : spacings.s16,
        transform: `translate(0, -${state === 'open' ? 0 : spacings.s80})`,
      }}
    >
      <Flex gap="s16" alignItems="center">
        <MdiIcon
          type={
            snackbar?.variant === 'success'
              ? 'mdiCheck'
              : 'mdiAlertCircleOutline'
          }
        />
        <Flex flexDirection="column">
          <Body>{snackbar?.title}</Body>
          <Caption2Light>{snackbar?.body}</Caption2Light>
        </Flex>
      </Flex>
      {snackbar?.isCloseable && (
        <Button
          iconLeft="mdiClose"
          variant="basic"
          sizeVariant="small"
          onClick={() => closeSnackbar()}
        />
      )}
    </StyledSnackbar>
  );
};
