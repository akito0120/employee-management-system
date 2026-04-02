import { ExportOutlined } from '@ant-design/icons';
import { Button, Form, Modal, Select, Typography } from 'antd';
import { useState } from 'react';

const ExportEmployeeModal = ({ selectedIds }: { selectedIds: number[] }) => {
  const [open, setOpen] = useState<boolean>(false);

  return (
    <>
      <Button
        icon={<ExportOutlined />}
        disabled={selectedIds.length === 0}
        onClick={() => setOpen(true)}
        variant="filled"
        color="primary"
      >
        Export
      </Button>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        okText="Export"
        title="Export Employee Data"
        okButtonProps={{ variant: 'filled', color: 'primary' }}
        cancelButtonProps={{ variant: 'filled', color: 'default' }}
      >
        <Form layout="horizontal" style={{ padding: '1rem' }}>
          <Form.Item>
            <Typography.Text type="secondary">
              {selectedIds.length} records are selected
            </Typography.Text>
          </Form.Item>

          <Form.Item label="Format">
            <Select
              defaultValue="csv"
              options={[
                { label: 'CSV', value: 'csv' },
                { label: 'Excel', value: 'excel' }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ExportEmployeeModal;
