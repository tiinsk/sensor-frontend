import { css } from 'styled-components';

export const H1Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.fontHeader};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: 3.4rem;
  line-height: 4.1rem;
`;

export const H2Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.fontHeader};
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: 2.9rem;
  line-height: 3.4rem;
`;

export const H3Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.fontHeader};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: 2.4rem;
  line-height: 2.8rem;
`;

export const H4Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.fontHeader};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: 1.6rem;
  line-height: 2.4rem;
  text-transform: uppercase;
`;

export const BodyLightStyle = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.fontBody};
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: 1.6rem;
  line-height: 2.4rem;
`;

export const BodyStyle = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.fontBody};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: 1.6rem;
  line-height: 2.4rem;
`;

export const PageTitleStyle = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.fontBody};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: 1.6rem;
  line-height: 2rem;
  text-transform: uppercase;
  text-decoration: none;
`;

export const Caption2LightStyle = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.fontBody};
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: 1.2rem;
  line-height: 1.4rem;
`;

export const Caption2Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.fontBody};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: 1.2rem;
  line-height: 1.4rem;
`;

export const Caption3Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.fontBody};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: 1rem;
  line-height: 1.2rem;
`;
