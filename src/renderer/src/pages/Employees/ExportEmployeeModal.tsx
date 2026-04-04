import { ExportOutlined, WarningOutlined } from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import { trpc } from '@renderer/trpc';
import { Form, Modal, Select, Typography } from 'antd';
import Papa from 'papaparse';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import * as xlsx from 'xlsx';

enum ExportFormat {
  CSV = 'csv',
  Excel = 'excel'
}

const ExportEmployeeModal = () => {
  const { t } = useTranslation();
  const [open, setOpen] = useState<boolean>(false);
  const [format, setFormat] = useState<ExportFormat>(ExportFormat.CSV);
  const { mutateAsync: getEmployeesToExport, isPending } = trpc.employees.export.useMutation();

  const exportCsv = async () => {
    const employees = await getEmployeesToExport();
    const csv = Papa.unparse(employees);

    const bom = new Uint8Array([0xef, 0xbb, 0xbf]);
    const blob = new Blob([bom, csv], { type: 'text/csv;charset=utf-8;' });

    const link = document.createElement('a');
    const url = URL.createObjectURL(blob);

    link.setAttribute('href', url);
    link.setAttribute('download', 'employees.csv');
    link.style.visibility = 'hidden';

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const exportExcel = async () => {
    const employees = await getEmployeesToExport();
    const worksheet = xlsx.utils.json_to_sheet(employees);
    worksheet['!cols'] = Array.from({ length: 19 }).map(() => ({ wch: 15 }));

    const workbook = xlsx.utils.book_new();
    xlsx.utils.book_append_sheet(workbook, worksheet, 'Employees');
    xlsx.writeFile(workbook, 'employees.xlsx');
  };

  const exportEmployees = async () => {
    if (format === ExportFormat.CSV) {
      await exportCsv();
    } else if (format === ExportFormat.Excel) {
      await exportExcel();
    }
  };

  return (
    <>
      <StyledButton
        icon={<ExportOutlined />}
        onClick={() => setOpen(true)}
        variant="filled"
        color="primary"
      >
        {t('global.export')}
      </StyledButton>

      <Modal
        open={open}
        onCancel={() => setOpen(false)}
        okText={t('global.export')}
        cancelText={t('global.cancel')}
        title={t('employees.export.title')}
        okButtonProps={{ variant: 'filled', color: 'primary', loading: isPending }}
        cancelButtonProps={{ variant: 'filled', color: 'default' }}
        onOk={exportEmployees}
      >
        <Form layout="horizontal" style={{ padding: '1rem' }}>
          <Form.Item>
            <Typography.Text type="warning">
              <WarningOutlined style={{ marginRight: '10px' }} />
              {t('employees.export.warning')}
            </Typography.Text>
          </Form.Item>

          <Form.Item label={t('employees.export.formatLabel')}>
            <Select
              defaultValue={ExportFormat.CSV}
              value={format}
              onChange={(value: ExportFormat) => setFormat(value)}
              options={[
                { label: 'CSV', value: ExportFormat.CSV },
                { label: 'Excel', value: ExportFormat.Excel }
              ]}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
};

export default ExportEmployeeModal;
