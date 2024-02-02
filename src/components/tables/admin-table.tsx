import { DeviceResponse, LatestReadingResponse } from '../../api/types';
import styled from 'styled-components';
import { Caption2Style } from '../../theme/typography';
import {
  AdminTableRow,
  EditableAdminTableRow,
  EditableDevice,
} from './admin-table-row';
import { useState } from 'react';
import { H3 } from '../styled/typography';
import { Button } from '../styled/buttons';
import { Flex } from '../styled/flex';
import { SkeletonRows } from './skeleton-rows';
import api from '../../api/routes';
import { useSnackbarContext } from '../../contexts/snackbar-context';

const NEW_ROW_FADE_OUT_MS = 5000;

const TableWrapper = styled.div`
  overflow-x: auto;
  padding: ${({ theme }) => theme.spacings.s24};
  padding-top: 0;
`;

const StyledAdminTable = styled.table`
  width: 100%;
  border-collapse: collapse;

  min-width: 800px;
`;

const StyledTr = styled.tr``;

const StyledTh = styled.th`
  ${Caption2Style};
  text-align: left;
  padding: ${({ theme }) => theme.spacings.s8};

  border-bottom: 1px solid ${({ theme }) => theme.colors.borders.secondary};
`;

interface AdminTableProps {
  isLoading?: boolean;
  devices: DeviceResponse[];
  latestData?: { [id: string]: LatestReadingResponse | undefined };
  fetchDevices: () => Promise<void>;
}

export const AdminTable = ({
  devices,
  latestData,
  isLoading,
  fetchDevices,
}: AdminTableProps) => {
  const { openSnackbar } = useSnackbarContext();
  const [devicesUnderEdit, setDevicesUnderEdit] = useState<{
    [id: string]: EditableDevice | undefined;
  }>({});

  const [newDevices, setNewDevices] = useState<EditableDevice[]>([]);

  const [newOrAddedIds, setNewOrAdded] = useState<string[]>([]);

  const validateDevice = (device?: EditableDevice, isEditing?: boolean) => {
    const deviceErrors: EditableDevice['errors'] = {};
    if (!device) return deviceErrors;

    const devicesWithSameOrder = devices
      .filter(d => d.order?.toString() === device.order)
      .map(d => d.id);
    const devicesWithSameId = devices
      .filter(d => d.id === device.id)
      .map(d => d.id);

    if (device.order.length < 1) {
      deviceErrors.order = 'Order is required';
    }
    if (
      devicesWithSameOrder.length > 0 &&
      !(
        isEditing &&
        devicesWithSameOrder.length === 1 &&
        devicesWithSameOrder[0] === device.id
      )
    ) {
      deviceErrors.order = 'Order must be unique';
    }
    if (device.name.length < 1) {
      deviceErrors.name = 'Name is required';
    }
    if (device.id.length !== 12) {
      deviceErrors.id = 'Serial number must contain 12 characters';
    }
    if (!isEditing && devicesWithSameId.length > 0) {
      deviceErrors.id = 'Serial number must be unique';
    }
    if (device.location.x.length < 1 || device.location.y.length < 1) {
      deviceErrors.location = 'Location is required';
    }
    return deviceErrors;
  };

  const validateNewDevice = (i: number) => {
    const device = newDevices[i];
    const deviceErrors = validateDevice(device, false);

    setNewDevices([
      ...newDevices.slice(0, i),
      {
        ...newDevices[i],
        errors: deviceErrors,
      },
      ...newDevices.slice(i + 1),
    ]);
    return Object.keys(deviceErrors).length === 0;
  };

  const onAddNewDevice = async (i: number) => {
    const device = newDevices[i];
    const isValid = validateNewDevice(i);
    if (isValid) {
      const result = await api.addDevice({
        id: device.id,
        name: device.name,
        location: {
          x: parseInt(device.location.x),
          y: parseInt(device.location.y),
        },
        disabled: device.disabled,
        order: parseInt(device.order),
        type: device.type,
      });
      if (!result.error) {
        setNewDevices(old => [...old.slice(0, i), ...old.slice(i + 1)]);
        setNewOrAdded(old => [...old, device.id]);
        setTimeout(() => {
          setNewOrAdded(old => old.filter(id => id !== device.id));
        }, NEW_ROW_FADE_OUT_MS);
        fetchDevices();
        openSnackbar({
          variant: 'success',
          title: 'New device added successfully!',
          isAutoCloseable: true,
          isCloseable: true,
        });
      } else {
        openSnackbar({
          variant: 'error',
          title: 'Error in adding new device',
          body: result.error.message,
          isAutoCloseable: false,
          isCloseable: true,
        });
      }
    }
  };

  const validateEditedDevice = (deviceId: string) => {
    const device = devicesUnderEdit[deviceId];
    const deviceErrors = validateDevice(device, true);

    if (device) {
      setDevicesUnderEdit({
        ...devicesUnderEdit,
        [deviceId]: {
          ...device,
          errors: deviceErrors,
        },
      });
    }
    return Object.keys(deviceErrors).length === 0;
  };

  const onEditDevice = async (deviceId: string) => {
    const device = devicesUnderEdit[deviceId];
    const isValid = validateEditedDevice(deviceId);
    if (isValid && device) {
      const result = await api.editDevice(deviceId, {
        name: device.name,
        location: {
          x: parseInt(device.location.x),
          y: parseInt(device.location.y),
        },
        disabled: device.disabled,
        order: parseInt(device.order),
        type: device.type,
      });
      if (!result.error) {
        setDevicesUnderEdit(old => ({ ...old, [deviceId]: undefined }));
        setNewOrAdded(old => [...old, deviceId]);
        setTimeout(() => {
          setNewOrAdded(old => old.filter(id => id !== device.id));
        }, NEW_ROW_FADE_OUT_MS);
        fetchDevices();
        openSnackbar({
          variant: 'success',
          title: 'Device edited successfully!',
          isAutoCloseable: true,
          isCloseable: true,
        });
      } else {
        openSnackbar({
          variant: 'error',
          title: 'Error in editing the device',
          body: result.error.message,
          isAutoCloseable: false,
          isCloseable: true,
        });
      }
    }
  };

  return (
    <>
      <Flex justifyContent="space-between" alignItems="center" p="s24">
        <H3>Devices</H3>
        <Button
          variant="basic"
          iconLeft="mdiPlus"
          text="Add a Device"
          onClick={() =>
            setNewDevices(old => [
              ...old,
              {
                id: '',
                name: '',
                location: { x: '0', y: '0' },
                disabled: false,
                order: '',
                type: 'ruuvi',
              },
            ])
          }
        />
      </Flex>
      <TableWrapper>
        <StyledAdminTable>
          <thead>
            <StyledTr>
              <StyledTh style={{ width: '90px' }}>Order</StyledTh>
              <StyledTh style={{ width: 'auto' }}>Name</StyledTh>
              <StyledTh style={{ width: 'auto' }}>Serial Number</StyledTh>
              <StyledTh style={{ width: '10%' }}>Type</StyledTh>
              <StyledTh style={{ width: '12%' }}>Last Connection</StyledTh>
              <StyledTh style={{ width: '250px' }}>Location</StyledTh>
              <StyledTh style={{ width: '48px' }}>Enabled</StyledTh>
              <StyledTh style={{ width: '250px', textAlign: 'right' }}>
                Actions
              </StyledTh>
            </StyledTr>
          </thead>
          <tbody>
            {isLoading ? (
              <SkeletonRows />
            ) : (
              devices.map(device => {
                const editedDevice = devicesUnderEdit[device.id];
                if (editedDevice) {
                  return (
                    <EditableAdminTableRow
                      key={device.id}
                      isNew={false}
                      device={editedDevice}
                      latestReading={latestData?.[device.id]}
                      onChange={changed =>
                        setDevicesUnderEdit(old => ({
                          ...old,
                          [device.id]: changed,
                        }))
                      }
                      onCancel={() =>
                        setDevicesUnderEdit(old => ({
                          ...old,
                          [device.id]: undefined,
                        }))
                      }
                      onSave={() => onEditDevice(device.id)}
                    />
                  );
                }
                return (
                  <AdminTableRow
                    key={device.id}
                    isNewlyEdited={newOrAddedIds.includes(device.id)}
                    device={device}
                    latestReading={latestData?.[device.id]}
                    onEdit={() =>
                      setDevicesUnderEdit(old => ({
                        ...old,
                        [device.id]: {
                          id: device.id,
                          name: device.name,
                          location: {
                            x: device.location.x.toString(),
                            y: device.location.y.toString(),
                          },
                          disabled: device.disabled,
                          order: device.order.toString(),
                          type: device.type,
                        },
                      }))
                    }
                  />
                );
              })
            )}
            {newDevices.map((device, i) => {
              return (
                <EditableAdminTableRow
                  key={i}
                  isNew={true}
                  device={device}
                  latestReading={undefined}
                  onChange={change =>
                    setNewDevices(old => [
                      ...old.slice(0, i),
                      { ...old[i], ...change },
                      ...old.slice(i + 1),
                    ])
                  }
                  onCancel={() =>
                    setNewDevices(old => [
                      ...old.slice(0, i),
                      ...old.slice(i + 1),
                    ])
                  }
                  onSave={() => onAddNewDevice(i)}
                />
              );
            })}
          </tbody>
        </StyledAdminTable>
      </TableWrapper>
    </>
  );
};
