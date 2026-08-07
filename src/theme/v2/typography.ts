import { css } from 'styled-components';

export const H1Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.medium};
  font-size: 3.32rem;
  line-height: 4.2rem;
`;

export const H2Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: 2.76rem;
  line-height: 3.5rem;
`;

export const H3Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: 2.3rem;
  line-height: 2.9rem;
`;

export const H4Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: 1.92rem;
  line-height: 2.4rem;
`;

export const BodyLightStyle = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: 1.6rem;
  line-height: 2rem;
`;

export const BodyStyle = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: 1.6rem;
  line-height: 2rem;
`;

export const Caption1Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.light};
  font-size: 1.33rem;
  line-height: 1.7rem;
`;

export const Caption2Style = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: 1.11rem;
  line-height: 1.4rem;
`;

export const LabelStyle = css`
  color: inherit;
  font-family: ${({ theme }) => theme.fonts.sans};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
  font-size: 0.925rem;
  line-height: 1.2rem;
`;

export const MonoH1Style = css`
  ${H1Style};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
`;

export const MonoH2Style = css`
  ${H2Style};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
`;

export const MonoH3Style = css`
  ${H3Style};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const MonoH4Style = css`
  ${H4Style};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const MonoBodyStyle = css`
  ${BodyStyle};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const MonoCaption1Style = css`
  ${Caption1Style};
  font-family: ${({ theme }) => theme.fonts.mono};
  font-weight: ${({ theme }) => theme.fontWeights.regular};
`;

export const MonoCaption2Style = css`
  ${Caption2Style};
  font-family: ${({ theme }) => theme.fonts.mono};
`;

export const MonoLabelStyle = css`
  ${LabelStyle};
  font-family: ${({ theme }) => theme.fonts.mono};
`;
