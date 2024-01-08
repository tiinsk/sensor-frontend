import { Space } from '../../theme';
import { IconColor } from '../../components/styled/mdi-icon';
import { Box, BoxProps } from '../../components/styled/box';
import { useTheme } from 'styled-components';

interface IconProps {
  size?: Space;
  color?: IconColor;
}

export const Blueprint = ({
  color,
  size = 's24',
  ...props
}: IconProps & BoxProps) => {
  const { colors, spacings } = useTheme();
  return (
    <Box {...props}>
      <svg
        width={spacings[size]}
        height={spacings[size]}
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
      >
        <path
          d="M15 7H21C21.5523 7 22 7.44772 22 8V19C22 19.5523 21.5523 20 21 20H17V18H20V16H13V14H20V9H15V12H13V5H4V9H10V14H8V11H4V18H8V16H10V18H14V20H3C2.44772 20 2 19.5523 2 19V4C2 3.44772 2.44772 3 3 3H14C14.5523 3 15 3.44772 15 4V7Z"
          fill={color ? colors.icons[color] : 'currentColor'}
        />
        <path
          d="M14 20H17C17 20.394 16.9224 20.7841 16.7716 21.1481C16.6209 21.512 16.3999 21.8427 16.1213 22.1213C15.8427 22.3999 15.512 22.6209 15.1481 22.7716C14.7841 22.9224 14.394 23 14 23V20Z"
          fill={color ? colors.icons[color] : 'currentColor'}
        />
      </svg>
    </Box>
  );
};
