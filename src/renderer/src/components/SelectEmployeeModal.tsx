import { useAffiliationOptions } from '@renderer/hooks/options';
import { trpc } from '@renderer/trpc';
import { Button, Flex, Form, Input, Modal, Select, Table, Typography } from 'antd';
import { BaseButtonProps } from 'antd/es/button/Button';
import { XIcon } from 'lucide-react';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { FindEmployeeResponse } from 'src/shared/dto/employees/find-employee.dto';

import EmployeeStatusTag from './EmployeeStatusTag';
import TableTotalCount from './TableTotalCount';

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
  const { t } = useTranslation();
  const [open, setOpen] = useState(false);
  const affiliationOptions = useAffiliationOptions();

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
                placeholder={`${t('employees.field.name')} / ${t('employees.field.code')}`}
              />
            </Form.Item>

            <Form.Item>
              <Select
                options={affiliationOptions}
                onChange={(value) => setOrganizationId(value)}
                placeholder={t('employees.field.affiliation')}
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
              {t('global.clear')}
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
              showTotal: (total) => <TableTotalCount total={total} />
            }}
            scroll={{ y: '25rem' }}
            columns={[
              {
                title: t('employees.field.name'),
                render: (_, record) => `${record.firstName} ${record.lastName}`
              },
              { title: t('employees.field.code'), dataIndex: 'code' },
              { title: t('employees.field.affiliation'), dataIndex: 'affiliation' },
              {
                title: t('employees.field.status'),
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
