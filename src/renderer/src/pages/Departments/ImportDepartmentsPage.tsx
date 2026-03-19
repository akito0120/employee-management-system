import { Breadcrumb, Flex } from 'antd';
import { JSX } from 'react/jsx-runtime';

const ImportDepartmentsPage = (): JSX.Element => {
  return (
    <Flex vertical gap="large" style={{ padding: '2rem' }}>
      <Breadcrumb items={[{ title: 'Departments' }, { title: 'Import' }]} />
    </Flex>
  );
};

export default ImportDepartmentsPage;
