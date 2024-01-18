import styled, { useTheme } from 'styled-components';
import { Button } from '../styled/buttons';
import { BodyLightStyle } from '../../theme/typography';
import { Toggle } from '../styled/inputs/toggle';
import { TimeAgoTag } from '../tags/time-ago-tag';
import {
  DeviceResponse,
  LatestReadingResponse,
  Location,
} from '../../api/types';
import { Input } from '../styled/inputs/input';
import { Flex } from '../styled/flex';
import { Caption2 } from '../styled/typography';

const StyledTr = styled.tr``;

export const StyledTd = styled.th`
  ${BodyLightStyle};
  text-align: left;

  padding: ${({ theme }) => theme.spacings.s8};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  height: ${({ theme }) => theme.spacings.s64};

  white-space: nowrap;
`;

interface AdminTableRowProps {
  device: DeviceResponse;
  latestReading?: LatestReadingResponse;
  onEdit: () => void;
}

export const AdminTableRow = ({
  device,
  latestReading,
  onEdit,
}: AdminTableRowProps) => {
  const { spacings } = useTheme();
  return (
    <StyledTr key={device.id}>
      <StyledTd>{device.order}</StyledTd>
      <StyledTd>{device.name}</StyledTd>
      <StyledTd>{device.id}</StyledTd>
      <StyledTd></StyledTd>
      <StyledTd>
        <TimeAgoTag date={latestReading?.reading.created_at} />
      </StyledTd>
      <StyledTd>
        <Flex gap="s4" alignItems="center">
          <Caption2>X:</Caption2>
          <div style={{ width: spacings.s48 }}>{device.location.x}</div>
          <Caption2>Y:</Caption2>
          <div style={{ width: spacings.s48 }}>{device.location.y}</div>
        </Flex>
      </StyledTd>
      <StyledTd>
        <Toggle isSelected={!device.disabled} disabled={true} />
      </StyledTd>
      <StyledTd>
        <Flex justifyContent="flex-end">
          <Button
            sizeVariant="small"
            iconLeft="mdiPencilOutline"
            variant="basic"
            onClick={onEdit}
          />
        </Flex>
      </StyledTd>
    </StyledTr>
  );
};

export interface EditableDevice {
  id: string;
  name: string;
  location: Location;
  disabled: boolean;
  order: number;
}

interface EditableAdminTableRowProps {
  device: EditableDevice;
  latestReading?: LatestReadingResponse;
  onChange: (device: Partial<EditableDevice>) => void;
  onCancel: () => void;
  isNew: boolean;
}

export const EditableAdminTableRow = ({
  device,
  latestReading,
  onChange,
  onCancel,
  isNew,
}: EditableAdminTableRowProps) => {
  const { spacings } = useTheme();
  return (
    <StyledTr key={device.id}>
      <StyledTd>
        <Input
          variant="small"
          value={device.order.toString()}
          onChange={newVal => onChange({ order: parseInt(newVal) })}
          style={{ padding: 0 }}
        />
      </StyledTd>
      <StyledTd>
        <Input
          variant="small"
          value={device.name}
          onChange={newVal => onChange({ name: newVal })}
          style={{ padding: 0 }}
        />
      </StyledTd>
      <StyledTd>
        {isNew ? (
          <Input
            variant="small"
            value={device.id}
            style={{ padding: 0 }}
            onChange={newVal => onChange({ id: newVal })}
          />
        ) : (
          device.id
        )}
      </StyledTd>
      <StyledTd></StyledTd>
      <StyledTd>
        <TimeAgoTag date={latestReading?.reading.created_at} />
      </StyledTd>
      <StyledTd>
        <Flex alignItems="center" gap="s8">
          <Input
            label="X:"
            variant="small"
            value={device.location.x.toString()}
            style={{
              padding: 0,
              width: spacings.s96,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            type="number"
            onChange={newVal =>
              onChange({
                location: { y: device.location.y, x: parseInt(newVal) },
              })
            }
          />
          <Input
            label="Y:"
            variant="small"
            value={device.location.y.toString()}
            style={{
              padding: 0,
              width: spacings.s96,
              display: 'flex',
              flexDirection: 'row',
              alignItems: 'center',
            }}
            type="number"
            onChange={newVal =>
              onChange({
                location: { x: device.location.x, y: parseInt(newVal) },
              })
            }
          />
        </Flex>
      </StyledTd>
      <StyledTd>
        <Toggle isSelected={!device.disabled} disabled={false} />
      </StyledTd>
      <StyledTd>
        <Flex gap="s16" justifyContent="flex-end">
          <Button
            iconLeft="mdiContentSaveOutline"
            variant="primary"
            sizeVariant="small"
            text="Save"
          />
          <Button
            iconLeft="mdiClose"
            variant="secondary"
            sizeVariant="small"
            text="Cancel"
            onClick={onCancel}
          />
        </Flex>
      </StyledTd>
    </StyledTr>
  );
};
