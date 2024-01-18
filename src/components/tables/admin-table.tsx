import {
  DeviceResponse,
  LatestReadingResponse,
  Location,
} from '../../api/types';
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
}

export const AdminTable = ({
  devices,
  latestData,
  isLoading,
}: AdminTableProps) => {
  const [devicesUnderEdit, setDevicesUnderEdit] = useState<{
    [id: string]: DeviceResponse | undefined;
  }>({});

  const [newDevices, setNewDevices] = useState<EditableDevice[]>([]);

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
                location: { x: 0, y: 0 },
                disabled: false,
                order: 0,
              },
            ])
          }
        />
      </Flex>
      <TableWrapper>
        <StyledAdminTable>
          <thead>
            <StyledTr>
              <StyledTh style={{ width: '60px' }}>Order</StyledTh>
              <StyledTh style={{ width: 'auto' }}>Name</StyledTh>
              <StyledTh style={{ width: '12%' }}>Serial Number</StyledTh>
              <StyledTh style={{ width: '15%' }}>Type</StyledTh>
              <StyledTh style={{ width: '12%' }}>Last Connection</StyledTh>
              <StyledTh style={{ width: '20%' }}>Location</StyledTh>
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
                      onChange={change =>
                        setDevicesUnderEdit(old => ({
                          ...old,
                          [device.id]: {
                            ...device,
                            ...old[device.id],
                            ...change,
                          },
                        }))
                      }
                      onCancel={() =>
                        setDevicesUnderEdit(old => ({
                          ...old,
                          [device.id]: undefined,
                        }))
                      }
                    />
                  );
                }
                return (
                  <AdminTableRow
                    key={device.id}
                    device={device}
                    latestReading={latestData?.[device.id]}
                    onEdit={() =>
                      setDevicesUnderEdit(old => ({
                        ...old,
                        [device.id]: device,
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
                />
              );
            })}
          </tbody>
        </StyledAdminTable>
      </TableWrapper>
    </>
  );
};
