import React from 'react';
import styled, { DefaultTheme, useTheme } from 'styled-components';

import * as mdiIcons from '@mdi/js';
import Icon from '@mdi/react';
import { Box, BoxProps } from './box';
import { Space } from '../../theme';

type ThemeIconColor = keyof DefaultTheme['colors']['icons'];
type ThemeIconColorV2 = keyof DefaultTheme['v2']['colors']['stroke'];

export type IconColor = ThemeIconColor | ThemeIconColorV2;
export type IconType = keyof typeof mdiIcons;

interface MdiIconProps {
  type: IconType;
  size?: Space;
  color?: IconColor;
}

const StyledIcon = styled(Icon)`
  display: flex;
  justify-content: center;
  align-items: center;
  flex-shrink: 0;
`;

export const useIconColor = (color?: IconColor) => {
  const { colors, v2 } = useTheme();

  if (!color) {
    return 'currentColor';
  }

  return color in colors.icons
    ? colors.icons[color as ThemeIconColor]
    : v2.colors.stroke[color as ThemeIconColorV2];
};

export const MdiIcon = ({
  type,
  color,
  size = 's24',
  ...props
}: MdiIconProps & BoxProps) => {
  const { spacings } = useTheme();
  const iconColor = useIconColor(color);
  return (
    <Box {...props}>
      <StyledIcon
        size={spacings[size]}
        color={iconColor}
        path={mdiIcons[type]}
      />
    </Box>
  );
};
