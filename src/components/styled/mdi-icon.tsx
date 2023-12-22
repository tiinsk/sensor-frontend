import React from 'react';
import { DefaultTheme, useTheme } from 'styled-components';

import * as mdiIcons from '@mdi/js';
import Icon from '@mdi/react';
import { Box, BoxProps } from './box';
import { Space } from '../../theme';

type IconColor = keyof DefaultTheme['colors']['icons'];
export type IconType = keyof typeof mdiIcons;

interface MdiIconProps {
  type: IconType;
  size?: Space;
  color?: IconColor;
}

export const MdiIcon = ({
  type,
  color = 'primary',
  size = 's24',
  ...props
}: MdiIconProps & BoxProps) => {
  const { spacings, colors } = useTheme();
  return (
    <Box {...props}>
      <Icon
        size={spacings[size]}
        color={colors.icons[color]}
        path={mdiIcons[type]}
      />
    </Box>
  );
};
