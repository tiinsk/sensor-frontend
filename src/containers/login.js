import React, { useState } from 'react';
import styled from 'styled-components/macro';
import { useHistory } from 'react-router-dom';

import api from '../api/routes';
import HeaderLogo, {StyledHeaderLogo} from '../components/header/header-logo';
import {setJWTToken} from '../utils/auth';

const StyledLogin = styled.div`
  height: calc(100vh - 2*${({theme}) => theme.baseSize});
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  
  ${StyledHeaderLogo} {
    flex-grow: 0;
    margin-bottom: ${({theme}) => theme.baseSizePartial(2)};
    margin-right: ${({theme}) => theme.baseSize};
  }
`;

const StyledLoginContent = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
`;

const StyledLabel = styled.label`
  display: block;
  color: ${({theme}) => theme.colors.lightBlue};
  text-transform: uppercase;
  font-weight: ${({theme}) => theme.fontWeightThin};
  font-size: ${({theme}) => theme.fontSizeSmall};
  padding-bottom: ${({theme}) => theme.baseSizePartial(0.5)};
`;

const StyledInput = styled.input`
  border: none;
  background: ${({theme}) => theme.colors.blueGraphBackground};
  border-radius: ${({theme}) => theme.baseSizePartial(1)};
  outline: none;
  padding:  ${({theme}) => theme.baseSizePartial(0.5)};
  margin-bottom: ${({theme}) => theme.baseSizePartial(1)};
  color: white;
  width: 100%;
`;

const StyledError = styled.div`
  color: ${({theme}) => theme.colors.errorRed};
  font-size: ${({theme}) => theme.fontSizeXSmall};
  margin-bottom: ${({theme}) => theme.baseSizePartial(0.5)};
`;

const StyledLoginButton = styled.button`
  background: none;
  align-self: flex-end;
  
  color: ${props => props.theme.colors.lightBlueBrighter};
  padding: ${({theme}) => theme.baseSizePartial(0.5)} ${({theme}) => theme.baseSizePartial(1)};
  
  border: none;
  border-bottom: 2px solid ${props => props.theme.colors.greenBright};
  
  cursor: pointer;
  outline: none;
  
  &:disabled {
    opacity: 0.5;
    cursor: default;
  }
`;

const Login = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const history = useHistory();

  const onLogin = async () => {
    const response = await api.login({
      username,
      password
    });
    if(response.error) {
      setError(response.error);
    } else {
      setJWTToken(response);
      history.replace('');
    }
  }

  const onChangeUsername = (value) => {
    setUsername(value);
  }

  const onChangePassword = (value) => {
    setPassword(value);
  }

  return (
    <StyledLogin>
      <StyledLoginContent>
        <HeaderLogo/>
        <StyledLabel>
          Username
        </StyledLabel>
        <StyledInput onChange={({target}) => onChangeUsername(target.value)} value={username}/>
        <StyledLabel>
          Password
        </StyledLabel>
        <StyledInput type="password" onChange={({target}) => onChangePassword(target.value)} value={password}/>
        {error && error.statusCode === 401 && <StyledError>Login failed. Invalid username or password.</StyledError>}
        <StyledLoginButton onClick={onLogin} disabled={!username || !password}>Login</StyledLoginButton>
      </StyledLoginContent>
    </StyledLogin>
  );
}

export default Login;
