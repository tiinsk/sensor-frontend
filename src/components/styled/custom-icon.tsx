import styled from 'styled-components';
import { Box, BoxProps } from './box';
import { Space } from '../../theme';
import { IconColor } from './mdi-icon';
import { Co2 } from '../../assets/icons/co2';
import { Humidity } from '../../assets/icons/humidity';
import { Nox } from '../../assets/icons/nox';
import { Pm25 } from '../../assets/icons/pm25';
import { Pressure } from '../../assets/icons/pressure';
import { Temperature } from '../../assets/icons/temperature';
import { Voc } from '../../assets/icons/voc';

export const customIcons = [
  'co2',
  'humidity',
  'nox',
  'pm25',
  'pressure',
  'temperature',
  'voc',
] as const;

export type CustomIconType = (typeof customIcons)[number];

export interface IconProps {
  type: CustomIconType;
  size?: Space;
  color?: IconColor;
}

const getIcon = (type: CustomIconType, size: Space, color?: IconColor) => {
  switch (type) {
    case 'co2':
      return <Co2 size={size} color={color} />;
    case 'humidity':
      return <Humidity size={size} color={color} />;
    case 'nox':
      return <Nox size={size} color={color} />;
    case 'pm25':
      return <Pm25 size={size} color={color} />;
    case 'pressure':
      return <Pressure size={size} color={color} />;
    case 'temperature':
      return <Temperature size={size} color={color} />;
    case 'voc':
      return <Voc size={size} color={color} />;
    default:
      return undefined;
  }
};

const StyledIcon = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
`;

export const CustomIcon = ({
  type,
  size = 's24',
  color,
  ...props
}: IconProps & BoxProps) => {
  const icon = getIcon(type, size, color);
  return (
    <Box {...props}>
      <StyledIcon>{icon}</StyledIcon>
    </Box>
  );
};
