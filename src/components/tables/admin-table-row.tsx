import styled, { useTheme } from 'styled-components';
import { Button } from '../styled/buttons';
import { BodyLightStyle } from '../../theme/typography';
import { Toggle } from '../styled/inputs/toggle';
import { TimeAgoTag } from '../tags/time-ago-tag';
import {
  DeviceResponse,
  DeviceType,
  LatestReadingResponse,
  LocationType,
} from '../../api/types';
import { Input } from '../styled/inputs/input';
import { Flex } from '../styled/flex';
import { Caption2 } from '../styled/typography';
import {
  getDeviceLocationTypeName,
  getDeviceTypeName,
} from '../../utils/device';
import { Select } from '../styled/selects';

const StyledTr = styled.tr<{ $isNewlyEdited?: boolean }>`
  transition: background-color 500ms ease-out;
  background-color: ${({ theme, $isNewlyEdited }) =>
    $isNewlyEdited ? theme.colors.success.primary.background : undefined};
`;

export const StyledTd = styled.td`
  ${BodyLightStyle};
  text-align: left;

  padding: ${({ theme }) => theme.spacings.s8};
  border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
  min-height: ${({ theme }) => theme.spacings.s64};

  white-space: nowrap;
`;

const EditableTd = styled(StyledTd)`
  padding-top: 0;
  padding-bottom: 0;
`;

const LocationInput = styled(Input)`
  padding: 0;
  width: ${({ theme }) => theme.spacings.s96};
  display: flex;
  flex-direction: row;
  align-items: center;
  gap: ${({ theme }) => theme.spacings.s8};

  input {
    margin-top: 0 !important;
  }
`;

interface AdminTableRowProps {
  device: DeviceResponse;
  latestReading?: LatestReadingResponse;
  onEdit: () => void;
  isNewlyEdited: boolean;
}

export const AdminTableRow = ({
  device,
  latestReading,
  onEdit,
  isNewlyEdited,
}: AdminTableRowProps) => {
  const { spacings } = useTheme();
  return (
    <StyledTr $isNewlyEdited={isNewlyEdited}>
      <StyledTd>{device.order}</StyledTd>
      <StyledTd>{device.name}</StyledTd>
      <StyledTd>{device.id}</StyledTd>
      <StyledTd>{getDeviceTypeName(device.type)}</StyledTd>
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
      <StyledTd>{getDeviceLocationTypeName(device.location.type)}</StyledTd>
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
  location: {
    x: string;
    y: string;
    type: LocationType;
  };
  disabled: boolean;
  order: string;
  type: DeviceType;
  errors?: {
    id?: string;
    name?: string;
    location?: string;
    disabled?: string;
    order?: string;
    type?: string;
  };
}

interface EditableAdminTableRowProps {
  device: EditableDevice;
  latestReading?: LatestReadingResponse;
  onChange: (device: EditableDevice) => void;
  onCancel: () => void;
  onSave: () => void;
  isNew: boolean;
}

export const EditableAdminTableRow = ({
  device,
  latestReading,
  onChange,
  onCancel,
  onSave,
  isNew,
}: EditableAdminTableRowProps) => {
  return (
    <StyledTr>
      <EditableTd>
        <Input
          variant="small"
          value={device.order}
          onChange={newVal => onChange({ ...device, order: newVal })}
          style={{ padding: 0 }}
          error={device.errors?.order}
        />
      </EditableTd>
      <EditableTd>
        <Input
          variant="small"
          value={device.name}
          onChange={newVal => onChange({ ...device, name: newVal })}
          style={{ padding: 0 }}
          error={device.errors?.name}
        />
      </EditableTd>
      <EditableTd>
        <Input
          variant="small"
          disabled={!isNew}
          value={device.id}
          onChange={newVal => onChange({ ...device, id: newVal })}
          style={{ padding: 0 }}
          error={device.errors?.id}
        />
      </EditableTd>
      <EditableTd>
        <Select
          initialValue={device.type}
          onSelect={newVal => {
            onChange({ ...device, type: newVal as DeviceType });
          }}
          options={[
            { value: 'ruuvi', label: getDeviceTypeName('ruuvi') },
            { value: 'sensorbug', label: getDeviceTypeName('sensorbug') },
          ]}
        />
      </EditableTd>
      <EditableTd>
        <TimeAgoTag date={latestReading?.reading.created_at} />
      </EditableTd>
      <EditableTd>
        <Flex alignItems="center" gap="s8">
          <LocationInput
            label="X:"
            variant="small"
            value={device.location.x.toString()}
            type="number"
            onChange={newVal =>
              onChange({
                ...device,
                location: {
                  type: device.location.type,
                  y: device.location.y,
                  x: newVal,
                },
              })
            }
            error={device.errors?.location}
          />
          <LocationInput
            label="Y:"
            variant="small"
            value={device.location.y.toString()}
            type="number"
            onChange={newVal =>
              onChange({
                ...device,
                location: {
                  type: device.location.type,
                  x: device.location.x,
                  y: newVal,
                },
              })
            }
          />
        </Flex>
      </EditableTd>
      <EditableTd>
        <Select
          initialValue={device.location.type}
          onSelect={newVal => {
            onChange({
              ...device,
              location: {
                x: device.location.x,
                y: device.location.y,
                type: newVal as LocationType,
              },
            });
          }}
          options={[
            { value: 'inside', label: getDeviceLocationTypeName('inside') },
            { value: 'outside', label: getDeviceLocationTypeName('outside') },
            { value: null, label: getDeviceLocationTypeName(null) },
          ]}
        />
      </EditableTd>
      <EditableTd>
        <Toggle
          name={`device_${device.id}_enabled_toggle`}
          isSelected={!device.disabled}
          disabled={false}
          onChange={newVal =>
            onChange({
              ...device,
              disabled: !newVal,
            })
          }
        />
      </EditableTd>
      <EditableTd>
        <Flex gap="s16" justifyContent="flex-end">
          <Button
            iconLeft="mdiContentSaveOutline"
            variant="primary"
            sizeVariant="small"
            text="Save"
            onClick={onSave}
          />
          <Button
            iconLeft="mdiClose"
            variant="secondary"
            sizeVariant="small"
            text="Cancel"
            onClick={onCancel}
          />
        </Flex>
      </EditableTd>
    </StyledTr>
  );
};
