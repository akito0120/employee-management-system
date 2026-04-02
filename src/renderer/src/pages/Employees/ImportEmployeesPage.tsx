import {
  CheckOutlined,
  ClearOutlined,
  DownloadOutlined,
  InboxOutlined,
  LeftOutlined
} from '@ant-design/icons';
import { Breadcrumb, Button, Flex, Table, Typography } from 'antd';
import useApp from 'antd/es/app/useApp';
import type { RcFile } from 'antd/es/upload';
import Dragger from 'antd/es/upload/Dragger';
import Papa from 'papaparse';
import { useState } from 'react';
import { JSX } from 'react/jsx-runtime';
import { useNavigate } from 'react-router-dom';
import { RegisterEmployeeRequest } from 'src/shared/dto/employees/register-employee.dto';
import * as xlsx from 'xlsx';

type RawEmployee = {
  firstName: string;
  lastName: string;
  code: string;
  birthDate: string;
  status: string;
  position: string;
  affiliation: string;
  isManager: string;
  lastPromotionDate: string;
  lastRaiseDate: string;
  email: string;
  phoneNumber: string;
  country: string;
  state: string;
  city: string;
  line1: string;
  line2: string;
  postalCode: string;
  remarks: string;
};

type ImportedEmployee = Omit<
  RawEmployee,
  'birthDate' | 'lastPromotionDate' | 'lastRaiseDate' | 'status'
> & {
  status: RegisterEmployeeRequest['status'];
  birthDate: Date;
  lastPromotionDate: Date;
  lastRaiseDate: Date;
};

const ImportEmployeesPage = (): JSX.Element => {
  const { message } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState<ImportedEmployee[]>([]);

  const appendData = (newData: ImportedEmployee[]): void => {
    console.log(newData);
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
              lastPromotionDate: new Date(item.lastPromotionDate),
              lastRaiseDate: new Date(item.lastRaiseDate),
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
          lastPromotionDate: new Date(item.lastPromotionDate),
          lastRaiseDate: new Date(item.lastRaiseDate),
          status: item.status as RegisterEmployeeRequest['status']
        }))
      );
      return Promise.reject();
    });
  };

  return (
    <Flex orientation="vertical">
      <Flex style={{ paddingTop: '2rem', paddingLeft: '2rem' }}>
        <Breadcrumb items={[{ title: 'Employees' }, { title: 'Import' }]} />
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
            Click or drag file to this area to upload
          </Typography.Paragraph>
          <Typography.Paragraph type="secondary">
            Supported format: .csv (UTF-8), .xlsx
          </Typography.Paragraph>
        </Dragger>

        <Flex style={{ paddingLeft: '1rem', marginTop: '1rem' }} justify="space-between">
          <Typography.Text type="secondary">Imported {data.length} record(s)</Typography.Text>

          <Flex gap="small">
            <Button
              icon={<ClearOutlined />}
              onClick={() => setData([])}
              variant="filled"
              color="default"
            >
              Clear
            </Button>

            <a href="./template.csv" download="template.csv">
              <Button icon={<DownloadOutlined />} variant="filled" color="default">
                CSV Template
              </Button>
            </a>

            <a href="./template.xlsx" download="template.xlsx">
              <Button icon={<DownloadOutlined />} variant="filled" color="default">
                Excel Template
              </Button>
            </a>
          </Flex>
        </Flex>

        <Table<ImportedEmployee>
          bordered
          dataSource={data}
          styles={{ header: { cell: { minWidth: '10rem' } } }}
          scroll={{ x: '100%' }}
          columns={[
            { title: 'First Name', dataIndex: 'firstName' },
            { title: 'Last Name', dataIndex: 'lastName' },
            { title: 'Code', dataIndex: 'code' },
            {
              title: 'Birth Date',
              dataIndex: 'birthDate',
              render: (value: Date) => value.toLocaleDateString()
            },
            { title: 'Status', dataIndex: 'status' },
            { title: 'Position', dataIndex: 'position' },
            { title: 'Affiliation', dataIndex: 'affiliation' },
            {
              title: 'Is Manager',
              dataIndex: 'isManager',
              render: (isManager: boolean) => (isManager ? 'True' : 'False')
            },
            {
              title: 'Last Promotion',
              dataIndex: 'lastPromotionDate',
              render: (value: Date) => value.toLocaleDateString()
            },
            {
              title: 'Last Raise',
              dataIndex: 'lastRaiseDate',
              render: (value: Date) => value.toLocaleDateString()
            },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Phone Number', dataIndex: 'phoneNumber' },
            { title: 'country', dataIndex: 'country' },
            { title: 'State', dataIndex: 'state' },
            { title: 'City', dataIndex: 'city' },
            { title: 'Line 1', dataIndex: 'line1' },
            { title: 'Line 2', dataIndex: 'line2' },
            { title: 'Postal Code', dataIndex: 'postalCode' },
            { title: 'Remarks', dataIndex: 'remarks' }
          ]}
        />

        <Flex gap="middle" justify="center">
          <Button
            icon={<LeftOutlined />}
            onClick={() => navigate(-1)}
            variant="filled"
            color="default"
          >
            Cancel
          </Button>

          <Button
            icon={<CheckOutlined />}
            disabled={data.length == 0}
            variant="filled"
            color="primary"
          >
            Register All
          </Button>
        </Flex>
      </Flex>
    </Flex>
  );
};

export default ImportEmployeesPage;
