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
import * as xlsx from 'xlsx';

type Employee = {
  name: string;
  age: number;
  email: string;
  phoneNumber: string;
  department: string;
};

const headerMap: Record<string, string> = {
  name: 'name',
  age: 'age',
  email: 'email',
  'phone-number': 'phoneNumber',
  department: 'department'
};

const ImportEmployeesPage = (): JSX.Element => {
  const { message } = useApp();
  const navigate = useNavigate();
  const [data, setData] = useState<Employee[]>([]);

  const appendData = (newData: Employee[]): void => {
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
      Papa.parse(file, {
        header: true,
        transformHeader: (header) => headerMap[header] || header,
        skipEmptyLines: 'greedy',
        dynamicTyping: true,

        complete: (results) => {
          appendData(results.data as Employee[]);
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
      const rawRows = xlsx.utils.sheet_to_json(worksheet, { defval: '' }) as Record<
        string,
        unknown
      >[];
      const formattedRows = rawRows.map((row) => {
        const formattedRow = {};
        Object.keys(row).forEach((key) => {
          const mappedKey = headerMap[key] || key;
          formattedRow[mappedKey] = row[key];
        });
        return formattedRow;
      });
      appendData(formattedRows as Employee[]);
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

        <Table<Employee>
          bordered
          dataSource={data}
          columns={[
            { title: 'Name', dataIndex: 'name' },
            { title: 'Age', dataIndex: 'age' },
            { title: 'Email', dataIndex: 'email' },
            { title: 'Phone Number', dataIndex: 'phoneNumber' },
            { title: 'Department', dataIndex: 'department' }
          ]}
        />

        <Flex gap="middle" justify="center">
          <Button
            icon={<LeftOutlined />}
            onClick={() => navigate('/employees')}
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
