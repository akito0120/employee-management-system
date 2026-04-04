import {
  CheckOutlined,
  ClearOutlined,
  DownloadOutlined,
  InboxOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { StyledButton } from '@renderer/components/Buttons';
import TableTotalCount from '@renderer/components/TableTotalCount';
import { trpc } from '@renderer/trpc';
import { Breadcrumb, Flex, Table, Typography } from 'antd';
import useApp from 'antd/es/app/useApp';
import type { RcFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import Papa from 'papaparse';
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { ImportEmployeeRequest } from 'src/shared/dto/employees/import-employee.dto';
import { RegisterEmployeeRequest } from 'src/shared/dto/employees/register-employee.dto';
import * as xlsx from 'xlsx';

type ImportedEmployee = ImportEmployeeRequest[number];
type RawEmployee = Omit<
  ImportedEmployee,
  'birthDate' | 'lastPromotionDate' | 'lastRaiseDate' | 'status'
> & {
  status: string;
  birthDate: string;
  lastPromotionDate: string | null;
  lastRaiseDate: string | null;
};

const ImportEmployeesPage = () => {
  const { t } = useTranslation();
  const { message } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState<ImportedEmployee[]>([]);
  const { mutateAsync: importEmployees, isPending: importPending } =
    trpc.employees.import.useMutation({
      onSuccess: () => navigate(-1),
      onError: () => message.error(t('global.somethingWentWrongMsg'))
    });

  const appendData = (newData: ImportedEmployee[]): void => {
    setData((prevData) => [...prevData, ...newData]);
    message.info({
      content: `Imported ${newData.length} record(s)`
    });
  };

  const readFile = (file: RcFile): Promise<void> => {
    const ext = file.name.split('.').pop();

    if (ext === 'csv') {
      return readCsv(file);
    } else if (ext === 'xlsx') {
      return readExcel(file);
    }

    return Promise.reject();
  };

  const readCsv = (file: RcFile): Promise<void> => {
    return new Promise((_, reject) => {
      Papa.parse<RawEmployee>(file, {
        header: true,
        skipEmptyLines: 'greedy',
        dynamicTyping: true,
        complete: (results) => {
          appendData(
            results.data.map((item) => ({
              ...item,
              birthDate: new Date(item.birthDate),
              lastPromotionDate: item.lastPromotionDate ? new Date(item.lastPromotionDate) : null,
              lastRaiseDate: item.lastRaiseDate ? new Date(item.lastRaiseDate) : null,
              status: item.status as RegisterEmployeeRequest['status']
            }))
          );
          reject();
        }
      });
    });
  };

  const readExcel = async (file: RcFile): Promise<void> => {
    return file.arrayBuffer().then((data) => {
      const workbook = xlsx.read(data, { type: 'array' });
      const firstSheetName = workbook.SheetNames[0];
      const worksheet = workbook.Sheets[firstSheetName];
      const rawRows = xlsx.utils.sheet_to_json<RawEmployee>(worksheet, {
        defval: ''
      });
      appendData(
        rawRows.map((item) => ({
          ...item,
          birthDate: new Date(item.birthDate),
          lastPromotionDate: item.lastPromotionDate ? new Date(item.lastPromotionDate) : null,
          lastRaiseDate: item.lastRaiseDate ? new Date(item.lastRaiseDate) : null,
          status: item.status as RegisterEmployeeRequest['status']
        }))
      );
      return Promise.reject();
    });
  };

  const registerAll = async () => {
    await importEmployees(data);
  };

  return (
    <Flex orientation="vertical">
      <Flex style={{ paddingTop: '2rem', paddingLeft: '2rem' }}>
        <Breadcrumb items={[{ title: t('global.employees') }, { title: t('global.import') }]} />
      </Flex>

      <Flex style={{ padding: '2rem' }} orientation="vertical" gap="middle">
        <Dragger
          style={{ width: '100%' }}
          multiple={false}
          accept=".csv,.xlsx"
          showUploadList={false}
          beforeUpload={(file) => readFile(file)}
        >
          <InboxOutlined style={{ fontSize: '3rem', paddingBottom: '1rem' }} />
          <Typography.Paragraph type="secondary">
            {t('employees.import.clickOrDrag')}
          </Typography.Paragraph>
          <Typography.Paragraph type="secondary">
            {t('employees.import.supportedFormat')}: .csv (UTF-8), .xlsx
          </Typography.Paragraph>
        </Dragger>

        <Flex style={{ marginTop: '1rem' }} gap="small">
          <StyledButton
            icon={<ClearOutlined />}
            onClick={() => setData([])}
            variant="filled"
            color="default"
          >
            {t('global.clear')}
          </StyledButton>

          <a href="./template.csv" download="template.csv">
            <StyledButton icon={<DownloadOutlined />} variant="filled" color="default">
              CSV {t('employees.import.template')}
            </StyledButton>
          </a>

          <a href="./template.xlsx" download="template.xlsx">
            <StyledButton icon={<DownloadOutlined />} variant="filled" color="default">
              Excel {t('employees.import.template')}
            </StyledButton>
          </a>
        </Flex>

        <Table<ImportedEmployee>
          bordered
          dataSource={data}
          styles={{ header: { cell: { minWidth: '10rem' } } }}
          scroll={{ x: '100%' }}
          pagination={{ pageSize: 10, showTotal: (total) => <TableTotalCount total={total} /> }}
          columns={[
            { title: t('employees.field.firstName'), dataIndex: 'firstName' },
            { title: t('employees.field.lastName'), dataIndex: 'lastName' },
            { title: t('employees.field.code'), dataIndex: 'code' },
            {
              title: t('employees.field.birthDate'),
              dataIndex: 'birthDate',
              render: (value: Date) => value.toLocaleDateString()
            },
            { title: t('employees.field.status'), dataIndex: 'status' },
            { title: t('employees.field.position'), dataIndex: 'position' },
            { title: t('employees.field.affiliation'), dataIndex: 'affiliation' },
            // {
            //   title: 'Is Manager',
            //   dataIndex: 'isManager',
            //   render: (isManager: boolean) => (isManager ? 'True' : 'False')
            // },
            {
              title: t('employees.field.lastPromotionDate'),
              dataIndex: 'lastPromotionDate',
              render: (value: Date | null) => value?.toLocaleDateString()
            },
            {
              title: t('employees.field.lastRaiseDate'),
              dataIndex: 'lastRaiseDate',
              render: (value: Date | null) => value?.toLocaleDateString()
            },
            { title: t('employees.field.email'), dataIndex: 'email' },
            { title: t('employees.field.phoneNumber'), dataIndex: 'phoneNumber' },
            { title: t('employees.field.country'), dataIndex: 'country' },
            { title: t('employees.field.state'), dataIndex: 'state' },
            { title: t('employees.field.city'), dataIndex: 'city' },
            { title: t('employees.field.line1'), dataIndex: 'line1' },
            { title: t('employees.field.line2'), dataIndex: 'line2' },
            { title: t('employees.field.postalCode'), dataIndex: 'postalCode' },
            { title: t('employees.field.remarks'), dataIndex: 'remarks' }
          ]}
        />

        <Flex gap="middle" justify="center">
          <StyledButton
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
            variant="filled"
            color="default"
          >
            {t('global.cancel')}
          </StyledButton>

          <StyledButton
            icon={<CheckOutlined />}
            disabled={data.length == 0}
            variant="filled"
            color="primary"
            onClick={registerAll}
            loading={importPending}
          >
            {t('global.registerAll')}
          </StyledButton>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ImportEmployeesPage;
