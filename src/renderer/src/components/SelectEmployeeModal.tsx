import { trpc } from '@renderer/trpc';
import { Button, Flex, Form, Input, Modal, Select, Table, Typography } from 'antd';
import { BaseButtonProps } from 'antd/es/button/Button';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { FindEmployeeResponse } from 'src/shared/dto/employees/find-employee.dto';

import EmployeeStatusTag from './EmployeeStatusTag';

export interface SelectEmployeeModalProps {
  onSelect?: (value: FindEmployeeResponse['items'][number]) => void;
  excludeIds?: number[];
  value?: FindEmployeeResponse['items'][number];
  placeholder?: string;
  onClear?: () => void;
  variant?: BaseButtonProps['variant'];
}

const SelectEmployeeModal = ({
  onSelect,
  excludeIds,
  value,
  placeholder,
  onClear,
  variant
}: SelectEmployeeModalProps) => {
  const [open, setOpen] = useState(false);
  const { data: deptOptions } = trpc.departments.getDepartmentOptions.useQuery();
  const { data: subDeptOptions } = trpc.subDepartments.getSubDepartmentOptions.useQuery();
  const { data: unitOptions } = trpc.units.getUnitOptions.useQuery();

  const [searchText, setSearchText] = useState<string | undefined>(undefined);
  const [organizationId, setOrganizationId] = useState<number | undefined>(undefined);
  const [page, setPage] = useState(1);

  const { data, isLoading } = trpc.employees.findEmployee.useQuery({
    code: searchText ?? null,
    name: searchText ?? null,
    organizationId: organizationId ?? null,
    page,
    excludeIds,
    status: null,
    eligibilities: null
  });

  return (
    <>
      <Button
        variant={variant ?? 'filled'}
        color="default"
        style={{ width: '100%', display: 'flex', justifyContent: 'start' }}
        onClick={() => setOpen(true)}
      >
        {value ? (
          `${value.firstName} ${value.lastName} (${value.code})`
        ) : (
          <Typography.Text type="secondary">{placeholder}</Typography.Text>
        )}
      </Button>

      <Modal open={open} onCancel={() => setOpen(false)} width={800} footer={null}>
        <Flex vertical gap="middle">
          <Form layout="inline">
            <Form.Item>
              <Input
                onChange={(e) => setSearchText(e.currentTarget.value)}
                placeholder="Name / Code"
              />
            </Form.Item>

            <Form.Item>
              <Select
                options={[
                  { label: 'Departments', options: deptOptions },
                  { label: 'Sub Department', options: subDeptOptions },
                  { label: 'Units', options: unitOptions }
                ]}
                onChange={(value) => setOrganizationId(value)}
                placeholder="Affiliation"
                style={{ width: '20rem' }}
                allowClear
              />
            </Form.Item>

            <Button
              icon={<XIcon size={15} />}
              color="default"
              variant="filled"
              onClick={() => {
                onClear && onClear();
                setOpen(false);
              }}
            >
              Clear
            </Button>
          </Form>

          <Table
            bordered
            dataSource={data?.items}
            loading={isLoading}
            pagination={{
              pageSize: 10,
              onChange: (page) => setPage(page),
              total: data?.total,
              simple: true,
              showTotal: (total) => (
                <Typography.Text type="secondary">{total} Results</Typography.Text>
              )
            }}
            scroll={{ y: '25rem' }}
            columns={[
              { title: 'Name', render: (_, record) => `${record.firstName} ${record.lastName}` },
              { title: 'Code', dataIndex: 'code' },
              { title: 'Affiliation', dataIndex: 'affiliation' },
              {
                title: 'Status',
                dataIndex: 'status',
                render: (status) => <EmployeeStatusTag status={status} />
              }
            ]}
            onRow={(record) => ({
              onClick: () => {
                onSelect && onSelect(record);
                setOpen(false);
              }
            })}
            styles={{ body: { row: { cursor: 'pointer' } } }}
          />
        </Flex>
      </Modal>
    </>
  );
};

export default SelectEmployeeModal;
