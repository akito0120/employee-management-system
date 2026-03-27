import { trpc } from '@renderer/trpc';
import { Breadcrumb, Flex } from 'antd';
import { useParams } from 'react-router-dom';

const EmployeePromotionPage = () => {
  const params = useParams();
  const id = Number(params.id);
  const { data: empl } = trpc.employees.findEmployeeById.useQuery(id);

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb
        items={[
          { title: 'Employees' },
          { title: `${empl?.firstName} ${empl?.lastName}` },
          { title: 'Promotion' }
        ]}
      />
    </Flex>
  );
};

export default EmployeePromotionPage;
