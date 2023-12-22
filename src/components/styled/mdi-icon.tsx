import React from 'react';
import styled, { useTheme } from 'styled-components';

import * as mdiIcons from '@mdi/js';
import Icon from '@mdi/react';
import { Box } from './box';
import { Space, theme } from '../../theme';

type IconColor = keyof (typeof theme)['colors']['icons'];
type IconType = keyof typeof mdiIcons;

const StyledIcon = styled(Box)``;

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
}: MdiIconProps) => {
  const { spacings, colors } = useTheme();
  return (
    <StyledIcon {...props}>
      <Icon
        size={spacings[size]}
        color={colors.icons[color]}
        path={mdiIcons[type]}
      />
    </StyledIcon>
  );
};
