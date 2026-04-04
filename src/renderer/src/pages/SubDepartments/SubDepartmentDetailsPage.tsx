import { trpc } from '@renderer/trpc';
import { Breadcrumb, Flex } from 'antd';
import { useTranslation } from 'react-i18next';
import { useParams } from 'react-router-dom';

const SubDepartmentDetailsPage = () => {
  const { t } = useTranslation();
  const params = useParams();
  const id = Number(params.id);
  const { data } = trpc.subDepartments.findSubDepartmentById.useQuery(id);

  if (!data) return null;

  return (
    <Flex style={{ width: '100%', height: '100%', padding: '2rem' }} vertical gap="large">
      <Breadcrumb items={[{ title: t('global.subDepartments') }, { title: data.name }]} />
    </Flex>
  );
};

export default SubDepartmentDetailsPage;
