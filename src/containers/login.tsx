import React, { FormEvent, useState } from 'react';
import styled from 'styled-components';
import { useNavigate } from 'react-router-dom';

import api from '../api/routes';
import { setJWTToken } from '../utils/auth';
import { Button } from '../components/styled/buttons';
import { LoginIcon } from '../assets/icons/login-icon';
import { Input, StyledError } from '../components/styled/inputs/input';
import { Box } from '../components/styled/box';
import { PageTitle } from '../components/styled/typography';

const StyledLogin = styled.div`
  display: flex;
  height: 100vh;
`;
const LeftSide = styled.div`
  flex-basis: 50%;
  background-color: ${({ theme }) => theme.colors.background.secondary};

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const RightSide = styled.div`
  flex-basis: 50%;
  background-color: ${({ theme }) => theme.colors.background.primary};

  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
`;

const Form = styled.form`
  display: flex;
  flex-direction: column;
  width: 300px;
`;

export const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState<{
    statusCode: number;
    message: string;
  } | null>(null);
  const navigate = useNavigate();

  const onLogin = async (event: FormEvent) => {
    event.preventDefault();
    const response = await api.login({
      username,
      password,
    });
    if (response.error) {
      setError(response.error);
    } else {
      setJWTToken(response.data);
      navigate('/', { replace: true });
    }
  };

  const onChangeUsername = (value: string) => {
    setUsername(value);
  };

  const onChangePassword = (value: string) => {
    setPassword(value);
  };

  return (
    <StyledLogin>
      <LeftSide>
        <LoginIcon />
        <PageTitle mt="s16">Home monitor</PageTitle>
      </LeftSide>
      <RightSide>
        <Form onSubmit={onLogin}>
          <Box mb="s16">
            <Input
              name="login-username"
              label="Username"
              value={username}
              onChange={name => onChangeUsername(name)}
            />
            <Input
              name="login-password"
              type="password"
              label="Password"
              value={password}
              onChange={password => onChangePassword(password)}
            />
            {error && error.statusCode === 401 && (
              <StyledError>Invalid username or password</StyledError>
            )}
          </Box>
          <Button disabled={!username || !password} text="Login" />
        </Form>
      </RightSide>
    </StyledLogin>
  );
};
